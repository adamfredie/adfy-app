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
import { Session} from '@supabase/supabase-js';
import { supabase,getUserProfile, storeUserOnboardingData, signOut} from "./src/api/supabase";
// It is a custom type having only 7 values
type ActivityType = 'dashboard' | 'storytelling' | 'quiz' | 'interview' | 'voice-conversation' | 'pronunciation' | 'settings';
//Why is the activity Progress only for storttelling?
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
export default function App() {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>('dashboard');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<OnboardingData | null>(null);
  const [activityProgress, setActivityProgress] = useState<ActivityProgress>({});
  const [session, setSession] = useState<Session | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'welcome' | 'onboarding' | 'main'>('splash');
  // Check if user has completed onboarding on app load
  useEffect(() => {
    const onboardingStatus = localStorage.getItem('aduffy-onboarding-completed');
    const savedProfile = localStorage.getItem('aduffy-user-profile');
    const savedProgress = localStorage.getItem('aduffy-activity-progress');
    
    if (onboardingStatus === 'true' && savedProfile) {
      setHasCompletedOnboarding(true);
      setUserProfile(JSON.parse(savedProfile));
      setCurrentScreen('main');
    }

    if (savedProgress) {
      setActivityProgress(JSON.parse(savedProgress));
    }
  }, []);
 
  
  
  // Used for checking if a session exists and if it does, get the user profile
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        getUserProfile(session.user.id)
          .then(profile => {
            if (profile) {
              setUserProfile(profile);
              setHasCompletedOnboarding(true);
              localStorage.setItem('aduffy-onboarding-completed', 'true');
              localStorage.setItem('aduffy-user-profile', JSON.stringify(profile));
              setCurrentScreen('main');
            }
          })
          .catch(console.error);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  
    return () => subscription.unsubscribe();
  }, []);
// ... existing code ...



// ... existing code ...
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        supabase.auth.refreshSession();
      }
    });
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (event === 'TOKEN_REFRESHED') {
        console.log('Session refreshed');
      }
    });
  
    return () => subscription.unsubscribe();
  }, []);
   // Splash screen handlers
   const handleSplashComplete = useCallback(() => {
    setCurrentScreen('welcome');
  }, []);

  const handleWelcomeComplete = useCallback(() => {
    setCurrentScreen('onboarding');
  }, []);
  const handleWelcomeSkip = useCallback(async () => {
    if (session?.user) {
      try {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setUserProfile(profile);
          // localStorage.setItem('aduffy-user-profile', JSON.stringify(profile));
          // localStorage.setItem('aduffy-onboarding-completed', 'true');
          setHasCompletedOnboarding(true);
          setCurrentScreen('main');
          console.log("Profile exits")
        } else {
          const defaultProfile = {
            name: 'Guest User',
            email: session.user.email || 'guest@example.com',
            jobTitle: 'Professional',
            company: '',
            vocabularyLevel: 'intermediate',
            learningGoals: 'Improve communication skills',
            field: 'other',
            experienceLevel: 'mid',
            communicationConfidence: {
              presentations: 3,
              meetings: 3,
              emails: 3,
              networking: 3,
              teamCollaboration: 3
            },
            communicationChallenges: [],
            improvementGoals: [],
            currentSkillLevel: 'intermediate'
          };
          setUserProfile(defaultProfile);
          localStorage.setItem('aduffy-user-profile', JSON.stringify(defaultProfile));
        }
      } catch (error) {
        console.error('Error getting user profile:', error);
      }
    }
  }, [session]);
  useEffect(() => {

    if (session?.user) {
    
    handleWelcomeSkip();
    
    }
    
    }, [session?.user, handleWelcomeSkip]);
    
  const handleOnboardingComplete = useCallback(async (data: OnboardingData) => {
    try {
      if (session?.user) {
        // Save to Supabase first
        await storeUserOnboardingData(session.user.id, data);
      }
      // Then save to localStorage
      localStorage.setItem('aduffy-onboarding-completed', 'true');
      localStorage.setItem('aduffy-user-profile', JSON.stringify(data));
      
      setUserProfile(data);
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }, [session]);

  const handleActivitySelect = useCallback((activity: string) => {
    setCurrentActivity(activity as ActivityType);
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setCurrentActivity('dashboard');
  }, []);

  const handleProfileUpdate = useCallback((updatedProfile: OnboardingData) => {
    // Update user profile in state and localStorage
    localStorage.setItem('aduffy-user-profile', JSON.stringify(updatedProfile));
    setUserProfile(updatedProfile);
  }, []);

  const handleActivityProgressUpdate = useCallback((activityType: keyof ActivityProgress, progress: any) => {
    setActivityProgress(prev => {
      const updatedProgress = {
        ...prev,
        [activityType]: progress
      };
      localStorage.setItem('aduffy-activity-progress', JSON.stringify(updatedProgress));
      return updatedProgress;
    });
  }, []);

  const handleActivityComplete = useCallback((activityType: keyof ActivityProgress) => {
    setActivityProgress(prev => {
      const updatedProgress = {
        ...prev,
        [activityType]: undefined // Clear completed activity progress
      };
      localStorage.setItem('aduffy-activity-progress', JSON.stringify(updatedProgress));
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
    console.log('Navigating to:', page);
  };

  // Handler for signing out: clears localStorage and reloads the app
  const handleSignOut = useCallback(async () => {
    try {
      await signOut(); // Supabase signOut
      // Clear local storage
      localStorage.clear();
      // Reset app state
      setSession(null);
      setUserProfile(null);
      setHasCompletedOnboarding(false);
      setCurrentScreen('splash');
      console.log('Signed out');
      // No need to reload the page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  // Handler for resetting onboarding: sets onboarding as incomplete
  const handleResetOnboarding = useCallback(() => {
    // Clear all localStorage items
    localStorage.removeItem('aduffy-onboarding-completed');
    localStorage.removeItem('aduffy-user-profile');
    localStorage.removeItem('aduffy-profile-picture');
    localStorage.removeItem('aduffy-activity-progress');
    
    // Clear any other potential storage
    sessionStorage.clear();
    
    // Clear all localStorage keys that start with 'aduffy-'
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('aduffy-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Reset all state
    setHasCompletedOnboarding(false);
    setUserProfile(null);
    setActivityProgress({});
    setCurrentActivity('dashboard');
    setCurrentScreen('splash');
    // Reload the page to ensure complete reset
    window.location.reload();
  }, []);

  // Show onboarding flow for first-time users
  if (!hasCompletedOnboarding) {
    if (currentScreen === 'splash') {
      return <SplashScreen onComplete={handleSplashComplete} />;
    }
    if (currentScreen === 'welcome') {
      return (
        <WelcomePages 
          onComplete={handleWelcomeComplete}
          onSkip={handleWelcomeSkip}
          
        />
      );
    }
    
    if (currentScreen === 'onboarding') {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }
  }
  // else {
  //   if(currentScreen === 'main'){
  //   return (
  //   <Dashboard onSelectActivity={handleActivitySelect} userProfile={userProfile} activityProgress={activityProgress} />
  //   )
  // }}
// Return statement for App Function 
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
            onNavigateHome={currentActivity !== 'dashboard' ? handleBackToDashboard : undefined}
            onNavigateToSettings={() => setCurrentActivity('settings')}
            onResetOnboarding={handleResetOnboarding}//passed centralized function
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