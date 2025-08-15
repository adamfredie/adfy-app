import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { Onboarding, OnboardingData } from "./components/Onboarding";
import { Settings } from "./components/Settings";
import { StorytellingActivity } from "./components/StorytellingActivity";
import { VocabularyQuiz } from "./components/VocabularyQuiz";
import { InterviewPrep } from "./components/InterviewPrep";
import { VoiceConversation } from "./components/VoiceConversation";
import { PronunciationPractice } from "./components/PronunciationPractice";
import { Navigation } from './components/Navigation';
import { ScrollToTop } from "./components/ScrollToTop";
import { SplashScreen } from "./components/SplashScreen";
import { WelcomePages } from "./components/WelcomePages";
import { useAuth } from "./src/contexts/AuthContext";

// It is a custom type having only 7 values
type ActivityType = 'dashboard' | 'storytelling' | 'quiz' | 'interview' | 'voice-conversation' | 'pronunciation' | 'settings';

// Activity progress interface - can be extended for other activities later
interface ActivityProgress {
  storytelling?: {
    currentStep: number;
    selectedField: string;
    vocabularyWords?: any[];
    quizAnswers?: any[];
    userStory?: string;
    isCompleted?: boolean;
  };
}

// App function starts from here
function AppContent() {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>('dashboard');
  const [activityProgress, setActivityProgress] = useState<ActivityProgress>({});
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'welcome' | 'onboarding' | 'main'>('splash');
  
  // Use the auth context - this is our single source of truth
  const { user, session, userProfile, loading, signOut } = useAuth();
  
  // Determine onboarding completion status from userProfile
  // const hasCompletedOnboarding = !!userProfile && !!userProfile.name && !!userProfile.jobTitle;
  const hasCompletedOnboarding = !!userProfile && !!userProfile.name;
  // Add this useEffect to prevent unnecessary redirects on tab focus
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      console.log('�� Tab became visible, checking if redirect is needed...');
      
      // Only redirect if we're not already on the correct screen
      if (session?.user && userProfile) {
        const shouldBeOnMain = hasCompletedOnboarding;
        const currentScreenIsCorrect = 
          (shouldBeOnMain && currentScreen === 'main') ||
          (!shouldBeOnMain && currentScreen === 'onboarding');
        
        if (!currentScreenIsCorrect) {
          console.log('🔄 Redirecting to correct screen after tab focus...');
          if (shouldBeOnMain) {
            setCurrentScreen('main');
          } else {
            setCurrentScreen('onboarding');
          }
        }
      }
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [session, userProfile, hasCompletedOnboarding, currentScreen]);
  // Set initial screen based on auth state and onboarding completion
  useEffect(() => {
    console.log('🔍 useEffect running:', {
      loading,
      hasSession: !!session?.user,
      userProfile: userProfile,
      userProfileName: userProfile?.name,
      userProfileJobTitle: userProfile?.jobTitle,
      hasCompletedOnboarding
    });
  
    if (loading) {
      return;
    }

    if (!session?.user) {
      setCurrentScreen('splash');
      return;
    }
    if (session?.user && userProfile === null) {
      console.log('⏳ User logged in but profile still loading...');
      return; // Wait for profile to load
    }
  
    // if (hasCompletedOnboarding) {
    //   setCurrentScreen('main');
    if (userProfile && userProfile.name && userProfile.jobTitle) {
      console.log('🚀 Profile complete, going to main');
      setCurrentScreen('main');
    } else {
      setCurrentScreen('onboarding');
    }
  }, [session, userProfile, hasCompletedOnboarding, loading]);

  // Splash screen handlers
  const handleSplashComplete = useCallback(() => {
    setCurrentScreen('welcome');
  }, []);

  const handleWelcomeComplete = useCallback(() => {
    // Users go to onboarding after welcome
    setCurrentScreen('onboarding');
  }, []);

  const handleWelcomeSkip = useCallback(() => {
    console.log('🎬 App: handleWelcomeSkip called');
    // if (session?.user) {
    //   console.log('🚀 User authenticated, navigating to main dashboard');
    //   console.log('📱 Setting currentScreen to "main"');
    //   setCurrentScreen('main');
    //   console.log('🎯 Setting currentActivity to "dashboard"');
    //   setCurrentActivity('dashboard');
    // } else {
    //   console.log('⚠️ No authenticated user, going to onboarding');
    //   setCurrentScreen('onboarding');
    // }
  }, []);
  // }, [session?.user]);
    
  const handleOnboardingComplete = useCallback(async (data: OnboardingData) => {
    try {
      console.log('🎯 Onboarding completed with data:', data);
      
      // Update the user profile in AuthContext
      // This will store the onboarding data in Supabase
      if (user) {
        // The AuthContext will handle storing this data in Supabase
        // We just need to wait for the context to update
        console.log('🚀 Navigating to main dashboard after onboarding');
        setCurrentScreen('main');
        console.log('✅ Onboarding completed successfully, user profile updated');
      }
      
      // Move to main app - the AuthContext will update userProfile
      // console.log('🚀 Navigating to main dashboard after onboarding');
      // setCurrentScreen('main');
    } catch (error) {
      console.error('Error during onboarding completion:', error);
    }
  }, [user]);

  const handleActivitySelect = useCallback((activity: string) => {
    setCurrentActivity(activity as ActivityType);
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setCurrentActivity('dashboard');
  }, []);

  const handleProfileUpdate = useCallback((updatedProfile: OnboardingData) => {
    // Profile updates are handled by AuthContext
    // This function can be used for immediate UI updates if needed
    // console.log('Profile update requested:', updatedProfile);
  }, []);

  const handleActivityProgressUpdate = useCallback((activityType: keyof ActivityProgress, progress: any) => {
    setActivityProgress(prev => ({
      ...prev,
      [activityType]: progress
    }));
    
    // TODO: In the future, you could store activity progress in Supabase
    // For now, we'll keep it in local state only
  }, []);

  const handleActivityComplete = useCallback((activityType: keyof ActivityProgress) => {
    setActivityProgress(prev => {
      const updatedProgress = { ...prev };
      delete updatedProgress[activityType]; // Clear completed activity progress
      return updatedProgress;
    });
  }, []);

  const handleSettingsClick = () => {
    // Handle settings click
  };

  const handleProfileClick = () => {
    // Handle profile click
  };

  const handleNavigate = (page: string) => {
    // Handle navigation
    // console.log('Navigating to:', page);
  };

  // Handler for signing out: clears state and returns to splash
  const handleSignOut = useCallback(async () => {
    try {
      await signOut(); // Use auth context signOut
      
      // Reset app state
      setCurrentActivity('dashboard');
      setCurrentScreen('splash');
      setActivityProgress({});
      
      // console.log('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut]);

  // Handler for resetting onboarding: clears profile and returns to onboarding
  const handleResetOnboarding = useCallback(() => {
    // Reset all state
    setCurrentActivity('dashboard');
    setCurrentScreen('onboarding');
    setActivityProgress({});
    
    // Note: We don't clear localStorage here since we're not using it anymore
    // The AuthContext will handle clearing the user profile
    // console.log('Onboarding reset requested');
  }, []);

  // Show onboarding flow for first-time users
  if (!hasCompletedOnboarding) {
    // console.log('🔍 Current screen:', currentScreen, 'hasCompletedOnboarding:', hasCompletedOnboarding);
    
    if (currentScreen === 'splash') {
      // console.log('🎬 Rendering SplashScreen');
      return <SplashScreen onComplete={handleSplashComplete} />;
    }
    
    if (currentScreen === 'welcome') {
      // console.log('👋 Rendering WelcomePages');
      return (
        <WelcomePages 
          onComplete={handleWelcomeComplete}
          onSkip={handleWelcomeSkip}
        />
      );
    }
    
    if (currentScreen === 'onboarding') {
      // console.log('🎯 Rendering Onboarding');
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }
    
    // Fallback: if no screen is set, show splash
    // console.log('⚠️ No screen matched, defaulting to splash');
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Return statement for App Function 
  console.log('🎬 App rendering - currentScreen:', currentScreen, 'currentActivity:', currentActivity);
  
  return (
    <div className="app-container-column">
      <ScrollToTop trigger={currentActivity} />
      <Navigation 
        currentActivity={currentActivity}
        onSignOut={handleSignOut}
        onResetOnboarding={handleResetOnboarding}
        userProfile={userProfile}
      />
      <main className="main-content-column">
        {/* 
          CHANGED: Conditional Header Rendering
          - Hide Header component on 'dashboard' and 'storytelling' screens
          - This was requested to create a cleaner UI for these specific activities
          - Header only shows on other activities (quiz, interview, voice-conversation, pronunciation, settings)
        */}
        {currentActivity !== 'dashboard' && currentActivity !== 'storytelling' && (
          <Header 
            currentActivity={currentActivity} 
            onNavigateHome={handleBackToDashboard}
            onNavigateToSettings={() => setCurrentActivity('settings')}
            onResetOnboarding={handleResetOnboarding}
            userProfile={userProfile}
          />
        )}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {currentActivity === 'dashboard' && (
            <Dashboard 
              onSelectActivity={handleActivitySelect} 
              userProfile={userProfile}
              activityProgress={activityProgress}
            />
          )}
          
          {currentActivity === 'settings' && (
            <Settings 
              onBack={handleBackToDashboard}
              userProfile={userProfile}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
          
          {currentActivity === 'storytelling' && (
            <StorytellingActivity 
              onBack={handleBackToDashboard}
              userProfile={userProfile}
              savedProgress={activityProgress.storytelling}
              onProgressUpdate={(progress) => handleActivityProgressUpdate('storytelling', progress)}
              onComplete={() => handleActivityComplete('storytelling')}
            />
          )}
          
          {currentActivity === 'quiz' && (
            <VocabularyQuiz onBack={handleBackToDashboard} />
          )}
          
          {currentActivity === 'interview' && (
            <InterviewPrep onBack={handleBackToDashboard} />
          )}
          
          {currentActivity === 'voice-conversation' && (
            <VoiceConversation onBack={handleBackToDashboard} />
          )}
          
          {currentActivity === 'pronunciation' && (
            <PronunciationPractice onBack={handleBackToDashboard} />
          )}
        </div>
      </main>
    </div>
  );
}

// Main App component that wraps everything with AuthProvider
export default function App() {
  return <AppContent />;
}