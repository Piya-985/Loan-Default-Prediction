import React from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2, AlertTriangle, Layers, BarChart, FileText } from 'lucide-react';
import '../styles/about.css';

export default function About() {
  return (
    <div className="container about-page-container fade-in">
      <div className="about-hero">
        <h1 className="about-title">About LoanGuard Platform</h1>
        <p className="about-lead">
          LoanGuard is a full-stack Machine Learning application demonstrating real-time loan default prediction using six distinct ML algorithms, powered by a Python Flask backend and a React frontend.
        </p>
      </div>

      <div className="bento-grid">
        {/* Card 1: Project Objective */}
        <div className="bento-card span-2">
          <div className="bento-icon">
            <ShieldCheck size={26} />
          </div>
          <h3 className="bento-title">Project Purpose & Vision</h3>
          <p className="bento-text">
            This project transitions from simple frontend-only analytics into a true data science application. By utilizing a real-world dataset of 255k+ borrowers, LoanGuard trains six unique machine learning models (both Regression and Classification) to analyze financial indicators such as Credit Score, Income, and Loan Terms, delivering precise predictions.
          </p>
        </div>

        {/* Card 2: ML Concept */}
        <div className="bento-card">
          <div className="bento-icon">
            <Cpu size={26} />
          </div>
          <h3 className="bento-title">Six ML Algorithms</h3>
          <p className="bento-text">
            Models include Linear Regression and Gradient Descent for predicting Loan Amounts (Regression), and Logistic Regression, Decision Tree, Random Forest, and KNN for predicting Loan Default (Classification).
          </p>
        </div>

        {/* Card 3: Key Features Evaluated */}
        <div className="bento-card">
          <div className="bento-icon">
            <Database size={26} />
          </div>
          <h3 className="bento-title">Tech Stack</h3>
          <ul className="bento-list">
            <li><CheckCircle2 size={16} style={{ color: 'var(--primary-accent)' }} /> <strong>Frontend:</strong> React + Vite</li>
            <li><CheckCircle2 size={16} style={{ color: 'var(--primary-accent)' }} /> <strong>Backend API:</strong> Flask (Python)</li>
            <li><CheckCircle2 size={16} style={{ color: 'var(--primary-accent)' }} /> <strong>Machine Learning:</strong> Scikit-Learn</li>
            <li><CheckCircle2 size={16} style={{ color: 'var(--primary-accent)' }} /> <strong>Data Processing:</strong> Pandas & NumPy</li>
            <li><CheckCircle2 size={16} style={{ color: 'var(--primary-accent)' }} /> <strong>Model Serving:</strong> Joblib Artifacts</li>
          </ul>
        </div>

        {/* Card 4: Key System Benefits */}
        <div className="bento-card span-2">
          <div className="bento-icon">
            <BarChart size={26} />
          </div>
          <h3 className="bento-title">Model Evaluation Metrics</h3>
          <p className="bento-text" style={{ marginBottom: '16px' }}>
            The application dynamically returns evaluation metrics directly from the backend models to ensure transparency and reliability:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', fontSize: '0.9rem' }}>
              <strong>Classification Metrics:</strong> Accuracy, Precision, Recall, and F1-Score are used to evaluate how well models predict Default vs Non-Default.
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', fontSize: '0.9rem' }}>
              <strong>Regression Metrics:</strong> Mean Squared Error (MSE) and R-Squared (R2) are used for evaluating Loan Amount predictions.
            </div>
          </div>
        </div>
      </div>

      {/* Limitations Callout Box */}
      <div className="about-callout-box">
        <div className="callout-icon">
          <AlertTriangle size={32} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
            System Architecture
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-sub)', lineHeight: '1.6' }}>
            This application uses a fully decoupled architecture. The React frontend sends user inputs to the Flask REST API. The Flask API safely loads the pre-trained `.pkl` models, preprocesses the inputs using the exact same standard scalers and one-hot encoders used during training, performs the inference, and returns the result in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
