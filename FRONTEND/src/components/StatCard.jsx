import React from 'react';

export default function StatCard({ icon: Icon, value, label, description }) {
  return (
    <div className="stat-card">
      <span className="stat-demo-tag">Metric</span>
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">
          <Icon size={24} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <p className="stat-desc">{description}</p>
    </div>
  );
}
