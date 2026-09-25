import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import matplotlib.pyplot as plt

def main():
    print("Starting model training pipeline...")
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    data_path = os.path.join(base_dir, 'ML', 'DATASET', 'Loan_default.csv')
    models_dir = os.path.join(base_dir, 'BACKEND', 'model')
    results_dir = os.path.join(base_dir, 'ML', 'RESULTS')
    charts_dir = os.path.join(results_dir, 'charts')
    
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(results_dir, exist_ok=True)
    os.makedirs(charts_dir, exist_ok=True)

    print(f"Loading data from {data_path}")
    df = pd.read_csv(data_path)
    
    # ---------------------------------------------------------
    # Regression Task: Predict LoanAmount
    # Features: Age, Income, CreditScore, MonthsEmployed, InterestRate, LoanTerm, DTIRatio
    # ---------------------------------------------------------
    reg_features = ['Age', 'Income', 'CreditScore', 'MonthsEmployed', 'InterestRate', 'LoanTerm', 'DTIRatio']
    reg_target = 'LoanAmount'
    
    X_reg = df[reg_features]
    y_reg = df[reg_target]
    
    X_train_reg, X_test_reg, y_train_reg, y_test_reg = train_test_split(X_reg, y_reg, test_size=0.2, random_state=42)
    
    reg_preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), reg_features)
        ])
    
    print("Training Linear Regression...")
    lr_pipeline = Pipeline([
        ('preprocessor', reg_preprocessor),
        ('model', LinearRegression())
    ])
    lr_pipeline.fit(X_train_reg, y_train_reg)
    y_pred_lr = lr_pipeline.predict(X_test_reg)
    mse_lr = mean_squared_error(y_test_reg, y_pred_lr)
    r2_lr = r2_score(y_test_reg, y_pred_lr)
    
    joblib.dump(lr_pipeline, os.path.join(models_dir, 'linear_regression.pkl'))
    
    print("Training Gradient Descent for Linear Regression...")
    # Manual Gradient Descent
    X_train_reg_scaled = reg_preprocessor.fit_transform(X_train_reg)
    X_test_reg_scaled = reg_preprocessor.transform(X_test_reg)
    
    # Add intercept term
    X_train_gd = np.c_[np.ones(X_train_reg_scaled.shape[0]), X_train_reg_scaled]
    X_test_gd = np.c_[np.ones(X_test_reg_scaled.shape[0]), X_test_reg_scaled]
    
    # Gradient Descent Parameters
    learning_rate = 0.01
    epochs = 1000
    m = X_train_gd.shape[0]
    weights = np.zeros(X_train_gd.shape[1])
    loss_history = []
    
    y_train_reg_np = y_train_reg.values
    for i in range(epochs):
        predictions = X_train_gd.dot(weights)
        errors = predictions - y_train_reg_np
        loss = (1 / (2 * m)) * np.sum(errors ** 2)
        loss_history.append(loss)
        
        gradient = (1 / m) * X_train_gd.T.dot(errors)
        weights -= learning_rate * gradient
        
    y_pred_gd = X_test_gd.dot(weights)
    mse_gd = mean_squared_error(y_test_reg, y_pred_gd)
    r2_gd = r2_score(y_test_reg, y_pred_gd)
    
    gd_model = {
        'weights': weights[1:], # Exclude intercept
        'bias': weights[0],     # Intercept
        'scaler': reg_preprocessor,
        'features': reg_features,
        'learning_rate': learning_rate,
        'epochs': epochs,
        'final_loss': loss_history[-1]
    }
    joblib.dump(gd_model, os.path.join(models_dir, 'gradient_descent.pkl'))
    
    plt.figure()
    plt.plot(range(epochs), loss_history)
    plt.title('Gradient Descent Loss Curve')
    plt.xlabel('Epochs')
    plt.ylabel('Loss (MSE)')
    plt.savefig(os.path.join(charts_dir, 'gd_loss_curve.png'))
    plt.close()
    
    # ---------------------------------------------------------
    # Classification Task: Predict Default
    # Features: All appropriate features except LoanID, Default
    # ---------------------------------------------------------
    clf_features_num = ['Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed', 'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio']
    clf_features_cat = ['Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage', 'HasDependents', 'LoanPurpose', 'HasCoSigner']
    clf_features = clf_features_num + clf_features_cat
    clf_target = 'Default'
    
    X_clf = df[clf_features]
    y_clf = df[clf_target]
    
    X_train_clf, X_test_clf, y_train_clf, y_test_clf = train_test_split(X_clf, y_clf, test_size=0.2, random_state=42)
    
    clf_preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), clf_features_num),
            ('cat', OneHotEncoder(handle_unknown='ignore'), clf_features_cat)
        ])
    
    models = {
        'Logistic Regression': ('logistic_regression', LogisticRegression(max_iter=1000, random_state=42)),
        'Decision Tree': ('decision_tree', DecisionTreeClassifier(random_state=42)),
        'Random Forest': ('random_forest', RandomForestClassifier(n_estimators=100, random_state=42)),
        'KNN': ('knn', KNeighborsClassifier(n_neighbors=5))
    }
    
    results = []
    
    # Regression results
    results.append({
        'Model': 'Linear Regression',
        'Type': 'Regression',
        'MSE': mse_lr,
        'R2 Score': r2_lr,
        'Accuracy': None,
        'Precision': None,
        'Recall': None,
        'F1 Score': None
    })
    
    results.append({
        'Model': 'Gradient Descent',
        'Type': 'Regression',
        'MSE': mse_gd,
        'R2 Score': r2_gd,
        'Accuracy': None,
        'Precision': None,
        'Recall': None,
        'F1 Score': None
    })
    
    for name, (filename, model) in models.items():
        print(f"Training {name}...")
        pipeline = Pipeline([
            ('preprocessor', clf_preprocessor),
            ('model', model)
        ])
        
        pipeline.fit(X_train_clf, y_train_clf)
        y_pred = pipeline.predict(X_test_clf)
        
        acc = accuracy_score(y_test_clf, y_pred)
        prec = precision_score(y_test_clf, y_pred, zero_division=0)
        rec = recall_score(y_test_clf, y_pred, zero_division=0)
        f1 = f1_score(y_test_clf, y_pred, zero_division=0)
        
        joblib.dump(pipeline, os.path.join(models_dir, f'{filename}.pkl'))
        
        results.append({
            'Model': name,
            'Type': 'Classification',
            'MSE': None,
            'R2 Score': None,
            'Accuracy': acc,
            'Precision': prec,
            'Recall': rec,
            'F1 Score': f1
        })
        
    results_df = pd.DataFrame(results)
    results_df.to_csv(os.path.join(results_dir, 'model_comparison.csv'), index=False)
    
    # Plot accuracy comparison
    clf_results = results_df[results_df['Type'] == 'Classification']
    plt.figure(figsize=(10, 6))
    plt.bar(clf_results['Model'], clf_results['Accuracy'], color=['blue', 'green', 'red', 'purple'])
    plt.title('Classification Models Accuracy Comparison')
    plt.ylabel('Accuracy')
    plt.ylim(0, 1)
    plt.savefig(os.path.join(charts_dir, 'accuracy_comparison.png'))
    plt.close()

    print("Training complete! Models saved.")
    print("\nModel Comparison:")
    print(results_df)

if __name__ == '__main__':
    main()
