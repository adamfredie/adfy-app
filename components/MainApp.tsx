import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
// import { Header } from './Header';
import { Dashboard } from './Dashboard';
import { Onboarding, OnboardingData } from './Onboarding';
import { StorytellingActivity } from './StorytellingActivity';
import { VocabularyQuiz } from './VocabularyQuiz';
import { InterviewPrep } from './InterviewPrep';
import { VoiceConversation } from './VoiceConversation';
import { PronunciationPractice } from './PronunciationPractice';
import { Navigation } from './Navigation';
import { ScrollToTop } from './ScrollToTop';
import { SplashScreen } from './SplashScreen';
import { WelcomePages } from './WelcomePages';
import UserProfile from './UserProfile';
import WordBank from './WordBank';
import ActivitiesPage from './ActivitiesPage';
import BottomNav from './BottomNav';
import { useAuth } from '../src/contexts/AuthContext';


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

export function MainApp() {
  const [activityProgress, setActivityProgress] = useState<ActivityProgress>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, signOut } = useAuth();
  
  // Get current activity from URL path
  const currentActivity = location.pathname.split('/').pop() || 'dashboard';
  
  // Handle activity selection with URL navigation
  const handleActivitySelect = useCallback((activity: string) => {
    navigate(`/app/${activity}`);
  }, [navigate]);

  const handleBackToDashboard = useCallback(() => {
    navigate('/app/dashboard');
  }, [navigate]);

  const handleProfileUpdate = useCallback((updatedProfile: any) => {
    // Profile updates are handled by AuthContext
    console.log('Profile update requested:', updatedProfile);
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
    navigate('/app/settings');
  };

  const handleProfileClick = () => {
    // Handle profile click
  };

  const handleNavigate = (page: string) => {
    navigate(`/app/${page}`);
  };

  // Handler for signing out: clears state and returns to splash
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut, navigate]);

  // Handler for resetting onboarding: clears profile and returns to onboarding
  const handleResetOnboarding = useCallback(() => {
    // Reset all state
    setActivityProgress({});
    navigate('/onboarding');
  }, [navigate]);

  return (
    <div className="app-container-column">
      <ScrollToTop trigger={currentActivity} />
      {/* Hide Navigation on user-profile, wordBank, and activities pages for cleaner UI */}
      {currentActivity !== 'user-profile' && currentActivity !== 'wordBank' && currentActivity !== 'activities' && (
        <Navigation 
          currentActivity={currentActivity}
          onSignOut={handleSignOut}
          onResetOnboarding={handleResetOnboarding}
          userProfile={userProfile}
          onUserProfile={() => navigate('/app/user-profile')}
        />
      )}
      <main className="main-content-column">
        {/* 
          CHANGED: Conditional Header Rendering
          - Hide Header component on 'dashboard', 'storytelling', 'wordBank', and 'user-profile' screens
          - This was requested to create a cleaner UI for these specific activities
          - Header only shows on other activities (quiz, interview, voice-conversation, pronunciation, settings)
        */}
        {/* {currentActivity !== 'dashboard' && currentActivity !== 'storytelling' && currentActivity !== 'user-profile' && currentActivity !== 'wordBank' && (
          <Header 
            currentActivity={currentActivity} 
            onNavigateHome={handleBackToDashboard}
            onNavigateToSettings={() => navigate('/app/settings')}
            onResetOnboarding={handleResetOnboarding}
            userProfile={userProfile}
          />
        )} */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route path="dashboard" element={
              <Dashboard 
                onSelectActivity={handleActivitySelect} 
                userProfile={userProfile}
                activityProgress={activityProgress}
              />
            } />
            

            
            <Route path="user-profile" element={
              <UserProfile
                onBack={handleBackToDashboard}
                userProfile={userProfile}
              />
            } />
            
            <Route path="storytelling" element={
              <StorytellingActivity 
                onBack={handleBackToDashboard}
                userProfile={userProfile}
                savedProgress={activityProgress.storytelling}
                onProgressUpdate={(progress) => handleActivityProgressUpdate('storytelling', progress)}
                onComplete={() => handleActivityComplete('storytelling')}
              />
            } />
            
            <Route path="quiz" element={
              <VocabularyQuiz onBack={handleBackToDashboard} />
            } />
            
            <Route path="interview" element={
              <InterviewPrep onBack={handleBackToDashboard} />
            } />
            
            <Route path="voice-conversation" element={
              <VoiceConversation onBack={handleBackToDashboard} />
            } />
            
            <Route path="pronunciation" element={
              <PronunciationPractice onBack={handleBackToDashboard} />
            } />
            
            <Route path="wordBank" element={
              <WordBank onBack={() => navigate('/app/activities')} />
            } />
            
            <Route path="activities" element={
              <ActivitiesPage onBack={handleBackToDashboard} />
            } />


            
            {/* Default redirect to dashboard */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
      
      {/* Bottom Navigation - appears on all app pages */}
      <BottomNav />
    </div>
  );
}
