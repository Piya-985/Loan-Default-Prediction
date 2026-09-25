import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Copy, Check } from 'lucide-react';
import { getModelDetails } from '../services/predictionApi';

const CodeSnippet = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-wrapper">
      <pre><code>{code}</code></pre>
      <button className="copy-btn" onClick={handleCopy} title="Copy code">
        {copied ? <Check size={18} color="#A8E6BD" /> : <Copy size={18} />}
      </button>
    </div>
  );
};

const ModelDetailModal = ({ model, models, onClose, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Esc key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Fetch details
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    // Check if the backend has this endpoint implemented.
    // If not, we will fallback to hardcoded details based on the user prompt logic.
    getModelDetails(model.id)
      .then(data => {
        if (mounted) {
          setDetails(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log("Using fallback details, backend endpoint might not exist yet:", err);
        if (mounted) {
          setDetails(getFallbackDetails(model));
          setLoading(false);
        }
      });
      
    return () => { mounted = false; };
  }, [model.id]);

  const currentIndex = models.findIndex(m => m.id === model.id);
  
  const handlePrev = () => {
    const prevModel = models[(currentIndex - 1 + models.length) % models.length];
    onNavigate(prevModel);
  };
  
  const handleNext = () => {
    const nextModel = models[(currentIndex + 1) % models.length];
    onNavigate(nextModel);
  };

  const isCls = model.type === 'Classification';

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target.classList.contains('modal-overlay')) onClose();
    }}>
      <div className="modal-content">
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className={`model-badge ${isCls ? 'classification' : 'regression'}`} style={{ width: 'fit-content' }}>
              {model.type}
            </span>
            <h2 className="modal-title">{model.name}</h2>
            <p className="modal-desc">{model.purpose}</p>
          </div>
          
          <div className="modal-controls">
            <button className="icon-btn" onClick={handlePrev} title="Previous Model">
              <ArrowLeft size={20} />
            </button>
            <button className="icon-btn" onClick={handleNext} title="Next Model">
              <ArrowRight size={20} />
            </button>
            <button className="icon-btn close-btn" onClick={onClose} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Formula
          </button>
          <button 
            className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
          <button 
            className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            Python Code
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            Faculty Insight & Analysis
          </button>
        </div>
        
        {/* Body */}
        <div className="modal-body">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-sub)' }}>
              Loading model details...
            </div>
          ) : (
            <div className="tab-content">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="tab-section">
                  <h3>Objective & Definition</h3>
                  <p style={{ marginBottom: '24px', color: 'var(--text-sub)' }}>
                    {details.objective}
                  </p>
                  
                  <h3>Mathematical Formulation</h3>
                  <div className="formula-block" style={{ marginBottom: '32px' }}>
                    {details.formula}
                  </div>
                  
                  <h3>Hyperparameters & Execution Details</h3>
                  <div className="info-cards" style={{ marginBottom: '32px' }}>
                    {details.hyperparams && Object.entries(details.hyperparams).map(([key, val]) => (
                      <div className="info-card" key={key}>
                        <span className="info-label">{key}</span>
                        <span className="info-value">{val}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3>Dataset Information</h3>
                  <div className="info-cards">
                    <div className="info-card">
                      <span className="info-label">Dataset</span>
                      <span className="info-value">{details.datasetInfo.name}</span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Size</span>
                      <span className="info-value">{details.datasetInfo.size}</span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Train / Test</span>
                      <span className="info-value">{details.datasetInfo.split}</span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Features</span>
                      <span className="info-value">{details.datasetInfo.featuresCount}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* TAB 2: PERFORMANCE */}
              {activeTab === 'performance' && (
                <div className="tab-section">
                  <h3>Evaluation Metrics</h3>
                  <div className="metrics-grid">
                    {isCls ? (
                      <>
                        <div className="metric-box">
                          <span className="label">Accuracy</span>
                          <span className="value">{(model.accuracy * 100).toFixed(2)}%</span>
                        </div>
                        <div className="metric-box">
                          <span className="label">Precision</span>
                          <span className="value">{(model.precision * 100).toFixed(2)}%</span>
                        </div>
                        <div className="metric-box">
                          <span className="label">Recall</span>
                          <span className="value">{(model.recall * 100).toFixed(2)}%</span>
                        </div>
                        <div className="metric-box">
                          <span className="label">F1 Score</span>
                          <span className="value">{(model.f1Score * 100).toFixed(2)}%</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="metric-box">
                          <span className="label">MSE</span>
                          <span className="value">{model.mse.toExponential(2)}</span>
                        </div>
                        <div className="metric-box">
                          <span className="label">R² Score</span>
                          <span className="value">{model.r2Score.toFixed(4)}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {isCls && (
                    <>
                      <h3>Confusion Matrix</h3>
                      {details.confusionMatrix ? (
                        <div className="cm-fallback">
                           (Implement actual CM rendering here if backend provides it)
                        </div>
                      ) : (
                        <div className="cm-fallback">
                          Confusion matrix data not currently exposed by backend.
                        </div>
                      )}
                    </>
                  )}
                  
                  {!isCls && (
                    <p style={{ color: 'var(--text-sub)' }}>
                      Note: Mean Squared Error (MSE) measures the average squared difference between the estimated values and the actual value. R² Score measures the proportion of variance in the dependent variable that can be predicted.
                    </p>
                  )}
                </div>
              )}
              
              {/* TAB 3: CODE */}
              {activeTab === 'code' && (
                <div className="tab-section">
                  <h3>Implementation Snippet</h3>
                  <p style={{ marginBottom: '16px', color: 'var(--text-sub)' }}>
                    Actual implementation extracted from <code>ML/PYTHON/train_all.py</code>.
                  </p>
                  <CodeSnippet code={details.codeSnippet} />
                </div>
              )}
              
              {/* TAB 4: ANALYSIS */}
              {activeTab === 'analysis' && (
                <div className="tab-section">
                  <h3>Faculty Insight & Analysis</h3>
                  <p style={{ color: 'var(--text-sub)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
                    {details.analysis}
                  </p>
                  
                  <h3>How to interpret the metrics</h3>
                  <div className="info-cards" style={{ marginTop: '16px' }}>
                    {isCls ? (
                      <>
                        <div className="info-card">
                          <span className="info-label">Accuracy</span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>Percentage of all predictions that are correct.</span>
                        </div>
                        <div className="info-card">
                          <span className="info-label">Precision</span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>Among predicted defaults, how many were actually defaults.</span>
                        </div>
                        <div className="info-card">
                          <span className="info-label">Recall</span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>Among actual defaults, how many were correctly identified.</span>
                        </div>
                        <div className="info-card">
                          <span className="info-label">F1 Score</span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>Harmonic mean of precision and recall.</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="info-card">
                          <span className="info-label">MSE</span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>Average squared prediction error.</span>
                        </div>
                        <div className="info-card">
                          <span className="info-label">R² Score</span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>Measures how much variance in the target is explained by the regression model.</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

// Fallback logic in case the API isn't ready
function getFallbackDetails(model) {
  const isReg = model.type === 'Regression';
  const data = {
    objective: isReg ? "Predict Loan Amount using borrower and loan characteristics." : "Binary classification predicting loan default (0 = No Default, 1 = Default).",
    datasetInfo: {
      name: "Loan_default.csv",
      size: "~255k records",
      split: "80% / 20% (Random State: 42)",
      featuresCount: isReg ? "7 numerical features" : "16 before categorical encoding"
    },
    confusionMatrix: null
  };
  
  if (model.id === 'linear_regression') {
    data.formula = "ŷ = β₀ + β₁X₁ + β₂X₂ + ... + βₖXₖ";
    data.hyperparams = { "Algorithm": "LinearRegression", "Preprocessing": "StandardScaler" };
    data.codeSnippet = `reg_preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), reg_features)
    ])

lr_pipeline = Pipeline([
    ('preprocessor', reg_preprocessor),
    ('model', LinearRegression())
])
lr_pipeline.fit(X_train_reg, y_train_reg)
y_pred_lr = lr_pipeline.predict(X_test_reg)`;
    data.analysis = "Models the relationship between borrower/loan variables and LoanAmount.";
  } else if (model.id === 'gradient_descent') {
    data.formula = "θ := θ − α∇J(θ)";
    data.hyperparams = { "Learning Rate": "0.01", "Epochs": "1000", "Preprocessing": "StandardScaler" };
    data.codeSnippet = `# Gradient Descent Parameters
learning_rate = 0.01
epochs = 1000
m = X_train_gd.shape[0]
weights = np.zeros(X_train_gd.shape[1])

for i in range(epochs):
    predictions = X_train_gd.dot(weights)
    errors = predictions - y_train_reg_np
    
    gradient = (1 / m) * X_train_gd.T.dot(errors)
    weights -= learning_rate * gradient`;
    data.analysis = "Demonstrates iterative optimization of model parameters using a manually implemented gradient descent procedure.";
  } else if (model.id === 'logistic_regression') {
    data.formula = "P(Default = 1) = 1 / (1 + e^-(β₀ + β₁X₁ + ... + βₖXₖ))";
    data.hyperparams = { "max_iter": "1000", "random_state": "42", "Preprocessing": "StandardScaler + OneHotEncoder" };
    data.codeSnippet = `clf_preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), clf_features_num),
        ('cat', OneHotEncoder(handle_unknown='ignore'), clf_features_cat)
    ])

pipeline = Pipeline([
    ('preprocessor', clf_preprocessor),
    ('model', LogisticRegression(max_iter=1000, random_state=42))
])

pipeline.fit(X_train_clf, y_train_clf)
y_pred = pipeline.predict(X_test_clf)`;
    data.analysis = "Used as a baseline binary classification model for predicting loan default.";
  } else if (model.id === 'decision_tree') {
    data.formula = "Recursive feature-based splitting using decision thresholds.";
    data.hyperparams = { "random_state": "42", "Preprocessing": "StandardScaler + OneHotEncoder" };
    data.codeSnippet = `clf_preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), clf_features_num),
        ('cat', OneHotEncoder(handle_unknown='ignore'), clf_features_cat)
    ])

pipeline = Pipeline([
    ('preprocessor', clf_preprocessor),
    ('model', DecisionTreeClassifier(random_state=42))
])

pipeline.fit(X_train_clf, y_train_clf)
y_pred = pipeline.predict(X_test_clf)`;
    data.analysis = "Uses recursive feature-based splits and is relatively easy to interpret.";
  } else if (model.id === 'random_forest') {
    data.formula = "ŷ = majority vote of multiple decision trees.";
    data.hyperparams = { "n_estimators": "100", "random_state": "42", "Preprocessing": "StandardScaler + OneHotEncoder" };
    data.codeSnippet = `clf_preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), clf_features_num),
        ('cat', OneHotEncoder(handle_unknown='ignore'), clf_features_cat)
    ])

pipeline = Pipeline([
    ('preprocessor', clf_preprocessor),
    ('model', RandomForestClassifier(n_estimators=100, random_state=42))
])

pipeline.fit(X_train_clf, y_train_clf)
y_pred = pipeline.predict(X_test_clf)`;
    data.analysis = "Combines predictions from multiple decision trees to reduce dependence on a single tree.";
  } else if (model.id === 'knn') {
    data.formula = "ŷ = majority class among the k nearest observations.";
    data.hyperparams = { "n_neighbors": "5", "Preprocessing": "StandardScaler + OneHotEncoder" };
    data.codeSnippet = `clf_preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), clf_features_num),
        ('cat', OneHotEncoder(handle_unknown='ignore'), clf_features_cat)
    ])

pipeline = Pipeline([
    ('preprocessor', clf_preprocessor),
    ('model', KNeighborsClassifier(n_neighbors=5))
])

pipeline.fit(X_train_clf, y_train_clf)
y_pred = pipeline.predict(X_test_clf)`;
    data.analysis = "Classifies an observation based on nearby observations in feature space.";
  }
  
  return data;
}

export default ModelDetailModal;
