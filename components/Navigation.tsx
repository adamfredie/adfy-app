import React, { useState } from 'react';
import './styles/main.css';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';

export function Navigation({ currentActivity, onSignOut, onResetOnboarding, userProfile }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
    <header className="top-nav">
{/* DESKTOP NAVIGATION */}
<div className="nav-desktop">
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
            {/* <div className="user-avatar">OW</div>
             */}
             <div className="user-avatar">
  {userProfile?.name
    ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U"}
</div>
            <div className="user-info">
              {/* <span className="user-name">Owner</span> */}
              <span className="user-name">
          {userProfile?.name ? userProfile.name : "User"}
        </span>
              <span className="user-role">Technology</span>
            </div>
          </button>
          {isMenuOpen && <UserMenu onSignOut={onSignOut} onResetOnboarding={onResetOnboarding} />}
        </div>
      </div>
      </div>
</header>
<header className="top-nav-mobile">
      {/* FOR MOBILE NAVIGATION */}
      <div className="nav-mobile">
        <div className="nav-left">
          <div className="nav-brand">
            <div className="nav-avatar"></div>
            <div className="nav-brand-text">
              <span>Aduffy Learning</span>
              <span className="nav-mobile-brand-text">Hey, {userProfile?.name ? userProfile.name.split(' ')[0] : 'User'}</span>
            </div>
          </div>
        </div>
        <div className="nav-right">
          <button className="nav-icon-btn">
            <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
          </button>
          <button className="nav-icon-btn">
            <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
    </>
  );
} 