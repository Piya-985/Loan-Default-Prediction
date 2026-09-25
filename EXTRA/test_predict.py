import requests
import json

payload = {
    "model": "logistic_regression",
    "features": {
        "Age": 30,
        "Income": 50000,
        "Education": "High School",
        "EmploymentType": "Full-time",
        "MaritalStatus": "Single",
        "HasDependents": "No",
        "LoanAmount": 20000,
        "CreditScore": 700,
        "MonthsEmployed": 12,
        "NumCreditLines": 3,
        "InterestRate": 5.5,
        "LoanTerm": 36,
        "DTIRatio": 0.3,
        "LoanPurpose": "Other",
        "HasMortgage": "No",
        "HasCoSigner": "No"
    }
}

r = requests.post("http://127.0.0.1:5001/predict", json=payload)
print(r.status_code)
print(r.json())
