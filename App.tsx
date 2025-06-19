import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { Onboarding, OnboardingData } from "./components/Onboarding";
import { Settings } from "./components/Settings";
import { StorytellingActivity } from "./components/StorytellingActivity";
import { VocabularyQuiz } from "./components/VocabularyQuiz";
import { InterviewPrep } from "./components/InterviewPrep";
import { VoiceConversation } from "./components/VoiceConversation";
import { PronunciationPractice } from "./components/PronunciationPractice";

type ActivityType = 'dashboard' | 'storytelling' | 'quiz' | 'interview' | 'voice-conversation' | 'pronunciation' | 'settings';

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

export default function App() {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>('dashboard');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<OnboardingData | null>(null);
  const [activityProgress, setActivityProgress] = useState<ActivityProgress>({});

  // Check if user has completed onboarding on app load
  useEffect(() => {
    const onboardingStatus = localStorage.getItem('aduffy-onboarding-completed');
    const savedProfile = localStorage.getItem('aduffy-user-profile');
    const savedProgress = localStorage.getItem('aduffy-activity-progress');
    
    if (onboardingStatus === 'true' && savedProfile) {
      setHasCompletedOnboarding(true);
      setUserProfile(JSON.parse(savedProfile));
    }

    if (savedProgress) {
      setActivityProgress(JSON.parse(savedProgress));
    }
  }, []);

  const handleOnboardingComplete = useCallback((data: OnboardingData) => {
    // Save onboarding completion status and user profile
    localStorage.setItem('aduffy-onboarding-completed', 'true');
    localStorage.setItem('aduffy-user-profile', JSON.stringify(data));
    
    setUserProfile(data);
    setHasCompletedOnboarding(true);
  }, []);

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

  // Show onboarding flow for first-time users
  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with ADuffy Learning Logo */}
      <Header 
        currentActivity={currentActivity} 
        onNavigateHome={currentActivity !== 'dashboard' ? handleBackToDashboard : undefined}
        onNavigateToSettings={() => setCurrentActivity('settings')}
        userProfile={userProfile}
      />
      
      {/* Main Content */}
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
    </div>
  );
}