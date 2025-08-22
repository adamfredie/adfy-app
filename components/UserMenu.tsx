import React from 'react';
import './styles/main.css';
import { useAuth } from '../src/contexts/AuthContext';

export function UserMenu({ onSignOut, onResetOnboarding, onUserProfile }) {
  const { userProfile } = useAuth();
  const formatExperienceLevel = (level) => {
    if (!level) return '';
    
    const levelMap = {
      'entry': 'Entry Level (0-2 years)',
      'mid': 'Mid Level (3-7 years)',
      'senior': 'Senior Level (8-12 years)',
      'executive': 'Executive Level (13+ years)'
    };
    
    return levelMap[level] || level;
  };
  return (
    <div className="user-menu">
      <div className="user-menu-header">
        {/* <div className="user-name">Owner</div> */}
        <div className="user-name">{userProfile?.name || ''}</div>
        <div className="user-details">Aduffy Learning • Technology</div>
        {/* <div className="user-details">Executive Level (10+ years)</div> */}
        <div className="user-details">{formatExperienceLevel(userProfile?.experienceLevel)}</div>
      </div>
      <div className="user-menu-divider" />
      <div className="user-menu-item">
        <span role="img" aria-label="profile">👤</span>
        <span onClick={onUserProfile}>Profile Settings</span>
      </div>
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