#http://127.0.0.1:5001/health
#http://127.0.0.1:5001/api/models
#gunicorn --bind 0.0.0.0:5001 --workers 2 --timeout 120 app:app

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import pandas as pd
import numpy as np


app = Flask(__name__)

# ============================================================
# CORS
# ============================================================

allowed_origins = [
    "http://localhost:3000",    
    "http://localhost:5173"
]

# Add deployed frontend URL through environment variable later.
frontend_url = os.getenv("FRONTEND_URL")

if frontend_url:
    allowed_origins.append(frontend_url)

CORS(app, origins=allowed_origins)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODELS_DIR = os.path.join(
    BASE_DIR,
    "BACKEND",
    "model"
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "ML",
    "DATASET",
    "Loan_default.csv"
)

RESULTS_PATH = os.path.join(
    BASE_DIR,
    "ML",
    "RESULTS",
    "model_comparison.csv"
)


# ============================================================
# MODEL LOADING
# ============================================================

def load_model(name):
    path = os.path.join(MODELS_DIR, f"{name}.pkl")

    if not os.path.exists(path):
        print(f"Model not found: {path}")
        return None

    try:
        return joblib.load(path)
    except Exception as e:
        print(f"Could not load {name}: {e}")
        return None


MODEL_NAMES = [
    "linear_regression",
    "gradient_descent",
    "logistic_regression",
    "decision_tree",
    "random_forest",
    "knn"
]

MODELS = {}


def model_available(name):
    path = os.path.join(MODELS_DIR, f"{name}.pkl")
    return os.path.exists(path)

# ============================================================
# MODEL DISPLAY NAMES
# ============================================================

MODEL_DISPLAY_NAMES = {
    "linear_regression": "Linear Regression",
    "gradient_descent": "Gradient Descent",
    "logistic_regression": "Logistic Regression",
    "decision_tree": "Decision Tree",
    "random_forest": "Random Forest",
    "knn": "KNN"
}


# ============================================================
# LOAD MODEL METRICS
# ============================================================

def load_metrics():
    if not os.path.exists(RESULTS_PATH):
        return pd.DataFrame()

    try:
        return pd.read_csv(RESULTS_PATH)
    except Exception as e:
        print(f"Could not load model metrics: {e}")
        return pd.DataFrame()


MODEL_METRICS = load_metrics()


def get_classification_metrics(model_name):
    if MODEL_METRICS.empty:
        return {
            "accuracy": None,
            "precision": None,
            "recall": None,
            "f1Score": None
        }

    display_name = MODEL_DISPLAY_NAMES.get(model_name)

    if "Model" not in MODEL_METRICS.columns:
        return {
            "accuracy": None,
            "precision": None,
            "recall": None,
            "f1Score": None
        }

    row = MODEL_METRICS[
        MODEL_METRICS["Model"] == display_name
    ]

    if row.empty:
        return {
            "accuracy": None,
            "precision": None,
            "recall": None,
            "f1Score": None
        }

    row = row.iloc[0]

    return {
        "accuracy": float(row["Accuracy"])
        if "Accuracy" in row and pd.notna(row["Accuracy"])
        else None,

        "precision": float(row["Precision"])
        if "Precision" in row and pd.notna(row["Precision"])
        else None,

        "recall": float(row["Recall"])
        if "Recall" in row and pd.notna(row["Recall"])
        else None,

        "f1Score": float(row["F1 Score"])
        if "F1 Score" in row and pd.notna(row["F1 Score"])
        else None
    }


def get_regression_metrics(model_name):
    if MODEL_METRICS.empty:
        return {
            "mse": None,
            "r2Score": None
        }

    display_name = MODEL_DISPLAY_NAMES.get(model_name)

    if "Model" not in MODEL_METRICS.columns:
        return {
            "mse": None,
            "r2Score": None
        }

    row = MODEL_METRICS[
        MODEL_METRICS["Model"] == display_name
    ]

    if row.empty:
        return {
            "mse": None,
            "r2Score": None
        }

    row = row.iloc[0]

    return {
        "mse": float(row["MSE"])
        if "MSE" in row and pd.notna(row["MSE"])
        else None,

        "r2Score": float(row["R2 Score"])
        if "R2 Score" in row and pd.notna(row["R2 Score"])
        else None
    }


