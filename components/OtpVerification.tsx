import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface OtpVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<{ success: boolean; error?: string }>;
  onResend: () => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
  onSuccess: () => void;
  isOpen: boolean;
}

export function OtpVerification({ 
  email, 
  onVerify, 
  onResend, 
  onClose, 
  onSuccess,
  isOpen 
}: OtpVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Removed auto-verification - user must click verify button

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");
      setSuccess("");

      // Auto-focus next box
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 4; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      setError("");
      setSuccess("");
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      setError("Please enter all 4 digits");
      return;
    }

    setIsVerifying(true);
    setError("");
    setSuccess("");

    try {
      const result = await onVerify(otpString);
      if (result.success) {
        setSuccess("Email verified successfully!");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(result.error || "Invalid verification code");
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const result = await onResend();
      if (result.success) {
        setSuccess("Verification code sent!");
        setResendCooldown(60); // 60 second cooldown
      } else {
        setError(result.error || "Failed to resend code");
      }
    } catch (err) {
      setError("Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.y < -threshold) {
      setIsExpanded(true);
    } else if (info.offset.y > threshold && isExpanded) {
      setIsExpanded(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="otp-overlay show"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          initial={{ y: "100%" }}
          animate={{ 
            y: isExpanded ? 0 : "20%",
            height: isExpanded ? "100vh" : "auto"
          }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className={`otp-modal ${isExpanded ? "expanded" : ""}`}
        >
          {/* Drag Handle */}
          <div className="otp-drag-handle" />
          
          {/* Back Button - only show when expanded */}
          {isExpanded && (
            <button className="otp-back-btn" onClick={onClose}>
              ←
            </button>
          )}

          <div className="otp-content">
            <div className="otp-header">
              <h2>Check your email</h2>
              <p>We've sent a verification code to your email.</p>
            </div>

            <div className="otp-input-group">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  maxLength={1}
                  className={`otp-input ${digit ? "filled" : ""}`}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isVerifying}
                  autoComplete="off"
                />
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="otp-error"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="otp-success"
              >
                {success}
              </motion.div>
            )}

            {isVerifying && (
              <div className="otp-loading">
                <div className="otp-loading-spinner"></div>
                Verifying...
              </div>
            )}

            <div className="otp-buttons-container">
              <button 
                className="otp-verify-btn" 
                onClick={handleVerify}
                disabled={otp.join("").length !== 4 || isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>

              <button 
                className="otp-resend-btn" 
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
              >
                {isResending 
                  ? "Sending..." 
                  : resendCooldown > 0 
                    ? `Resend in ${resendCooldown}s` 
                    : "Send again"
                }
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
