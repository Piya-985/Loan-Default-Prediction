import requests

payload = {
    "model": "logistic_regression",
    "features": {
        "Age": 30,
        "Income": 50000,
        "Education": "",
        "EmploymentType": "",
        "MaritalStatus": "",
        "HasDependents": "",
        "LoanAmount": 20000,
        "CreditScore": 700,
        "MonthsEmployed": "",
        "NumCreditLines": "",
        "InterestRate": 5.5,
        "LoanTerm": 36,
        "DTIRatio": 0.3,
        "LoanPurpose": "",
        "HasMortgage": "",
        "HasCoSigner": ""
    }
}

r = requests.post("http://127.0.0.1:5001/predict", json=payload)
print(r.status_code)
print(r.json())
