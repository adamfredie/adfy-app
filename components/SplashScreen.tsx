import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/main.css";
import logoPng from "../images/logo.png"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => navigate('/welcome'), 800); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`splash-screen ${isVisible ? 'visible' : 'fade-out'}`}>
      <div className="splash-content">
        <div className="splash-logo">
          <div className="logo-text">
            <img src={logoPng} alt="logo"/>
          </div>
        </div>
      </div>
    </div>
  );
}