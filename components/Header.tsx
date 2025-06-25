import React from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { OnboardingData } from "./Onboarding";

interface HeaderProps {
  currentActivity: string;
  onNavigateHome?: () => void;
  onNavigateToSettings?: () => void;
  onResetOnboarding?: () => void;
  userProfile?: OnboardingData | null;
}

export function Header({ currentActivity, onNavigateHome, onNavigateToSettings, onResetOnboarding, userProfile }: HeaderProps) {
  const getActivityTitle = (activity: string) => {
    switch (activity) {
      case 'storytelling': return 'AI Storytelling';
      case 'quiz': return 'Vocabulary Quiz';
      case 'interview': return 'Interview Prep';
      case 'voice-conversation': return 'Voice Conversation';
      case 'pronunciation': return 'Pronunciation Practice';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const getUserInitials = () => {
    if (userProfile?.jobTitle) {
      const parts = userProfile.jobTitle.split(' ');
      return parts.length > 1 
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    }
    return 'AL'; // ADuffy Learning default
  };

  const getVocabularyLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'aduffy-badge-info';
      case 'intermediate': return 'aduffy-badge-warning';
      case 'advanced': return 'aduffy-badge-success';
      default: return 'aduffy-badge-primary';
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {/* ADuffy Learning Logo */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-aduffy-yellow">
                <span className="text-aduffy-navy text-3xl font-bold">A</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-aduffy-navy">Aduffy Learning</h1>
                <p className="text-xs text-muted-foreground">Professional Vocabulary Mastery</p>
              </div>
            </div>
            
            {onNavigateHome && (
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">/</span>
                <Button 
                  className="text-muted-foreground hover:text-aduffy-navy"
                >
                  <span role="img" aria-label="home">🏠</span>
                  Dashboard
                </Button>
                <span className="text-muted-foreground">/</span>
                <span className="text-aduffy-navy font-medium">{getActivityTitle(currentActivity)}</span>
              </div>
            )}
          </div>

          {/* User Profile Section */}
          {userProfile && (
            <div className="flex items-center gap-4">
              {/* Settings Icon */}
              {onNavigateToSettings && (
                <Button
                  className="hover:bg-aduffy-yellow/10 text-muted-foreground hover:text-aduffy-navy"
                >
                  <span role="img" aria-label="settings">⚙️</span>
                </Button>
              )}

              {/* Vocabulary Level Badge */}
              <Badge className={getVocabularyLevelColor(userProfile.vocabularyLevel)}>
                <span role="img" aria-label="award">🏅</span>
                {userProfile.vocabularyLevel.charAt(0).toUpperCase() + userProfile.vocabularyLevel.slice(1)} Level
              </Badge>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center gap-3 hover:bg-aduffy-yellow/10 px-3 py-2 rounded-md cursor-pointer">
                    <Avatar className="w-8 h-8">
                      {localStorage.getItem('aduffy-profile-picture') ? (
                        <AvatarImage 
                          src={localStorage.getItem('aduffy-profile-picture') || ''} 
                          alt="Profile picture" 
                        />
                      ) : null}
                      <AvatarFallback className="bg-aduffy-teal text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-medium text-aduffy-navy">{userProfile.jobTitle}</p>
                      <p className="text-xs text-muted-foreground capitalize">{userProfile.industry}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="font-medium text-aduffy-navy">{userProfile.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {userProfile.company ? `${userProfile.company} • ` : ''}
                      <span className="capitalize">{userProfile.industry}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{userProfile.experience}</p>
                  </div>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={onNavigateToSettings}
                  >
                    <span role="img" aria-label="profile">👤</span>
                    Profile Settings
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={onNavigateToSettings}
                  >
                    <span role="img" aria-label="settings">⚙️</span>
                    Learning Preferences
                  </DropdownMenuItem>
                  
                  <div className="border-t border-border my-1"></div>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer text-warning" 
                    onClick={onResetOnboarding}
                  >
                    <span role="img" aria-label="reset">🔄</span>
                    Reset Onboarding
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer text-destructive">
                    <span role="img" aria-label="logout">↪️</span>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}