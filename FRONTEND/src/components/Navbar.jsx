import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import '../styles/navbar.css';

export default function Navbar({ theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMobileClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <NavLink to="/" className="navbar-brand" onClick={handleMobileClick}>
          <div className="brand-icon">
            <ShieldCheck size={24} />
          </div>
          <span className="brand-text">LoanGuard</span>
        </NavLink>

        {/* Desktop Menu */}
        <nav>
          <ul className="nav-menu">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
                Home
              </NavLink>
            </li>
            <li>
              <a href="/#loan-info" className="nav-link">
                Loan Information
              </a>
            </li>
            <li>
              <NavLink to="/prediction" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Prediction
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/models" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Model Comparison
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right Actions & Theme Switch */}
        <div className="nav-actions">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          
          <button className="nav-cta-btn" onClick={() => { navigate('/prediction'); handleMobileClick(); }}>
            Predict Risk
            <ArrowRight size={16} />
          </button>

          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-menu">
          <li>
            <NavLink to="/" className="nav-link" onClick={handleMobileClick} end>
              Home
            </NavLink>
          </li>
          <li>
            <a href="/#loan-info" className="nav-link" onClick={handleMobileClick}>
              Loan Information
            </a>
          </li>
          <li>
            <NavLink to="/prediction" className="nav-link" onClick={handleMobileClick}>
              Prediction Workspace
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="nav-link" onClick={handleMobileClick}>
              About Project
            </NavLink>
          </li>
          <li>
            <NavLink to="/models" className="nav-link" onClick={handleMobileClick}>
              Model Comparison
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
}
