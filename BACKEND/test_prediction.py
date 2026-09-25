import requests
import json

BASE_URL = "http://127.0.0.1:5001"


sample_features = {
    "Age": 35,
    "Income": 65000,
    "LoanAmount": 25000,
    "CreditScore": 710,
    "MonthsEmployed": 42,
    "NumCreditLines": 3,
    "InterestRate": 9.5,
    "LoanTerm": 36,
    "DTIRatio": 0.32,

    "Education": "Bachelor's",
    "EmploymentType": "Full-time",
    "MaritalStatus": "Married",
    "HasMortgage": "No",
    "HasDependents": "No",
    "LoanPurpose": "Personal",
    "HasCoSigner": "Yes"
}


def test_health():

    print("\n==============================")
    print("Testing /health")
    print("==============================")

    response = requests.get(
        f"{BASE_URL}/health"
    )

    print("Status:", response.status_code)
    print("Response:", response.json())


def test_models():

    print("\n==============================")
    print("Testing /api/models")
    print("==============================")

    response = requests.get(
        f"{BASE_URL}/api/models"
    )

    print("Status:", response.status_code)

    models = response.json()

    print(
        json.dumps(
            models,
            indent=2
        )
    )


def test_samples():

    print("\n==============================")
    print("Testing /api/dataset/samples")
    print("==============================")

    response = requests.get(
        f"{BASE_URL}/api/dataset/samples?limit=3"
    )

    print("Status:", response.status_code)

    print(
        json.dumps(
            response.json(),
            indent=2
        )
    )


def test_predict(model_name):

    print("\n==============================")
    print(f"Testing {model_name}")
    print("==============================")

    payload = {
        "model": model_name,
        "features": sample_features
    }

    response = requests.post(
        f"{BASE_URL}/predict",
        json=payload
    )

    print("Status:", response.status_code)

    try:

        result = response.json()

        print(
            json.dumps(
                result,
                indent=2
            )
        )

    except Exception:

        print(response.text)


if __name__ == "__main__":

    try:

        test_health()

        test_models()

        test_samples()

        models = [
            "linear_regression",
            "gradient_descent",
            "logistic_regression",
            "decision_tree",
            "random_forest",
            "knn"
        ]

        for model in models:
            test_predict(model)

        print("\nAll API tests completed.")

    except requests.exceptions.ConnectionError:

        print(
            "\nERROR: Could not connect to Flask."
        )

        print(
            "Make sure the backend is running:"
        )

        print(
            "python app.py"
        )