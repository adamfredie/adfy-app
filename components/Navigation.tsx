import React, { useState } from 'react';
import './styles/main.css';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';

const isMobile = window.innerWidth <= 768;

export function Navigation({ currentActivity, onSignOut, onResetOnboarding, userProfile }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
    {isMobile ?( 
      <header className="top-nav">
      <div className="nav-left">
        <a href="/" className="nav-brand">
          <Logo />
          {/* <div className="nav-brand-text">
            <span className="nav-brand-title">Aduffy Learning</span>
            <span className="nav-brand-subtitle">Professional Vocabulary Mastery</span>
          </div> */}
        </a>
      </div>
      <div className="nav-right">
        {/* <button type="button"className="nav-icon-btn">
          <span role="img" aria-label="settings">⚙️</span>
        </button> */}
        {/* User menu is now always visible, regardless of the current activity */}
        <div className="user-menu-container">
             <button type="button"className="reset-btn-nav" onClick={onResetOnboarding} style={{border:"none"}}>
              Reset
            </button>
             {/* <button type="button"className="user-avatar" onClick={() => setIsMenuOpen(!isMenuOpen) } style={{border:"none"}}>
  {userProfile?.name
    ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U"}
            </button> */}
            {/* <div className="user-info">
              <span className="user-name">
          {userProfile?.name ? userProfile.name : "User"}
        </span>
              <span className="user-role">Technology</span>
            </div> */}
        
          {isMenuOpen && <UserMenu onSignOut={onSignOut} onResetOnboarding={onResetOnboarding} />}
        </div>
      </div>
    </header>):( <header className="top-nav">
      <div className="nav-left">
        <a href="/" className="nav-brand">
          <Logo />
          {/* <div className="nav-brand-text">
            <span className="nav-brand-title">Aduffy Learning</span>
            <span className="nav-brand-subtitle">Professional Vocabulary Mastery</span>
          </div> */}
        </a>
      </div>
      <div className="nav-right">
        {/* <button className="nav-icon-btn">
          <span role="img" aria-label="settings">⚙️</span>
        </button> */}
        {/* User menu is now always visible, regardless of the current activity */}
        {/* <div className="user-menu-container">
          <button className="user-menu-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
           
             <div className="user-avatar">
  {userProfile?.name
    ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U"}
</div>
            <div className="user-info">
              <span className="user-name">
          {userProfile?.name ? userProfile.name : "User"}
        </span>
              <span className="user-role">Technology</span>
            </div>
          </button>
          {isMenuOpen && <UserMenu onSignOut={onSignOut} onResetOnboarding={onResetOnboarding} />}
        </div> */}
      </div>
    </header>)}
   

    </>
  );
} 