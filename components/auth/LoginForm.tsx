import React, { useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
  onClose: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignup, onClose }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, authLoading, session, user, userProfile } = useAuth();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   console.log('📝 LoginForm: handleSubmit called');
  //   e.preventDefault();
  //   setError('');

  //   if (!email || !password) {
  //     setError('Please fill in all fields');
  //     return;
  //   }

  //   try {
  //     console.log('📝 LoginForm: Calling signIn...');
  //     const result = await signIn(email, password);
  //     console.log('📝 LoginForm: signIn completed, result:', result);
      
  //     if (result.success) {
  //       console.log('✅ Login successful, calling onSuccess()');
  //       // Call onSuccess immediately - the AuthWrapper will handle the navigation
  //       onSuccess();
  //     } else {
  //       console.log('❌ Login failed:', result.error);
  //       setError(result.error || 'Login failed');
  //     }
  //   } catch (err) {
  //     console.log('💥 LoginForm: Exception caught:', err);
  //     setError('An unexpected error occurred');
  //     console.error('Login error:', err);
  //   }
  // };


  const handleSubmit = async (e: React.FormEvent) => {
    console.log('📝 LoginForm: handleSubmit called');
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      console.log(' LoginForm: Calling signIn...');
      const result = await signIn(email, password);
      console.log('📝 LoginForm: signIn completed, result:', result);
      
      if (result.success) {
        console.log('✅ Login successful, waiting for session to update...');
        
        const waitForSession = () => {
          if (session?.user && user) {
            console.log('✅ Session and user updated, checking onboarding status...');
            
            // Check if user has completed onboarding
            if (userProfile && userProfile.name && userProfile.jobTitle) {
              console.log('✅ User has completed onboarding, going to dashboard');
              onSuccess(); // This will go to dashboard
            } else {
              console.log('⚠️ User needs to complete onboarding');
              onSuccess(); // This will go to onboarding
            }
          } else {
            setTimeout(waitForSession, 100);
          }
        };
        waitForSession();
      } else {
        console.log('❌ Login failed:', result.error);
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.log('💥 LoginForm: Exception caught:', err);
      setError('An unexpected error occurred');
      console.error('Login error:', err);
    }
  };



  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(''); // Clear error when user types
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(''); // Clear error when user types
  };

  return (
    <div className="onboarding-mobile-container">
      {/* Header */}
      <div className="onboarding-header">
        <button 
          onClick={onClose}
          className="back-button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="onboarding-title">
          Sign In
        </h1>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message" style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #f87171',
          borderRadius: '8px',
          padding: '12px',
          margin: '16px',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="form-field">
          <label htmlFor="email" className="field-label">What's your email?</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="mobile-input"
            required
            disabled={authLoading}
          />
        </div>
        
        <div className="form-field">
          <label htmlFor="password" className="field-label">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            className="mobile-input"
            required
            disabled={authLoading}
          />
        </div>

        {/* Continue Button */}
        <div className="onboarding-actions">
          <button
            type="submit"
            disabled={!email || !password || authLoading}
            className="continue-button"
            style={{ opacity: authLoading ? 0.7 : 1 }}
          >
            {authLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>

      {/* Switch to Signup */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            disabled={authLoading}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
