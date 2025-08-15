import React, { useState,useEffect} from 'react';
import { useAuth } from '../../src/contexts/AuthContext';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export function SignupForm({ onSuccess, onSwitchToLogin, onClose }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { signUp, authLoading, user, isEmailVerified, userProfile } = useAuth();
  // useEffect(() => {
  //   if (user && isEmailVerified) {
  //     // Email was verified, proceed to onboarding
  //     onSuccess();
  //   }
  // }, [user, isEmailVerified, onSuccess]);


  useEffect(() => {
    if (user && isEmailVerified) {
      console.log('✅ User authenticated and email verified, checking onboarding status...');
      
      // Check if user has completed onboarding
      if (userProfile && userProfile.name && userProfile.jobTitle) {
        console.log('✅ User has completed onboarding, going to dashboard');
        onSuccess(); // This will go to dashboard
      } else {
        console.log('⚠️ User needs to complete onboarding');
        onSuccess(); // This will go to onboarding
      }
    }
  }, [user, isEmailVerified, userProfile, onSuccess]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await signUp(email, password);
      
      if (result.success) {
        if (result.error) {
          // This means signup succeeded but email verification is required
          setSuccessMessage(result.error);
          // Still proceed to onboarding - user can verify email later
          setTimeout(() => {
            onSuccess();
          }, 2000);
        } else {
          setSuccessMessage('Account created successfully! Please check your email to verify your account.');
          // Proceed to onboarding
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Signup error:', err);
    }
  };
// Used for setting the email variable
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
    setSuccessMessage('');
  };
// Used for setting the password variable
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
    setSuccessMessage('');
  };
// used for setting the confirm password variable
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError('');
    setSuccessMessage('');
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
          Create Account
        </h1>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message" style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #22c55e',
          borderRadius: '8px',
          padding: '12px',
          margin: '16px',
          color: '#16a34a',
          fontSize: '14px'
        }}>
          {successMessage}
        </div>
      )}

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
          <label htmlFor="password" className="field-label">Create a password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            className="mobile-input"
            required
            disabled={authLoading}
          />
          <small style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Must be at least 6 characters long
          </small>
        </div>

        <div className="form-field">
          <label htmlFor="confirmPassword" className="field-label">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your password"
            className="mobile-input"
            required
            disabled={authLoading}
          />
        </div>

        {/* Continue Button */}
        <div className="onboarding-actions">
          <button
            type="submit"
            disabled={!email || !password || !confirmPassword || authLoading}
            className="continue-button"
            style={{ opacity: authLoading ? 0.7 : 1 }}
          >
            {authLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>

      {/* Switch to Login */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
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
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
