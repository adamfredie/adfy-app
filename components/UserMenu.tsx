import React from 'react';
import './styles/main.css';

export function UserMenu({ onSignOut, onResetOnboarding }) {
  return (
    <div className="user-menu">
      <div className="user-menu-header">
        <div className="user-name">Owner</div>
        <div className="user-details">Aduffy Learning • Technology</div>
        <div className="user-details">Executive Level (10+ years)</div>
      </div>
      <div className="user-menu-divider" />
      <a href="#" className="user-menu-item">
        <span role="img" aria-label="profile">👤</span>
        <span>Profile Settings</span>
      </a>
      <a href="#" className="user-menu-item">
        <span role="img" aria-label="preferences">⚙️</span>
        <span>Learning Preferences</span>
      </a>
      <div className="user-menu-divider" />
      <a href="#" className="user-menu-item" style={{ color: 'var(--warning)' }} onClick={e => { e.preventDefault(); onResetOnboarding && onResetOnboarding(); }}>
        <span role="img" aria-label="onboarding">🔄</span>
        <span>Reset Onboarding</span>
      </a>
      <a href="#" className="user-menu-item" style={{ color: 'var(--danger)' }} onClick={e => { e.preventDefault(); onSignOut && onSignOut(); }}>
        <span role="img" aria-label="sign out">↪️</span>
        <span>Sign Out</span>
      </a>
    </div>
  );
} 