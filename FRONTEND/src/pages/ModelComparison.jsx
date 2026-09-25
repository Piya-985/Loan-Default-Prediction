import React, { useState, useEffect } from 'react';
import ModelCard from '../components/ModelCard';
import ModelComparisonTable from '../components/ModelComparisonTable';
import ModelDetailModal from '../components/ModelDetailModal';
import { getModels } from '../services/predictionApi';
import '../styles/model-comparison.css';

const ModelComparison = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    // Actually the /models endpoint returns availability.
    // The metrics are returned via another request or we might need to modify app.py
    // to include metrics in the /api/models list endpoint. 
    // Wait, let's fetch /models and then we can also use predictionApi.js if needed.
    // Let's assume the user will update the backend or we can do a mock merge.
    const fetchAllModels = async () => {
      try {
        const data = await getModels();
        // Since getModels in current app.py doesn't return metrics, 
        // I will add code in app.py to return metrics within /api/models.
        setModels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllModels();
  }, []);

  const openModal = (model) => setSelectedModel(model);
  const closeModal = () => setSelectedModel(null);

  if (loading) {
    return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Loading Models...</div>;
  }

  if (error) {
    return <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="models-page fade-in">
      {/* Background Ornaments */}
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <header className="section-header">
          <div className="section-tag">Machine Learning</div>
          <h1 className="section-title">Model Comparison</h1>
          <p className="section-subtitle">
            Explore the six machine learning models used in the LoanGuard loan prediction system. 
            Compare their evaluation metrics, formulations, and hyperparameters.
          </p>
        </header>

        <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>All 6 ML Models</h2>
        <div className="models-grid">
          {models.map(model => (
            <ModelCard key={model.id} model={model} onClick={() => openModal(model)} />
          ))}
        </div>

        <h2 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Model Comparison Table</h2>
        <p style={{ color: 'var(--text-sub)', marginBottom: '24px' }}>
          Side-by-side evaluation of the machine learning models used in the LoanGuard platform.
        </p>
        <ModelComparisonTable models={models} onViewClick={openModal} />
      </div>

      {selectedModel && (
        <ModelDetailModal 
          model={selectedModel} 
          models={models} 
          onClose={closeModal} 
          onNavigate={setSelectedModel} 
        />
      )}
    </div>
  );
};

export default ModelComparison;
