import React, { useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthWrapperProps {
  onAuthSuccess: () => void;
  onClose: () => void;
  skipAuthCheck?: boolean; // New prop to skip authentication check
}

type AuthMode = 'login' | 'signup';

export function AuthWrapper({ onAuthSuccess, onClose, skipAuthCheck = false }: AuthWrapperProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('login'); // Default to login for existing users
  const { isAuthenticated, loading } = useAuth();

  // Only check authentication if user is already authenticated AND we're not skipping the check
  // For new users or when explicitly requested, we don't need to wait for auth check
  React.useEffect(() => {
    if (!skipAuthCheck && isAuthenticated && !loading) {
      onAuthSuccess();
    }
  }, [isAuthenticated, loading, onAuthSuccess, skipAuthCheck]);

  const handleSwitchToSignup = () => {
    setAuthMode('signup');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleAuthSuccess = () => {
    console.log('🔄 AuthWrapper: handleAuthSuccess called');
    onAuthSuccess();
  };

  // Skip loading state for new users or when skipping auth check - show forms immediately
  // Only show loading if we're actually checking an existing session
  if (!skipAuthCheck && loading && isAuthenticated !== null) {
    return (
      <div className="onboarding-mobile-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Checking authentication...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Render the appropriate auth form immediately for new users
  if (authMode === 'signup') {
    return (
      <SignupForm
        onSuccess={handleAuthSuccess}
        onSwitchToLogin={handleSwitchToLogin}
        onClose={onClose}
      />
    );
  }

  return (
    <LoginForm
      onSuccess={handleAuthSuccess}
      onSwitchToSignup={handleSwitchToSignup}
      onClose={onClose}
    />
  );
}
