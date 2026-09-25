import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import '../styles/global.css';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '64px 0 32px 0',
      marginTop: '80px',
      transition: 'all var(--transition-smooth)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '48px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--muted-olive), var(--dusty-rose))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FAF4E3'
              }}>
                <ShieldCheck size={20} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: '800',
                color: 'var(--text-main)'
              }}>LoanGuard</span>
            </div>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Empowering financial institutions and individual borrowers with intelligent risk analytics and machine learning insights for informed loan default assessment.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--text-main)',
              marginBottom: '16px'
            }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <NavLink to="/" style={{ color: 'var(--text-sub)', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }}>
                  Home Page
                </NavLink>
              </li>
              <li>
                <a href="/#loan-info" style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                  Loan Knowledge Hub
                </a>
              </li>
              <li>
                <NavLink to="/prediction" style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                  Risk Prediction Workspace
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                  Model Methodology & About
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Key Indicators */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--text-main)',
              marginBottom: '16px'
            }}>Financial Factors</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-sub)', fontSize: '0.9rem' }}>
              <li>• Debt-to-Income (DTI) Ratio</li>
              <li>• FICO Credit Score Index</li>
              <li>• Interest Rate Adjustments</li>
              <li>• Employment & Income Stability</li>
              <li>• Loan Amount & Term Burden</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          color: 'var(--text-light)',
          fontSize: '0.85rem'
        }}>
          <div>
            © {new Date().getFullYear()} LoanGuard System. Built with React & Custom Pastel UI.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Analytical FinTech Frontend Application</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
