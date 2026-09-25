import React from 'react';

const ModelComparisonTable = ({ models, onViewClick }) => {
  const formatMetric = (val, isPercentage = false) => {
    if (val === null || val === undefined) return '—';
    if (isPercentage) return (val * 100).toFixed(2) + '%';
    if (Math.abs(val) > 1000) return val.toExponential(2);
    return val.toFixed(4);
  };

  return (
    <div className="table-container fade-in">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Machine Learning Model</th>
            <th>Type</th>
            <th>Accuracy</th>
            <th>Precision</th>
            <th>Recall</th>
            <th>F1 Score</th>
            <th>MSE</th>
            <th>R² Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model, index) => {
            const isCls = model.type === 'Classification';
            const isReg = model.type === 'Regression';
            
            return (
              <tr key={model.id}>
                <td>{index + 1}</td>
                <td style={{ fontWeight: 600 }}>{model.name}</td>
                <td>
                  <span className={`model-badge ${isCls ? 'classification' : 'regression'}`}>
                    {model.type}
                  </span>
                </td>
                <td>{isCls ? formatMetric(model.accuracy, true) : '—'}</td>
                <td>{isCls ? formatMetric(model.precision, true) : '—'}</td>
                <td>{isCls ? formatMetric(model.recall, true) : '—'}</td>
                <td>{isCls ? formatMetric(model.f1Score, true) : '—'}</td>
                <td>{isReg ? formatMetric(model.mse) : '—'}</td>
                <td>{isReg ? formatMetric(model.r2Score) : '—'}</td>
                <td>
                  <button 
                    className="table-btn"
                    onClick={() => onViewClick(model)}
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ModelComparisonTable;
