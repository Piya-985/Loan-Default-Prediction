import React from 'react';
import { ArrowRight, Activity, TrendingUp } from 'lucide-react';

const ModelCard = ({ model, onClick }) => {
  const isClassification = model.type === 'Classification';
  const mainMetricLabel = isClassification ? 'Accuracy' : 'R² Score';
  const mainMetricValue = isClassification 
    ? (model.accuracy ? (model.accuracy * 100).toFixed(2) + '%' : 'N/A')
    : (model.r2Score ? model.r2Score.toFixed(4) : 'N/A');
    
  const secMetricLabel = isClassification ? 'Recall' : 'MSE';
  const secMetricValue = isClassification
    ? (model.recall ? (model.recall * 100).toFixed(2) + '%' : 'N/A')
    : (model.mse ? model.mse.toExponential(2) : 'N/A');

  return (
    <div className="model-card" onClick={onClick}>
      <div className="model-card-header">
        <div className="model-icon">
          {isClassification ? <Activity size={24} /> : <TrendingUp size={24} />}
        </div>
        <span className={`model-badge ${isClassification ? 'classification' : 'regression'}`}>
          {model.type}
        </span>
      </div>
      
      <h3 className="model-name">{model.name}</h3>
      <p className="model-desc">{model.purpose || 'Machine learning model used in LoanGuard.'}</p>
      
      <div className="model-metrics">
        <div className="metric-row">
          <span className="metric-label">{mainMetricLabel}</span>
          <span className="metric-value">{mainMetricValue}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">{secMetricLabel}</span>
          <span className="metric-value">{secMetricValue}</span>
        </div>
      </div>
      
      <button className="model-action-btn">
        Inspect Model Details
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default ModelCard;
