import React, { useState, useEffect } from 'react';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import SampleDataSection from '../components/SampleDataSection';
import { predictLoanRisk, getModels } from '../services/predictionApi';
import '../styles/prediction.css';

export default function Prediction() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [selectedSampleData, setSelectedSampleData] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('logistic_regression');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getModels().then(data => setModels(data)).catch(err => console.error(err));
  }, []);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictLoanRisk(selectedModel, formData);
      setPredictionResult(result);
      
      // Smooth scroll to result panel after brief delay
      setTimeout(() => {
        const resultPanel = document.getElementById('prediction-result-panel');
        if (resultPanel) {
          resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sampleRecord) => {
  setSelectedSampleData(sampleRecord);

  setTimeout(() => {
    const form = document.getElementById('prediction-form');

    if (form) {
      form.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, 100);
};

  return (
    <div className="container prediction-page-container fade-in">
      <div className="prediction-header">
        <h1 className="prediction-title">Loan Risk Prediction Workspace</h1>
        <p className="prediction-subtitle">
          Demonstrate machine learning loan default prediction using real dataset records from <code>Loan_default.csv</code> or custom borrower parameters.
        </p>
      </div>

      <SampleDataSection onSelectSample={handleSelectSample} />

      <div style={{ marginBottom: '20px', background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Select ML Model:</label>
        <select 
          value={selectedModel} 
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}
        >
          {models.map(m => (
            <option key={m.id} value={m.id}>{m.name} - {m.purpose}</option>
          ))}
          {models.length === 0 && (
            <>
              <option value="logistic_regression">Logistic Regression (Default)</option>
              <option value="random_forest">Random Forest</option>
              <option value="decision_tree">Decision Tree</option>
              <option value="knn">KNN</option>
              <option value="linear_regression">Linear Regression</option>
              <option value="gradient_descent">Gradient Descent</option>
            </>
          )}
        </select>
        <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-sub)' }}>
          {selectedModel === 'linear_regression' || selectedModel === 'gradient_descent' 
            ? 'This is a Regression model. It predicts the expected Loan Amount.'
            : 'This is a Classification model. It predicts the likelihood of Loan Default.'}
        </p>
      </div>

      {error && (
        <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--risk-high-bg)', color: 'var(--risk-high-text)', borderRadius: '8px', border: '1px solid var(--risk-high-border)' }}>
          <strong>Error: </strong>{error}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>Running Model...</div>
          </div>
        )}
        <PredictionForm onPredict={handlePredict} externalData={selectedSampleData} />
      </div>

      <PredictionResult result={predictionResult} />
    </div>
  );
}
