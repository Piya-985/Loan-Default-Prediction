import re

with open("BACKEND/app.py", "r") as f:
    content = f.read()

# Patch get_models
def patch_model_dict(m):
    model_id = m.group(1)
    if model_id in ["linear_regression", "gradient_descent"]:
        metrics = f'**get_regression_metrics("{model_id}")'
    else:
        metrics = f'**get_classification_metrics("{model_id}")'
    return m.group(0).rstrip() + f',\n            {metrics}\n        }}'

content = re.sub(r'\{\s*"id":\s*"([^"]+)",\s*"name":\s*"[^"]+",\s*"type":\s*"[^"]+",\s*"purpose":\s*"[^"]+",\s*"available":\s*MODELS\["[^"]+"\] is not None\n\s*\}', patch_model_dict, content)

# Append new routes
new_routes = """
# ============================================================
# MODEL DETAILS & API DOCS (Scalar)
# ============================================================

@app.route("/api/models/<model_id>/details", methods=["GET"])
def get_model_details(model_id):
    if model_id not in MODEL_NAMES:
        return jsonify({"error": "Model not found"}), 404

    is_reg = model_id in ["linear_regression", "gradient_descent"]
    
    # Generate fallback details
    data = {
        "id": model_id,
        "name": MODEL_DISPLAY_NAMES.get(model_id),
        "type": "Regression" if is_reg else "Classification",
        "objective": "Predict Loan Amount using borrower and loan characteristics." if is_reg else "Binary classification predicting loan default (0 = No Default, 1 = Default).",
        "datasetInfo": {
            "name": "Loan_default.csv",
            "size": "~255k records",
            "split": "80% / 20% (Random State: 42)",
            "featuresCount": "7 numerical features" if is_reg else "16 before categorical encoding"
        },
        "confusionMatrix": None
    }
    
    if model_id == 'linear_regression':
        data["formula"] = "ŷ = β₀ + β₁X₁ + β₂X₂ + ... + βₖXₖ"
        data["hyperparams"] = { "Algorithm": "LinearRegression", "Preprocessing": "StandardScaler" }
        data["codeSnippet"] = "LinearRegression()"
        data["analysis"] = "Models the relationship between borrower/loan variables and LoanAmount."
    elif model_id == 'gradient_descent':
        data["formula"] = "θ := θ − α∇J(θ)"
        data["hyperparams"] = { "Learning Rate": "0.01", "Epochs": "1000", "Preprocessing": "StandardScaler" }
        data["codeSnippet"] = "learning_rate = 0.01\\nepochs = 1000\\nfor i in range(epochs):\\n    predictions = X_train_gd.dot(weights)\\n    errors = predictions - y_train_reg_np\\n    gradient = (1 / m) * X_train_gd.T.dot(errors)\\n    weights -= learning_rate * gradient"
        data["analysis"] = "Demonstrates iterative optimization of model parameters using a manually implemented gradient descent procedure."
    elif model_id == 'logistic_regression':
        data["formula"] = "P(Default = 1) = 1 / (1 + e^-(β₀ + β₁X₁ + ... + βₖXₖ))"
        data["hyperparams"] = { "max_iter": "1000", "random_state": "42", "Preprocessing": "StandardScaler + OneHotEncoder" }
        data["codeSnippet"] = "LogisticRegression(\\n    max_iter=1000,\\n    random_state=42\\n)"
        data["analysis"] = "Used as a baseline binary classification model for predicting loan default."
    elif model_id == 'decision_tree':
        data["formula"] = "Recursive feature-based splitting using decision thresholds."
        data["hyperparams"] = { "random_state": "42", "Preprocessing": "StandardScaler + OneHotEncoder" }
        data["codeSnippet"] = "DecisionTreeClassifier(\\n    random_state=42\\n)"
        data["analysis"] = "Uses recursive feature-based splits and is relatively easy to interpret."
    elif model_id == 'random_forest':
        data["formula"] = "ŷ = majority vote of multiple decision trees."
        data["hyperparams"] = { "n_estimators": "100", "random_state": "42", "Preprocessing": "StandardScaler + OneHotEncoder" }
        data["codeSnippet"] = "RandomForestClassifier(\\n    n_estimators=100,\\n    random_state=42\\n)"
        data["analysis"] = "Combines predictions from multiple decision trees to reduce dependence on a single tree."
    elif model_id == 'knn':
        data["formula"] = "ŷ = majority class among the k nearest observations."
        data["hyperparams"] = { "n_neighbors": "5", "Preprocessing": "StandardScaler + OneHotEncoder" }
        data["codeSnippet"] = "KNeighborsClassifier(\\n    n_neighbors=5\\n)"
        data["analysis"] = "Classifies an observation based on nearby observations in feature space."

    return jsonify(data)

@app.route('/openapi.json')
def openapi_spec():
    return jsonify({
        "openapi": "3.1.0",
        "info": {
            "title": "LoanGuard API",
            "version": "1.0.0"
        },
        "paths": {
            "/api/models": {
                "get": {
                    "summary": "Get all models"
                }
            },
            "/api/models/{model_id}/details": {
                "get": {
                    "summary": "Get details for a specific model"
                }
            },
            "/predict": {
                "post": {
                    "summary": "Predict using a model"
                }
            }
        }
    })

@app.route('/docs')
def scalar_docs():
    return \"\"\"
    <!doctype html>
    <html>
      <head>
        <title>LoanGuard API Reference</title>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <script
          id="api-reference"
          data-url="/openapi.json"></script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
    \"\"\"

"""

if "def get_model_details" not in content:
    content = content.replace("if __name__ == \\\"__main__\\\":", new_routes + "\\nif __name__ == \\\"__main__\\\":")

with open("BACKEND/app.py", "w") as f:
    f.write(content)

print("Patched BACKEND/app.py")
