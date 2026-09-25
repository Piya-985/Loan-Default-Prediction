import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FactorAccordionItem({ title, description, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="factor-item" onClick={() => setIsOpen(!isOpen)}>
      <div className="factor-header">
        <span>{title}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {isOpen && (
        <div className="factor-body fade-in">
          {description}
        </div>
      )}
    </div>
  );
}

export default function InfoCard({ icon: Icon, title, text, children }) {
  return (
    <div className="info-card">
      <div className="info-card-icon">
        <Icon size={26} />
      </div>
      <h3 className="info-card-title">{title}</h3>
      <p className="info-card-text">{text}</p>
      {children}
    </div>
  );
}
