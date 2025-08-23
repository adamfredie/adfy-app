import React from "react";
import { CircleCheck } from "lucide-react";

import { useNavigate } from "react-router-dom";

function EmailVerification() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/auth/login");
  };

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
          You've verified your email?
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6 text-sm">
          Please continue to start the onboarding.
        </p>

        {/* Continue Button */}
        <button 
          onClick={handleContinue}
          className="w-full bg-[var(--primary)]  font-medium py-2 rounded-xl transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default EmailVerification;
