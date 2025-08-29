import React, { useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../src/contexts/AuthContext";

function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isEmailVerified } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if this is a verification callback
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('🔍 EmailVerification: URL params:', { code: !!code, error, errorDescription });
    console.log('🔍 EmailVerification: isEmailVerified:', isEmailVerified);

    if (error) {
      console.error('❌ EmailVerification: Error in URL params:', error, errorDescription);
      setVerificationStatus('error');
      setMessage(errorDescription || 'Email verification failed. Please try again.');
      return;
    }

    if (code) {
      // This is a verification callback - the AuthContext should handle it
      console.log('✅ EmailVerification: Code found in URL, processing verification...');
      setVerificationStatus('loading');
      setMessage('Verifying your email...');
      
      // Wait a bit for the AuthContext to process the code
      const timer = setTimeout(() => {
        console.log('⏰ EmailVerification: Timer completed, checking verification status...');
        if (isEmailVerified) {
          console.log('✅ EmailVerification: Email verified successfully!');
          setVerificationStatus('success');
          setMessage('Email verified successfully! You can now sign in.');
        } else {
          console.log('❌ EmailVerification: Email verification failed or still processing');
          setVerificationStatus('error');
          setMessage('Email verification failed. Please check your email and try again.');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }

    // No code parameter - check if user is already verified
    if (isEmailVerified) {
      console.log('✅ EmailVerification: User already verified');
      setVerificationStatus('success');
      setMessage('Your email is already verified! You can now sign in.');
    } else {
      console.log('⚠️ EmailVerification: No verification code and user not verified');
      setVerificationStatus('error');
      setMessage('Please check your email for the verification link.');
    }
  }, [searchParams, isEmailVerified]);

  const handleContinue = () => {
    if (verificationStatus === 'success' && isEmailVerified) {
      navigate("/auth/login");
    } else {
      navigate("/welcome");
    }
  };

  // Render loading state if verification is in progress
  if (verificationStatus === 'loading') {
    return (
      <div className="w-full max-w-[500px] mx-auto bg-white h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-[var(--primary)] mb-4"></div>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Verifying your email...
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  // Render error state if verification failed
  if (verificationStatus === 'error') {
    return (
      <div className="w-full max-w-[500px] mx-auto bg-white h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <CircleCheck className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Email verification failed
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            {message}
          </p>
          <div className="w-full space-y-3">
            <button 
              onClick={() => navigate("/auth/signup")}
              className="w-full bg-[var(--primary)] text-white font-medium py-2 rounded-xl transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate("/welcome")}
              className="w-full bg-gray-200 text-gray-700 font-medium py-2 rounded-xl transition-colors"
            >
              Back to Welcome
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Original success state design (unchanged)
  return (
    <div className="w-full max-w-[500px] mx-auto bg-white h-screen flex flex-col">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
         
            <CircleCheck className="w-20 h-20 text-[var(--primary)]" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          You've verified your email!
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6 text-sm">
          Please continue to start the onboarding.
        </p>

        {/* Continue Button */}
        <button 
          onClick={handleContinue}
          className="w-full bg-[var(--primary)] text-white font-medium py-2 rounded-xl transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default EmailVerification;
