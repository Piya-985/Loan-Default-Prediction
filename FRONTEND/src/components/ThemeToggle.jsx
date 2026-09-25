import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {theme === 'light' ? (
        <Moon className="theme-icon" style={{ color: 'var(--text-main)' }} />
      ) : (
        <Sun className="theme-icon" style={{ color: 'var(--dusty-rose)' }} />
      )}
    </button>
  );
}
