import React, { useState,useEffect } from "react";
import "./styles/main.css";
import { supabase } from "../src/api/supabase";
import {Session} from "@supabase/supabase-js";
interface WelcomePagesProps {

  onComplete: () => void;
  onSkip: () => void;
}

export function WelcomePages({ onComplete,onSkip}: WelcomePagesProps) {
  // currentPage is a number that keeps track of which welcome page is being shown from the welcomePages array.
  const [currentPage, setCurrentPage] = useState(0);
  // this state variable is used for showing the sign in and google sign in page.
  const [showSignIn, setShowSignIn] = useState(false);
  // this state variable is used for showing the Email sign in page
  const [showEmailForm, setShowEmailForm] = useState(false);
  // This state varibale is used for storing the email value that comes from the email input field.And it is set by setEmail used in onChange event
  const [email, setEmail] = useState("");
    // This state varibale is used for storing the password value that comes from the password input field.And it is set by setPassword used in onChange event
  const [password, setPassword] = useState("");
  // This state variables is used to track the user's authentication status with supabase
  const [session, setSession] = useState<Session | null>(null);
  // Array of Objects
  // These are three welcome pages that are shown in the welcome page via the carousel effect.The images are not used for now.
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
  // Event handler that shows the sign in and google sign in page.It is used in I already Have an account button
  const handleSignInClick = () => {
    setShowSignIn(true);
  };
// This function is used for handling google sign in.It skips to dashboard for now.No logic is added for now
  const handleContinueWithGoogle = () => {
    // Implement Google sign-in logic here
    console.log("Continue with Google clicked");
    onSkip(); // For now, just proceed as if signed in
  };
// This Event handler is used for showing the email sign in page and it is used in Continue With Email button
  const handleContinueWithEmail = () => {
    setShowEmailForm(true);
  };

// This function handles the email sign in using supabase
  const handleEmailFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email, //this email comes from the email state value that comes from the email input field
        password,// this password comes from the password state value that comes from the password input field
      });
  
      if (signInError) {
        alert(signInError.message);
        return;
      }
      console.log('Auth Response Data:', {
        fullData: data,
        user: data?.user,
        session: data?.session
      });
  
      // If login successful
      if (data.user) {
        // Try to get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
  
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // If no profile exists, go to onboarding
          onComplete();
        } else if (profileData) {
          // Profile exists, skip to dashboard
          console.log('Profile exists, skipping onboarding');
          localStorage.setItem('aduffy-onboarding-completed', 'true');
          localStorage.setItem('aduffy-user-profile', JSON.stringify(profileData));
          onSkip();
        } else {
          // No profile, go to onboarding
          onComplete();
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  const handleCloseEmailForm = () => {
    setShowEmailForm(false);
    setEmail("");
    setPassword("");
  };
  // Continuous carousel effect - only when not showing sign-in
  useEffect(() => {
    if (showSignIn) return; // Don't auto-rotate when showing sign-in

    const interval = setInterval(() => {
      setCurrentPage((prevPage) => {
        return (prevPage + 1) % welcomePages.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [welcomePages.length, showSignIn]);
    // If showEmailForm is true it will render the email sign in page
    if (showEmailForm) {
      return (
        <div className="onboarding-mobile-container">
          {/* Header */}
          <div className="onboarding-header">
            <button 
              onClick={handleCloseEmailForm}
              className="back-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="onboarding-title">
              Sign In
            </h1>
          </div>
  
          {/* Form Fields */}
          <div className="onboarding-form">
            <div className="form-field">
              <label htmlFor="email" className="field-label">What's your email?</label>
              <input
                id="email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mobile-input"
              />
            </div>
            <div className="form-field">
              <label htmlFor="password" className="field-label">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mobile-input"
              />
            </div>
          </div>
  
          {/* Continue Button */}
          <div className="onboarding-actions">
            <button
              onClick={handleEmailFormSubmit}
              disabled={!email || !password}
              className="continue-button"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    }
   // If showSignIn is true it will render the sign in and google sign in page
   if (showSignIn) {
    return (
      <div className="welcome-container">
        <div>
          <img src="https://aduffylearning.com/wp-content/uploads/2025/08/aduffy-welcome-screen-img.jpg" alt="A woman on the phone" />
        </div>

        <div className="welcome-content">
          <div className="welcome-text">
            <h1 className="welcome-title">Sign in</h1>
            <p className="welcome-description">Welcome back! Please sign in to continue your learning journey</p>
          </div>

          <div className="welcome-actions">
            <button 
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
            </button>
            <button 
              onClick={handleContinueWithEmail} 
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
          </div>
        </div>
      </div>
    );
  }
// return statement for the welcome pages component
  return (
    <>
<div className="welcome-container">
      <div>
        <img src="https://aduffylearning.com/wp-content/uploads/2025/08/aduffy-welcome-screen-img.jpg" alt="A woman on the phone" />
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
             onClick={handleSignInClick}
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