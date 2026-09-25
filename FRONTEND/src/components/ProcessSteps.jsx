import React from 'react';
import { UserCheck, Cpu, ShieldAlert } from 'lucide-react';

export default function ProcessSteps() {
  const steps = [
    {
      number: "1",
      icon: UserCheck,
      title: "Enter Borrower Information",
      description: "Input financial metrics including Age, Income, Loan Amount, Credit Score, DTI Ratio, Interest Rate, and Employment tenure."
    },
    {
      number: "2",
      icon: Cpu,
      title: "Analyze Financial Factors",
      description: "Our intelligence engine cross-evaluates debt burden, creditworthiness, stability, and co-signer mitigators."
    },
    {
      number: "3",
      icon: ShieldAlert,
      title: "Get Risk Prediction",
      description: "Receive instant default risk classification (Low, Medium, High), probability percentage, confidence score, and risk factor diagnostics."
    }
  ];

  return (
    <div className="process-steps-container">
      <div className="process-connector"></div>
      {steps.map((s, index) => {
        const IconComponent = s.icon;
        return (
          <div key={index} className="process-step-card">
            <div className="step-number">{s.number}</div>
            <h3 className="step-title">{s.title}</h3>
            <p className="step-desc">{s.description}</p>
          </div>
        );
      })}
    </div>
  );
}