# ============================================================
# HEALTH
# ============================================================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "Loan ML API"
    })


# ============================================================
# MODELS
# ============================================================

@app.route("/api/models", methods=["GET"])
def get_models():

    models = [
        {
            "id": "linear_regression",
            "name": "Linear Regression",
            "type": "Regression",
            "purpose": "Predict Loan Amount",
            "available": model_available("linear_regression"),
            **get_regression_metrics("linear_regression")
        },
        {
            "id": "gradient_descent",
            "name": "Gradient Descent",
            "type": "Regression",
            "purpose": "Predict Loan Amount",
            "available": model_available("gradient_descent"),
            **get_regression_metrics("gradient_descent")
        },
        {
            "id": "logistic_regression",
            "name": "Logistic Regression",
            "type": "Classification",
            "purpose": "Predict Loan Default",
            "available": model_available("logistic_regression"),
            **get_classification_metrics("logistic_regression")
        },
        {
            "id": "decision_tree",
            "name": "Decision Tree",
            "type": "Classification",
            "purpose": "Predict Loan Default",
            "available": model_available("decision_tree"),
            **get_classification_metrics("decision_tree")
        },
        {
            "id": "random_forest",
            "name": "Random Forest",
            "type": "Classification",
            "purpose": "Predict Loan Default",
            "available": model_available("random_forest"),
            **get_classification_metrics("random_forest")
        },
        {
            "id": "knn",
            "name": "KNN",
            "type": "Classification",
            "purpose": "Predict Loan Default",
            "available": model_available("knn"),
            **get_classification_metrics("knn")
        }
    ]

    return jsonify(models)


# ============================================================
# DATASET SAMPLES
# ============================================================

@app.route("/api/dataset/samples", methods=["GET"])
def get_samples():

    try:
        # Number of records per page
        limit = request.args.get("limit", default=10, type=int)

        # Starting position
        offset = request.args.get("offset", default=0, type=int)

        # Keep values safe
        limit = max(1, min(limit, 50))
        offset = max(0, offset)

        if not os.path.exists(DATASET_PATH):
            return jsonify({
                "error": "Dataset file not found"
            }), 500

        df = pd.read_csv(DATASET_PATH)

        if len(df) == 0:
            return jsonify({
                "error": "Dataset is empty"
            }), 500

        total_records = len(df)

        # Make sure offset is inside dataset
        if offset >= total_records:
            return jsonify({
                "samples": [],
                "total": total_records,
                "limit": limit,
                "offset": offset,
                "hasNext": False,
                "hasPrevious": offset > 0
            })

        # Get only the requested page
        samples = df.iloc[offset:offset + limit]

        formatted_samples = []

        for _, row in samples.iterrows():

            expected = (
                "Default"
                if int(row["Default"]) == 1
                else "No Default"
            )

            formatted_samples.append({
                # Real LoanID from CSV
                "id": str(row["LoanID"]),
                "LoanID": str(row["LoanID"]),

                "Age": row["Age"],
                "Income": row["Income"],
                "LoanAmount": row["LoanAmount"],
                "CreditScore": row["CreditScore"],
                "MonthsEmployed": row["MonthsEmployed"],
                "NumCreditLines": row["NumCreditLines"],
                "InterestRate": row["InterestRate"],
                "LoanTerm": row["LoanTerm"],
                "DTIRatio": row["DTIRatio"],

                "Education": row["Education"],
                "EmploymentType": row["EmploymentType"],
                "MaritalStatus": row["MaritalStatus"],
                "HasMortgage": row["HasMortgage"],
                "HasDependents": row["HasDependents"],
                "LoanPurpose": row["LoanPurpose"],
                "HasCoSigner": row["HasCoSigner"],

                # Actual value from CSV
                "expectedOutcome": expected,
                "Default": int(row["Default"])
            })

        return jsonify({
            "samples": formatted_samples,
            "total": total_records,
            "limit": limit,
            "offset": offset,
            "hasNext": offset + limit < total_records,
            "hasPrevious": offset > 0
        })

    except Exception as e:

        return jsonify({
            "error": "Could not load sample data",
            "details": str(e)
        }), 500


