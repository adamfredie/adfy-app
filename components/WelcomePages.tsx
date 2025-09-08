import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/main.css";
import { AuthWrapper } from "./auth/AuthWrapper";
import { SignupForm } from "./auth/SignupForm";

export function WelcomePages() {
  const navigate = useNavigate();
  // currentPage is a number that keeps track of which welcome page is being shown from the welcomePages array.
  const [currentPage, setCurrentPage] = useState(0);
  // this state variable is used for showing the sign in and google sign in page.
  const [showSignIn, setShowSignIn] = useState(false);
  // this state variable is used for showing the signup form directly
  const [showSignupForm, setShowSignupForm] = useState(false);
  // this state variable is used for showing the actual login form (AuthWrapper)
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  // Array of Objects
  // These are three welcome pages that are shown in the welcome page via the carousel effect.The images are not used for now.
  const welcomePages = [
    {
      title: "Master Pro Communication",
      description: "Learn from our CELTA-certified coaches",
    },
    {
      title: "Become a Confident Speaker",
      description: "Get focused lessons through 1:1 mentorship ",
      image: "person-2.jpg"
    },
    {
      title: "Learn Leadership \n  Skills",
      description: "Lead meetings, opinions, and teams at work",
      image: "person-3.jpg"
    }
  ];
  
  // Event handler that shows the sign in and google sign in page.It is used in I already Have an account button
  const handleSignInClick = () => {
    setShowSignIn(true);
  };

  // This function is used for handling google sign in.It skips to dashboard for now.No logic is added for now
  const handleContinueWithGoogle = () => {
    // Implement Google sign-in logic here
    console.log("Continue with Google clicked");
    // For now, navigate to onboarding (will be protected)
    navigate('/onboarding');
  };

  // This Event handler is used for showing the sign in page and it is used in Continue With Email button
  const handleContinueWithEmail = () => {
    setShowSignupForm(false);
    // Show AuthWrapper for existing users
    setShowSignIn(true);
  };

  // New function to handle showing the actual login form
  const handleShowLoginForm = () => {
    setShowSignIn(false);
    // This will show the AuthWrapper component
    setShowLoginForm(true);
  };

  // Event handler for "Get Started" button - DIRECTLY shows SignupForm (100% guaranteed)
  const handleGetStarted = () => {
    setShowSignupForm(true);
  };

  // Handle authentication success
  const handleAuthSuccess = () => {
    // Navigate back to welcome page after signup
    navigate('/welcome');
  };

  const handleCloseAuth = () => {
    setShowSignIn(false);
  };

  const handleCloseSignIn = () => {
    setShowSignIn(false);
  };

  const handleCloseSignupForm = () => {
    setShowSignupForm(false);
  };

  // Continuous carousel effect - only when not showing any auth screens
  useEffect(() => {
    if (showSignIn || showSignupForm || showLoginForm) return; // Don't auto-rotate when showing any auth screens

    const interval = setInterval(() => {
      setCurrentPage((prevPage) => {
        return (prevPage + 1) % welcomePages.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [welcomePages.length, showSignIn, showSignupForm, showLoginForm]);

  // If showSignupForm is true, render the SignupForm DIRECTLY (100% guaranteed)
  if (showSignupForm) {
    return (
      <SignupForm
        onSuccess={handleAuthSuccess}
        onSwitchToLogin={() => {
          setShowSignupForm(false);
          setShowSignIn(true);
        }}
        onClose={handleCloseSignupForm}
      />
    );
  }

  // If showSignIn is true, render the sign in and google sign in page
  if (showSignIn) {
    return (
      <div className="welcome-container">
        <div className=" h-full">
          <img src="https://aduffylearning.com/wp-content/uploads/2025/08/aduffy-welcome-screen-img.jpg" alt="A woman on the phone" className=" object-cover h-full" />
        </div>

        <div className="welcome-content">
          <div className="welcome-text">
            <h1 className="welcome-title">Sign in</h1>
            <p className="welcome-description">Welcome back! Please sign in to continue your learning journey</p>
          </div>

          <div className="welcome-actions">
            {/* <button 
              onClick={handleContinueWithGoogle} 
              className="welcome-primary-btn"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                marginBottom: '12px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button> */}
            <button 
              onClick={handleShowLoginForm} 
              className="welcome-secondary-btn"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px'
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Continue with Email
            </button>
            <button 
            onClick={handleCloseSignIn}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '20px',
              textDecoration: 'underline'
            }}
          >
            ← 
          </button>
          </div>
          
          {/* Back button */}
          {/* <button 
            onClick={handleCloseSignIn}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '20px',
              textDecoration: 'underline'
            }}
          >
            ← 
          </button> */}
        </div>
      </div>
    );
  }

  // If showLoginForm is true, render the AuthWrapper component
  if (showLoginForm) {
    return (
      <AuthWrapper
        onAuthSuccess={() => {
          console.log('🎯 WelcomePages: onAuthSuccess called, navigating to onboarding');
          // When login succeeds, navigate to onboarding - ProtectedRoute will handle redirects
          navigate('/onboarding');
        }}
        onClose={() => setShowLoginForm(false)}
        skipAuthCheck={true}
      />
    );
  }

  // Main welcome page with carousel
  return (
    <>
      <div className="welcome-container">
  <div className="welcome-hero">
    <img 
      src="https://aduffylearning.com/wp-content/uploads/2025/08/aduffy-welcome-screen-img.jpg" 
      alt="A woman on the phone" 
    />
  </div>

  <div className="welcome-content">
    <div className="welcome-text">
      <img src="/aduffy-logo.png"/>
      <h1 className="welcome-title">{welcomePages[currentPage].title}</h1>
      <p className="welcome-description">{welcomePages[currentPage].description}</p>
      <div className="welcome-progress mt-4">
        {welcomePages.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index === currentPage ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>

    <div className="welcome-actions">
      <button onClick={handleGetStarted} className="welcome-primary-btn">
        Get Started
      </button>
      <button onClick={handleSignInClick} className="welcome-secondary-btn">
        I already have an account
      </button>
    </div>
  </div>
</div>



    </>
  );
}