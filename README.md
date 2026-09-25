# LoanGuard ML Platform

LoanGuard is a full-stack Machine Learning web application that predicts loan defaults (Classification) and expected loan amounts (Regression) using real-world financial data.

## Project Architecture

- **Frontend**: React + Vite application for user interaction.
- **Backend**: Python Flask REST API that serves machine learning models.
- **Machine Learning**: Six unique models trained using Scikit-Learn.
- **Dataset**: `Loan_default.csv` containing over 250k rows.

## Folder Structure

```
Loan-Project-ML/
├── FRONTEND/                # React application
├── BACKEND/                 # Flask API and saved models
│   ├── app.py               # Main Flask application
│   └── model/               # Serialized model artifacts (.pkl)
├── ML/                      # Machine learning resources
│   ├── DATASET/             # Real CSV dataset
│   ├── EDA/                 # Exploratory data analysis notebooks
│   ├── PYTHON/              # Training scripts (train_all.py)
│   └── RESULTS/             # Metrics and comparison charts
├── EXTRA/                   # Original resources
└── README.md                # Project documentation
```

## ML Algorithms

1. **Linear Regression** (Regression)
2. **Gradient Descent** (Regression)
3. **Logistic Regression** (Classification)
4. **Decision Tree** (Classification)
5. **Random Forest** (Classification)
6. **KNN** (Classification)

## Setup & Installation

### 1. Train the Models
First, you need to train the machine learning models. Ensure you have Python installed.

```bash
# Navigate to project root
pip install -r BACKEND/requirements.txt
python ML/PYTHON/train_all.py
```
This will train all 6 models and save them to `BACKEND/model/`.

### 2. Start the Backend API
Start the Flask server.

```bash
cd BACKEND
python app.py
```
The backend will run on `http://127.0.0.1:5001`.

### 3. Start the Frontend
In a new terminal window, start the React frontend.

```bash
cd FRONTEND
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## API Endpoints

- `GET /health` - Check API health
- `GET /api/models` - List available ML models
- `GET /api/dataset/samples?limit=5` - Fetch real sample records from the dataset
- `POST /predict` - Perform a prediction

### Example API Request (POST /predict)
```json
{
  "model": "logistic_regression",
  "features": {
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
}
```

### Example API Response
```json
{
  "model": "Logistic Regression",
  "prediction": 0,
  "predictionLabel": "No Default",
  "defaultProbability": 0.15,
  "accuracy": 0.88,
  "precision": 0.80,
  "recall": 0.70,
  "f1Score": 0.75,
  "confusionMatrix": []
}
```

## Troubleshooting

- **Models not loading**: Ensure you run `train_all.py` before starting the Flask app.
- **CORS Errors**: Ensure the Flask server is running and `VITE_API_URL` is set correctly in `FRONTEND/.env`.
