import React from 'react';

export default function RiskCard({ level, title, description, icon: Icon }) {
  const levelClass = level.toLowerCase().replace(' ', '');

  return (
    <div className={`risk-card ${levelClass}`}>
      <div className="risk-card-header">
        {Icon && <Icon size={24} />}
        <h3 className="risk-badge-pill">{title}</h3>
      </div>
      <p className="risk-card-desc">{description}</p>
    </div>
  );
}
