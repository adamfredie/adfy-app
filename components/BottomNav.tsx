import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current route to determine active state
  const currentRoute = location.pathname.split('/').pop() || 'dashboard';
  
  const handleNavigation = (route: string) => {
    navigate(`/app/${route}`);
  };

  return (
    <>
      <nav className="bottom-nav">
        <button 
          className={`nav-btn ${currentRoute === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavigation('dashboard')}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          <span>Home</span>
        </button>
        
        <button 
          className={`nav-btn ${currentRoute === 'activities' ? 'active' : ''}`}
          onClick={() => handleNavigation('activities')}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>Activities</span>
        </button>
        
        <button 
          className={`nav-btn ${currentRoute === 'user-profile' ? 'active' : ''}`}
          onClick={() => handleNavigation('user-profile')}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
}

export default BottomNav