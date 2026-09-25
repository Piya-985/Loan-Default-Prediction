import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Info, CheckCircle2, Activity, Target, Layers } from 'lucide-react';
import '../styles/prediction.css';

export default function PredictionResult({ result }) {
  if (!result) return null;

  const isRegression = result.predictedLoanAmount !== undefined;

  if (isRegression) {
    return (
      <div id="prediction-result-panel" className="prediction-result-panel fade-in">
        <div className="result-main-grid">
          <div className="result-gauge-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-sub)', marginBottom: '10px' }}>Predicted Loan Amount</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
              ${result.predictedLoanAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ marginTop: '20px', padding: '10px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.9rem' }}>
              <strong>Model Used:</strong> {result.modelName}
            </div>
          </div>
          
          <div>
            <h4 className="factors-breakdown-title">Regression Model Metrics</h4>
            <div className="factor-cards-matrix">
              <div className="risk-factor-pill">
                <div className="factor-pill-header">
                  <span className="factor-pill-name">MSE</span>
                </div>
                <p className="factor-pill-desc">{result.mse !== null ? result.mse.toFixed(4) : 'N/A'}</p>
              </div>
              <div className="risk-factor-pill">
                <div className="factor-pill-header">
                  <span className="factor-pill-name">R2 Score</span>
                </div>
                <p className="factor-pill-desc">{result.r2Score !== null ? result.r2Score.toFixed(4) : 'N/A'}</p>
              </div>
              {result.epochs !== undefined && (
                <>
                  <div className="risk-factor-pill">
                    <div className="factor-pill-header">
                      <span className="factor-pill-name">Epochs</span>
                    </div>
                    <p className="factor-pill-desc">{result.epochs}</p>
                  </div>
                  <div className="risk-factor-pill">
                    <div className="factor-pill-header">
                      <span className="factor-pill-name">Learning Rate</span>
                    </div>
                    <p className="factor-pill-desc">{result.learningRate}</p>
                  </div>
                  <div className="risk-factor-pill">
                    <div className="factor-pill-header">
                      <span className="factor-pill-name">Final Loss</span>
                    </div>
                    <p className="factor-pill-desc">{result.finalLoss.toFixed(4)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="prediction-disclaimer">
          <Info size={22} style={{ flexShrink: 0, color: 'var(--primary-accent)' }} />
          <div>
            <strong>Analytical Disclaimer:</strong> This regression prediction is an estimate based on the model's training on historical data.
          </div>
        </div>
      </div>
    );
  }

  // Classification Result
  const { prediction, predictionLabel, defaultProbability, model, accuracy, precision, recall, f1Score } = result;

  const probPercent = defaultProbability !== undefined ? (defaultProbability * 100).toFixed(1) : 0;
  
  let riskLevel = "Low Risk";
  let badgeStyle = {
    backgroundColor: 'var(--risk-low-bg)',
    color: 'var(--risk-low-text)',
    borderColor: 'var(--risk-low-border)'
  };
  let gaugeColor = '#2D5C3E';
  let IconComponent = ShieldCheck;

  if (prediction === 1 || probPercent > 50) {
    riskLevel = "High Risk";
    badgeStyle = {
      backgroundColor: 'var(--risk-high-bg)',
      color: 'var(--risk-high-text)',
      borderColor: 'var(--risk-high-border)'
    };
    gaugeColor = '#8C2D2D';
    IconComponent = ShieldAlert;
  } else if (probPercent > 30) {
    riskLevel = "Medium Risk";
    badgeStyle = {
      backgroundColor: 'var(--risk-med-bg)',
      color: 'var(--risk-med-text)',
      borderColor: 'var(--risk-med-border)'
    };
    gaugeColor = '#8C621C';
    IconComponent = AlertTriangle;
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probPercent / 100) * circumference;

  return (
    <div id="prediction-result-panel" className="prediction-result-panel fade-in">
      <div className="result-main-grid">
        <div className="result-gauge-card">
          <div className="gauge-svg-container">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="14"
              />
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={gaugeColor}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 90 90)"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div className="gauge-center-text">
              <div className="gauge-prob-val">{probPercent}%</div>
              <div className="gauge-prob-sub">Default Risk</div>
            </div>
          </div>

          <div className="result-badge" style={badgeStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <IconComponent size={20} />
              {predictionLabel} ({riskLevel})
            </div>
          </div>
          
          <div style={{ marginTop: '15px', padding: '10px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', width: '100%' }}>
            <strong>Model:</strong> {model}
          </div>
        </div>

        <div>
          <h4 className="factors-breakdown-title">
            Model Evaluation Metrics
          </h4>
          
          <div className="factor-cards-matrix">
            <div className="risk-factor-pill">
              <div className="factor-pill-header">
                <span className="factor-pill-name">Accuracy</span>
                <span className="factor-pill-status positive">
                  <Target size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Metric
                </span>
              </div>
              <p className="factor-pill-desc">{accuracy !== null ? accuracy.toFixed(4) : 'N/A'}</p>
            </div>
            <div className="risk-factor-pill">
              <div className="factor-pill-header">
                <span className="factor-pill-name">Precision</span>
                <span className="factor-pill-status positive">
                  <Activity size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Metric
                </span>
              </div>
              <p className="factor-pill-desc">{precision !== null ? precision.toFixed(4) : 'N/A'}</p>
            </div>
            <div className="risk-factor-pill">
              <div className="factor-pill-header">
                <span className="factor-pill-name">Recall</span>
                <span className="factor-pill-status positive">
                  <Layers size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Metric
                </span>
              </div>
              <p className="factor-pill-desc">{recall !== null ? recall.toFixed(4) : 'N/A'}</p>
            </div>
            <div className="risk-factor-pill">
              <div className="factor-pill-header">
                <span className="factor-pill-name">F1 Score</span>
                <span className="factor-pill-status positive">
                  <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Metric
                </span>
              </div>
              <p className="factor-pill-desc">{f1Score !== null ? f1Score.toFixed(4) : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="prediction-disclaimer">
        <Info size={22} style={{ flexShrink: 0, color: 'var(--primary-accent)' }} />
        <div>
          <strong>Analytical Disclaimer:</strong> This prediction is generated by the {model} machine learning model based on the provided inputs and should not be considered financial advice.
        </div>
      </div>
    </div>
  );
}
