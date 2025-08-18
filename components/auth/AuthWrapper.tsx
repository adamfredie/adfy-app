import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>('login'); // Default to login for existing users
  const { isAuthenticated, loading, userProfile } = useAuth();
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

  // Only check authentication if user is already authenticated AND we're not skipping the check
  // For new users or when explicitly requested, we don't need to wait for auth check
  React.useEffect(() => {
    console.log('🔍 AuthWrapper: useEffect triggered', {
      isAuthenticated,
      loading,
      userProfile: userProfile ? 'exists' : 'null',
      skipAuthCheck,
      hasCheckedProfile
    });
    
    if (isAuthenticated && !loading) {
      console.log('🔍 AuthWrapper: User is authenticated, checking onboarding status...');
      
      // If we have a userProfile, make navigation decision
      if (userProfile !== null) {
        setHasCheckedProfile(true);
        console.log('🔍 AuthWrapper: userProfile details:', {
          exists: !!userProfile,
          name: userProfile?.name,
          jobTitle: userProfile?.jobTitle,
          fullProfile: userProfile
        });
        
        // Check if user has completed onboarding
        if (userProfile.name && userProfile.jobTitle) {
          console.log('✅ User has completed onboarding, going to dashboard');
          navigate('/app/dashboard');
        } else {
          console.log('⚠️ User needs to complete onboarding. Missing fields:', {
            hasName: !!userProfile.name,
            hasJobTitle: !!userProfile.jobTitle
          });
          navigate('/onboarding');
        }
      } else if (!hasCheckedProfile) {
        // If no profile yet, wait a bit for it to be fetched
        console.log('⏳ Waiting for user profile to be fetched...');
        const timer = setTimeout(() => {
          if (userProfile === null) {
            console.log('⚠️ User profile still not available, assuming new user needs onboarding');
            navigate('/onboarding');
          }
        }, 1000); // Wait 1 second for profile to be fetched
        
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, loading, navigate, userProfile, hasCheckedProfile]);

  // Handle navigation when userProfile becomes available
  React.useEffect(() => {
    if (isAuthenticated && !loading && userProfile && !hasCheckedProfile) {
      console.log('🔍 AuthWrapper: userProfile became available, checking onboarding status...');
      setHasCheckedProfile(true);
      
      console.log('🔍 AuthWrapper: userProfile details:', {
        exists: !!userProfile,
        name: userProfile?.name,
        jobTitle: userProfile?.jobTitle,
        fullProfile: userProfile
      });
      
      // Check if user has completed onboarding
      if (userProfile.name && userProfile.jobTitle) {
        console.log('✅ User has completed onboarding, going to dashboard');
        navigate('/app/dashboard');
      } else {
        console.log('⚠️ User needs to complete onboarding. Missing fields:', {
          hasName: !!userProfile.name,
          hasJobTitle: !!userProfile.jobTitle
        });
        navigate('/onboarding');
      }
    }
  }, [userProfile, isAuthenticated, loading, hasCheckedProfile, navigate]);

  const handleSwitchToSignup = () => {
    setAuthMode('signup');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleAuthSuccess = () => {
    console.log('🔄 AuthWrapper: handleAuthSuccess called');
    // The useEffect above will handle navigation automatically when auth state updates
    // No need for manual navigation here
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
