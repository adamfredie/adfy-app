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
  const [mobileNo, setMobileNo] = useState('')
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Mark that signup has animated once
    setHasAnimated(true);
  }, []);
  // const [pendingUserData, setPendingUserData] = useState<{email: string, password: string, mobileNo: string} | null>(null);

  // const { signUp, sendOTP, verifyOTP, authLoading, user, isEmailVerified, userProfile } = useAuth();

  const [pendingUserData, setPendingUserData] = useState<{email: string, password: string} | null>(null);

  const { signUp, sendOTP, verifyOTP, authLoading, user, isEmailVerified, userProfile } = useAuth();


  // Mobile number storing
  // Mobile number verification checking wether the mobile number added is right or wrong

  const validateMobile = (value: string) => {
  const cleaned = value.replace(/\D/g, ""); // keep digits only
  return cleaned.length >= 8 && cleaned.length <= 15; // adjust range as per your use case
};

const validateForm = () => {
  if (!email || !mobileNo || !password || !confirmPassword) {
    return "Please fill in all fields";
  }
  if (!validateEmail(email)) {
    return "Invalid email format";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  if(!validateMobile(mobileNo)){
    return "Invalid mobile number format. Use digits only"
  }

  return "";
};
  


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

    const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    return;
  }

    try {
      // Send OTP for verification
      // const otpResult = await sendOTP(phone);

      // Here we are normalising the phone number in the format +91xxyyy to have a clean data

    const normalizedMobile = normalizePhone(mobileNo);
    if (!normalizedMobile) {
      setError("Invalid mobile number format");
      return;
    }
      const otpResult = await sendOTP(email);
      
      if (otpResult.error) {
        setError(otpResult.error);
        return;
      }

      // Store user data for after OTP verification
      // setPendingUserData({ email, password, mobileNo: phone });
      // setShowOTP(true);
      // setSuccessMessage("Verification code sent to your phone!");

       setPendingUserData({ email, password });
      setShowOTP(true);
      setSuccessMessage("Verification code sent to your email!");

    } catch (err: any) {
      console.error("OTP sending error:", err);
      setError("Failed to send verification code");
    }
  };

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleOTPVerify = async (otp: string) => {
    if (!pendingUserData) {
      return { success: false, error: "No pending verification found" };
    }

    try {
      // Verify OTP
      // const verifyResult = await verifyOTP(pendingUserData.mobileNo, otp);
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

    // return await sendOTP(pendingUserData.mobileNo);
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

  const normalizePhone = (value: string) => {
    if (!value) return '';
    const trimmed = value.toString().trim();
    // Accept formats like +15551234567 or 15551234567 (we'll prefix + if missing)
    const digits = trimmed.replace(/[^0-9+]/g, '');
    if (digits.startsWith('+') && digits.length >= 8) return digits;
    if (/^\d{8,}$/.test(digits)) return `+${digits}`;
    return '';
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        // key="signup-form"
        initial={hasAnimated ? false : { x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="onboarding-mobile-container"
      >
        {/* Header */}
        <div className="onboarding-header">
          <div className="divIconContainer ">
            <img src='/aduffy-logo.png' alt="aduffy logo" decoding="async" fetchPriority="high" height={30} width={80} />
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
              disabled={authLoading || showOTP}
            />
          </div>

          <div className="form-field">
            <label htmlFor="mobileNo" className="field-label">What's your Mobile Number</label>
            <input
              id="mobileNo"
              type="tel"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              placeholder="Enter your mobile no"
              className="mobile-input"
              required
              disabled={authLoading || showOTP}
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
              disabled={authLoading || showOTP}
            />
          </div>

          {/* Success Message */}
          {successMessage && (
            <AnimatePresence>

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
            </AnimatePresence>
          )}

          {/* Error Display */}
          {error && (
            <AnimatePresence>

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
            </AnimatePresence>
          )}

          <div className="onboarding-actions">
            <button
              type="submit"
              disabled={!email || !password || !confirmPassword || authLoading || !mobileNo}
              className="continue-button"
              style={{ opacity: authLoading ? 0.7 : 1 }}
            >
              {authLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>


          

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                type='button'
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
      <div className="centerDiv flex items-center justify-center">

                  <button 
                 onClick={onClose}
                 className="back-button-signup"
               >
                 <svg width="24" height="24" viewBox="6 0 24 24" fill="none">
                   <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </button>
      </div>
        </form>
      </motion.div>


      {/* OTP Verification Modal */}
      {pendingUserData && (
        <OtpVerification
          email={pendingUserData.email}
          onVerify={handleOTPVerify}
          onResend={handleOTPResend}
          onClose={handleOTPClose}
          onSuccess={handleOTPSuccess}
          isOpen={showOTP}
        />
      )}
    </AnimatePresence>
  );
}
