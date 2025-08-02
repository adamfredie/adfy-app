import React, { useEffect, useState } from "react";
import "./styles/main.css";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`splash-screen ${isVisible ? 'visible' : 'fade-out'}`}>
      <div className="splash-content">
        <div className="splash-logo">
          <div className="logo-text">
            <span className="logo-main">Aduffy</span>
            <span className="logo-sparkle">✨</span>
          </div>
          <div className="logo-subtitle">Learning</div>
        </div>
      </div>
    </div>
  );
}