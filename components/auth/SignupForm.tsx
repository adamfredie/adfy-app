import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';
import { CircleCheck } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { OtpVerification } from '../OtpVerification';

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
  // OTP-related state kept for future use but not implemented in flow
  const [showOTP, setShowOTP] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<{email: string, password: string} | null>(null);

  const { signUp, sendOTP, verifyOTP, authLoading, user, isEmailVerified, userProfile } = useAuth();

  useEffect(() => {
    if (user && isEmailVerified) {
      if (userProfile && userProfile.name && userProfile.jobTitle) {
        navigate('/app/dashboard'); 
      } 
    }
  }, [user, isEmailVerified, userProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

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
      // Direct Supabase signup (original system)
      const result = await signUp(email, password);
      
      if (result.success) {
        setSuccessMessage("Account created successfully! Please check your email to verify your account.");
        // Navigate to onboarding after a short delay
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(result.error || 'Failed to create account');
      }

    } catch (err: any) {
      console.error("Signup error:", err);
      setError("An unexpected error occurred");
    }
  };

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  // OTP-related functions kept for future use but not implemented in current flow
  const handleOTPVerify = async (otp: string) => {
    if (!pendingUserData) {
      return { success: false, error: "No pending verification found" };
    }

    try {
      // Verify OTP
      const verifyResult = await verifyOTP(pendingUserData.email, otp);
      
      if (!verifyResult.success) {
        return verifyResult;
      }

      // If OTP is verified, proceed with signup
      const signupResult = await signUp(pendingUserData.email, pendingUserData.password);
      
      if (signupResult.error) {
        return { success: false, error: signupResult.error };
      }

      return { success: true };
    } catch (err: any) {
      console.error("OTP verification error:", err);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const handleOTPResend = async () => {
    if (!pendingUserData) {
      return { success: false, error: "No pending verification found" };
    }

    return await sendOTP(pendingUserData.email);
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    setPendingUserData(null);
    setSuccessMessage("Account created successfully! Redirecting to onboarding...");
    setTimeout(() => navigate("/onboarding"), 2000);
  };

  const handleOTPClose = () => {
    setShowOTP(false);
    setPendingUserData(null);
    setError("");
    setSuccessMessage("");
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="signup-form"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="onboarding-mobile-container"
      >
        {/* Header */}
        <div className="onboarding-header">
          <div className="divIconContainer ">
            <img src='/favicon12.ico'/>
            <button 
              onClick={onClose}
              className="back-button"
            >
              <svg width="24" height="24" viewBox="6 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <h1 className="onboarding-title">Create Account</h1>
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mobile-input"
              required
              disabled={authLoading}
            />
            <div className="cautionContainer flex gap-2 items-center">
              <div
                className={`flex items-center justify-center h-4 w-4 rounded-full transition-colors mt-1
                  ${password.length >= 6 ? "text-[#FFC400]" : "text-gray-300"}`}
              >
                <CircleCheck />
              </div>
              <small className={`mt-1 ${password.length >= 6 ? "text-var(--text-primary)" : "text-gray-300"}`}>
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="mobile-input"
              required
              disabled={authLoading}
            />
          </div>

          {/* Success Message */}
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="success-message"
              style={{
                backgroundColor: '#45CB45',
                borderRadius: '10px',
                padding: '12px',
                height:"4rem",
                margin: '4px 0',
                color: '#ffffff',
                fontSize: '14px'
              }}
            >
              {successMessage}
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="error-message"
              style={{
                backgroundColor: '#E03800',
                borderRadius: '10px',
                padding: '12px',
                height:"4rem",
                color: '#ffffff',
                fontSize: '14px'
              }}
            >
              {error}
            </motion.div>
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

          <div style={{ textAlign: 'center', marginTop: '1px' }}>
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
        </form>
      </motion.div>

      {/* OTP Verification Modal - Kept for future use but not implemented in current flow */}
      {/* {pendingUserData && (
        <OtpVerification
          email={pendingUserData.email}
          onVerify={handleOTPVerify}
          onResend={handleOTPResend}
          onClose={handleOTPClose}
          onSuccess={handleOTPSuccess}
          isOpen={showOTP}
        />
      )} */}
    </AnimatePresence>
  );
}