# ============================================================
# PREDICTION
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "error": "Request body must contain JSON"
            }), 400

        model_name = data.get("model")
        features = data.get("features")

        if not model_name:
            return jsonify({
                "error": "Model is required"
            }), 400

        if not features:
            return jsonify({
                "error": "Features are required"
            }), 400

        if model_name not in MODEL_NAMES:
            return jsonify({
                "error": f"Unsupported model: {model_name}"
            }), 400

        model = MODELS.get(model_name)

        # Reload if necessary
        if model is None:

            model = load_model(model_name)

            if model is None:
                return jsonify({
                    "error": f"Model '{model_name}' could not be loaded"
                }), 500

            MODELS[model_name] = model

        df_features = pd.DataFrame([features])

        # ====================================================
        # REGRESSION
        # ====================================================

        if model_name == "linear_regression":

            prediction = model.predict(df_features)[0]

            metrics = get_regression_metrics(
                "linear_regression"
            )

            return jsonify({
                "success": True,
                "model": "Linear Regression",
                "modelName": "Linear Regression",
                "predictedLoanAmount": float(prediction),
                "mse": metrics["mse"],
                "r2Score": metrics["r2Score"]
            })

        # ====================================================
        # GRADIENT DESCENT
        # ====================================================

        if model_name == "gradient_descent":

            # Expected structure:
            #
            # {
            #   "scaler": ...,
            #   "features": [...],
            #   "weights": [...],
            #   "bias": ...,
            #   "final_loss": ...,
            #   "learning_rate": ...,
            #   "epochs": ...
            # }

            if not isinstance(model, dict):
                return jsonify({
                    "error": "Gradient Descent model artifact has an unexpected format"
                }), 500

            required_keys = [
                "scaler",
                "features",
                "weights",
                "bias"
            ]

            missing_keys = [
                key for key in required_keys
                if key not in model
            ]

            if missing_keys:
                return jsonify({
                    "error": "Gradient Descent model is missing required fields",
                    "missing": missing_keys
                }), 500

            gd_features = model["features"]

            X_input = df_features[gd_features]

            X_scaled = model["scaler"].transform(X_input)

            weights = np.asarray(model["weights"])
            bias = float(model["bias"])

            prediction = (
                np.dot(X_scaled, weights) + bias
            )[0]

            metrics = get_regression_metrics(
                "gradient_descent"
            )

            return jsonify({
                "success": True,
                "model": "Gradient Descent",
                "modelName": "Gradient Descent",
                "predictedLoanAmount": float(prediction),
                "mse": metrics["mse"],
                "r2Score": metrics["r2Score"],
                "finalLoss": float(model.get("final_loss", 0)),
                "learningRate": float(model.get("learning_rate", 0)),
                "epochs": int(model.get("epochs", 0))
            })

        # ====================================================
        # CLASSIFICATION
        # ====================================================

        prediction = model.predict(df_features)[0]

        probability = None

        if hasattr(model, "predict_proba"):

            probabilities = model.predict_proba(
                df_features
            )[0]

            classes = list(model.classes_)

            if 1 in classes:

                default_index = classes.index(1)

                probability = float(
                    probabilities[default_index]
                )

        prediction_label = (
            "Default"
            if int(prediction) == 1
            else "No Default"
        )

        metrics = get_classification_metrics(
            model_name
        )

        return jsonify({
            "success": True,
            "model": MODEL_DISPLAY_NAMES[model_name],
            "modelName": MODEL_DISPLAY_NAMES[model_name],
            "prediction": int(prediction),
            "predictionLabel": prediction_label,
            "defaultProbability": probability,
            "accuracy": metrics["accuracy"],
            "precision": metrics["precision"],
            "recall": metrics["recall"],
            "f1Score": metrics["f1Score"]
        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "success": False,
            "error": "Prediction failed",
            "details": str(e)
        }), 500


# ============================================================
# LOCAL DEVELOPMENT
# ============================================================

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5001))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=True
    )