import React, { useState,useEffect } from "react";
import "./styles/main.css";

interface WelcomePagesProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function WelcomePages({ onComplete, onSkip }: WelcomePagesProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const welcomePages = [
    {
      title: "Welcome to Aduffy",
      description: "Experience the future of vocabulary learning with voice interaction and personalized content",
      image: "person-1.jpg"
    },
    {
      title: "Master Vocabulary in 5 Simple Steps",
      description: "Our proven AI-powered method helps you learn, practice, and master professional vocabulary",
      image: "person-2.jpg"
    },
    {
      title: "Designed for Busy Professionals",
      description: "Perfect for mid to senior management professionals who want to enhance their communication skills",
      image: "person-3.jpg"
    }
  ];

  const handleNext = () => {
    if (currentPage < welcomePages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };
 // Continuous carousel effect
 useEffect(() => {
  const interval = setInterval(() => {
    setCurrentPage((prevPage) => {
      return (prevPage + 1) % welcomePages.length; // Loop back to 0 after last page
    });
  }, 3000); // Change page every 3 seconds

  return () => clearInterval(interval);
}, [welcomePages.length]);

  return (
    <>
<div className="welcome-container">
      {/* Hero Image Section */}
      <div className="welcome-hero">
        {/* <div className="welcome-image-placeholder">
          <div className="welcome-person">
            <div className="person-avatar"></div>
            <div className="person-phone"></div>
            <div className="person-mic"></div>
          </div>
        </div> */}
      </div>

      {/* Content Section */}
      <div className="welcome-content">
      {/* <div> */}
        <div className="welcome-text">
          <h1 className="welcome-title">{welcomePages[currentPage].title}</h1>
          <p className="welcome-description">{welcomePages[currentPage].description}</p>
        </div>

         {/* Progress Dots */}
         <div className="welcome-progress">
            {welcomePages.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentPage ? 'active' : ''}`}
              />
            ))}
          </div>
        {/* Action Buttons */}
        <div className="welcome-actions">
          <button onClick={()=>{onComplete()}} className="welcome-primary-btn">Get Started</button>
          <button
            onClick={onSkip}
            className="welcome-secondary-btn"
          >
            I already have an account
          </button>
        </div>
      </div>
      </div>
      </>
  );
}