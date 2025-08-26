import React, { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';
import { CircleCheck } from 'lucide-react';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export function SignupForm({ onSuccess, onSwitchToLogin, onClose }: SignupFormProps) {
  const navigate = useNavigate();
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
        navigate('/app/dashboard'); // Navigate to dashboard
      } else {
        console.log('⚠️ User needs to complete onboarding');
        // navigate removed as due to it Success message was not showing

      }
    }
  }, [user, isEmailVerified, userProfile, navigate]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSuccessMessage('');

  // Validation
  if (!email || !password || !confirmPassword) {
    setError('Please fill in all fields');
    return;
  }
  if (!validateEmail(email)) {
    setError('Invalid email format');
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

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccessMessage("Account created! Check your email to verify.");
    setTimeout(() => navigate("/onboarding"), 2000);

  } catch (err: any) {
    console.error("Signup error:", err);
    setError("An unexpected error occurred");
  }
};


  const validateEmail = (value: string) => {
  // Basic regex: ensures text@text.domain
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
};

// Used for setting the email variable
const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setEmail(value);
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

        <div className="divIconContainer ">
        <button 
          onClick={onClose}
          className="back-button"
        >
          <svg width="24" height="24" viewBox="6 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <img src='/favicon.ico'/>

        </div>
        <h1 className="onboarding-title">
          Create Account
        </h1>
      </div>


      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="form-field">
          <label htmlFor="email" className="field-label">What's your email</label>
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
            {/* Added Icon Change into yellow colour when password length increase to 6 or more */}
          <div className="cautionContainer flex gap-2 items-center">
            <div
              className={`flex items-center justify-center h-4 w-4 rounded-full transition-colors mt-1
                ${password.length >= 6 ? "text-[#FFC400]" : "text-gray-300"}`}
            >
              <CircleCheck />
            </div>
              <small className={`text-x  mt-1  ${password.length >= 6 ? "text-var(--text-primary)" : "text-gray-300"}  `}>
              Must be at least 6 characters long
            </small>

          </div>

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
            {/* Success Message */}
            {successMessage && (
              <div className="success-message" style={{
                backgroundColor: '#45CB45',
                borderRadius: '10px',
                padding: '12px',
                height:"4rem",

                margin: '4px 0',
                color: '#ffffff',
                fontSize: '14px'
              }}>
                {successMessage}
              </div>
            )}
      
            {/* Error Display */}
            {error && (
              <div className="error-message" style={{
                backgroundColor: '#E03800',
                borderRadius: '10px',
                padding: '12px',
                height:"4rem",
                color: '#ffffff',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
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
      <div style={ {textAlign: 'center', marginTop: '1px'} }>
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
      {/* Switch to Login */}
      </div>
      </form>

    </div>
  );
}
