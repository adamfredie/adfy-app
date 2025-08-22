import React, { useState, useEffect, useRef } from 'react';
import './styles/main.css';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';

export function Navigation({
  currentActivity,
  onSignOut,
  onResetOnboarding,
  userProfile,
  onUserProfile,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // NEW: Ref for detecting clicks outside the menu
    const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // NEW: Close menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        (desktopMenuRef.current &&
          !desktopMenuRef.current.contains(e.target as Node)) &&
        (mobileMenuRef.current &&
          !mobileMenuRef.current.contains(e.target as Node))
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <>
    {/* For desktop screen desktop UserMenu will open  */}
      <header className="top-nav hidden bg-red-400 md:flex">
        {/* DESKTOP NAVIGATION */}
        <div className="nav-desktop">
          <div className="nav-left">
            <a href="/" className="nav-brand">
              <Logo />
              <div className="nav-brand-text">
                <span className="nav-brand-title">Aduffy Learning</span>
                <span className="nav-brand-subtitle">
                  Professional Vocabulary Mastery
                </span>
              </div>
            </a>
          </div>
          <div className="nav-right" ref={desktopMenuRef}>
            {/* User menu is now always visible, regardless of the current activity */}
            <div className="user-menu-container">
              <button
                className="user-menu-trigger"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {/* Avatar initials from user name */}
                <div className="user-avatar">
                  {userProfile?.name
                    ? userProfile.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'U'}
                </div>
                <div className="user-info">
                  <span className="user-name">
                    {userProfile?.name ? userProfile.name : 'User'}
                  </span>
                  <span className="user-role">Technology</span>
                </div>
              </button>

              {/* NEW: Menu appears when state is true */}
              {isMenuOpen && (
                <UserMenu
                  onSignOut={onSignOut}
                  onResetOnboarding={onResetOnboarding}
                  onUserProfile={onUserProfile}
                />
              )}
            </div>
          </div>
        </div>
      </header>
          {/* In spmall screen this will be seen on desktop it will be hidden */}
      <header className="top-nav-mobile relative block md:hidden" ref={mobileMenuRef} >
        {/* FOR MOBILE NAVIGATION */}
        <div className="nav-mobile">
          <div className="nav-left">
            <div className="nav-brand">
              <div className="nav-avatar"></div>
              <div className="nav-brand-text">
                <span>Aduffy Learning</span>
                <span className="nav-mobile-brand-text">
                  Hey,{' '}
                  {userProfile?.name
                    ? userProfile.name.split(' ')[0]
                    : 'User'}
                </span>
              </div>
            </div>
          </div>
          {/* <div className="nav-right">
            {/* Search button */}
            {/* <button className="nav-icon-btn ">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="#222"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
            </button> */}

            {/* Mobile hamburger menu toggle */}
            {/* <button
              className="nav-icon-btn "
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            > */}
              {/* <svg
                width="20"
                height="20"
                fill="none"
                stroke="#222"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" /> */}
              {/* </svg> */}
            {/* </button> */}
          {/* </div> */} 
        </div>
        {isMenuOpen && (
          <UserMenu
            onSignOut={onSignOut}
            onResetOnboarding={onResetOnboarding}
            onUserProfile={onUserProfile}
          />
        )}

        {/* NEW: Show the same UserMenu for mobile */}
      </header>
    </>
  );
}
