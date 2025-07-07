import React, { useState } from 'react';
import './styles/main.css';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';

export function Navigation({ currentActivity, onSignOut, onResetOnboarding }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="top-nav">
      <div className="nav-left">
        <a href="/" className="nav-brand">
          <Logo />
          <div className="nav-brand-text">
            <span className="nav-brand-title">Aduffy Learning</span>
            <span className="nav-brand-subtitle">Professional Vocabulary Mastery</span>
          </div>
        </a>
      </div>
      <div className="nav-right">
        <button className="nav-icon-btn">
          <span role="img" aria-label="settings">⚙️</span>
        </button>
        {/* User menu is now always visible, regardless of the current activity */}
        <div className="user-menu-container">
          <button className="user-menu-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="user-avatar">OW</div>
            <div className="user-info">
              <span className="user-name">Owner</span>
              <span className="user-role">Technology</span>
            </div>
          </button>
          {isMenuOpen && <UserMenu onSignOut={onSignOut} onResetOnboarding={onResetOnboarding} />}
        </div>
      </div>
    </header>
  );
} 