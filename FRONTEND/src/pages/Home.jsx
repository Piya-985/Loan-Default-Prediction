import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, BookOpen, BarChart3, Percent, CreditCard, DollarSign, TrendingUp, Layers, CheckCircle2, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';
import StatCard from '../components/StatCard';
import InfoCard, { FactorAccordionItem } from '../components/InfoCard';
import ProcessSteps from '../components/ProcessSteps';
import RiskCard from '../components/RiskCard';
import '../styles/home.css';

export default function Home() {
  const navigate = useNavigate();

  const scrollToKnowledge = () => {
    const el = document.getElementById('loan-info');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page-wrapper fade-in">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="bg-blob-1"></div>
        <div className="bg-blob-2"></div>
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              AI-Powered Financial Intelligence Platform
            </div>

            <h1 className="hero-title">
              Understand Your Loan.{' '}
              <span className="hero-title-gradient">Predict the Risk.</span>
            </h1>

            <p className="hero-description">
              Analyze borrower and loan information to estimate the likelihood of loan default using data-driven prediction algorithms and comprehensive financial metrics.
            </p>

            <div className="hero-cta-group">
              <button className="btn-primary" onClick={() => navigate('/prediction')}>
                Predict Loan Risk
                <ArrowRight size={18} />
              </button>
              <button className="btn-secondary" onClick={scrollToKnowledge}>
                <BookOpen size={18} />
                Learn About Loans
              </button>
            </div>
          </div>

          {/* Hero Right Visual Stack */}
          <div className="hero-visual">
            <div className="hero-card-main">
              <div className="hero-card-header">
                <div>
                  <div className="hero-card-title">Borrower Risk Evaluation</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Live Intelligence Diagnostic</div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: 'var(--risk-low-bg)',
                  color: 'var(--risk-low-text)',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  94.2% Verified
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>Credit Score Index</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>740 (Prime)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>DTI Ratio</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>28.5% (Optimal)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>Interest Burden</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>7.8% fixed</span>
                </div>

                <div style={{
                  marginTop: '8px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(165, 166, 143, 0.15), rgba(217, 178, 169, 0.15))',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.85rem'
                }}>
                  <ShieldCheck size={20} style={{ color: 'var(--primary-accent)', flexShrink: 0 }} />
                  <div>Estimated Default Probability: <strong>14.2% (Low Risk)</strong></div>
                </div>
              </div>
            </div>

            {/* Floating CSS Decorative Stat Badges */}
            <div className="hero-floating-card-1">
              <TrendingUp size={20} style={{ color: 'var(--primary-accent)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Credit Accuracy</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>High Precision</div>
              </div>
            </div>

            <div className="hero-floating-card-2">
              <DollarSign size={20} style={{ color: 'var(--secondary-accent)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>DTI Evaluation</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Real-time Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="stats-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Dataset Overview</span>
            <h2 className="section-title">Core Project Statistics</h2>
            <p className="section-subtitle">
              The machine learning models are trained on real-world loan default data with these characteristics.
            </p>
          </div>

          <div className="stats-grid">
            <StatCard
              icon={BarChart3}
              value="255,347"
              label="Dataset Rows"
              description="Extensive real-world records used for robust model training."
            />
            <StatCard
              icon={CreditCard}
              value="16"
              label="Feature Columns"
              description="Financial metrics analyzed per applicant (excluding target variables)."
            />
            <StatCard
              icon={Percent}
              value="Default"
              label="Classification Target"
              description="Predicts the likelihood of a loan default (0 = No Default, 1 = Default)."
            />
            <StatCard
              icon={TrendingUp}
              value="LoanAmount"
              label="Regression Target"
              description="Predicts the expected loan amount using regression algorithms."
            />
            <StatCard
              icon={DollarSign}
              value="6"
              label="Available ML Models"
              description="Includes Linear Regression, Random Forest, Decision Tree, KNN, and more."
            />
          </div>
        </div>
      </section>

      {/* 3. KNOWLEDGE BASE / LOAN INFORMATION SECTION */}
      <section id="loan-info" className="knowledge-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Knowledge Hub</span>
            <h2 className="section-title">Understanding Loans & Default Risks</h2>
            <p className="section-subtitle">
              An educational guide explaining loan structures, default mechanics, and financial factors influencing borrower risk profiles.
            </p>
          </div>

          <div className="knowledge-grid">
            {/* What is a Loan */}
            <InfoCard
              icon={BookOpen}
              title="What is a Loan?"
              text="A loan is a financial agreement where a lender provides money to a borrower with the expectation that the principal will be repaid over time, typically alongside accrued interest charges."
            />

            {/* What is Loan Default */}
            <InfoCard
              icon={ShieldAlert}
              title="What is Loan Default?"
              text="Loan default occurs when a borrower fails to meet legal debt obligation deadlines, missing consecutive scheduled monthly payments. Default damages credit scores and incurs financial penalties."
            />

            {/* Deep Dive Factors */}
            <InfoCard
              icon={Layers}
              title="Factors Affecting Loan Default"
              text="Explore key borrower variables evaluated by ML default models:"
            >
              <div className="factors-list">
                <FactorAccordionItem
                  title="Credit Score"
                  description="A numerical index (300-850) reflecting historical repayment behavior. Higher scores indicate lower default risk."
                  defaultOpen={true}
                />
                <FactorAccordionItem
                  title="Debt-to-Income (DTI) Ratio"
                  description="Calculated by dividing total monthly debt obligations by gross monthly income. Higher DTI highlights potential financial strain."
                />
                <FactorAccordionItem
                  title="Income & Employment Stability"
                  description="Steady full-time employment and longer tenure assure consistent monthly cash flow for loan servicing."
                />
                <FactorAccordionItem
                  title="Interest Rate & Loan Term"
                  description="Higher interest rates increase monthly payment burden, while longer loan terms accrue more interest over time."
                />
                <FactorAccordionItem
                  title="Co-Signer & Mortgages"
                  description="A creditworthy co-signer shares repayment responsibility, significantly reducing lender risk exposure."
                />
              </div>
            </InfoCard>
          </div>
        </div>
      </section>

      {/* 4. HOW LOAN PREDICTION WORKS */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">3-Step Process</span>
            <h2 className="section-title">How Loan Default Prediction Works</h2>
            <p className="section-subtitle">
              Our automated system transforms complex financial data into structured risk diagnostics in three seamless steps.
            </p>
          </div>

          <ProcessSteps />
        </div>
      </section>

      {/* 5. RISK LEVEL EXPLANATION SECTION */}
      <section className="risk-explanation-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Diagnostic Guidance</span>
            <h2 className="section-title">What Does the Prediction Mean?</h2>
            <p className="section-subtitle">
              Predictions are categorized into three risk tiers based on calculated default probability and risk factor diagnostics.
            </p>
          </div>

          <div className="risk-cards-grid">
            <RiskCard
              level="Low Risk"
              title="Low Risk (Probability < 22%)"
              description="The loan applicant demonstrates strong financial stability, a healthy DTI ratio, and prime credit scores. Lower likelihood of default."
              icon={CheckCircle2}
            />

            <RiskCard
              level="Medium Risk"
              title="Medium Risk (Probability 22% - 44%)"
              description="The loan displays moderate risk factors, such as fair credit or elevated interest rates. Requires additional underwriting review."
              icon={AlertTriangle}
            />

            <RiskCard
              level="High Risk"
              title="High Risk (Probability ≥ 45%)"
              description="The loan profile exhibits elevated debt burden, low credit score, or limited employment stability. Higher risk of default."
              icon={ShieldAlert}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
