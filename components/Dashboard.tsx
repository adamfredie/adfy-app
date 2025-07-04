import React, { useState } from "react";
import "./styles/main.css";
import { OnboardingData } from "./Onboarding";

interface DashboardProps {
  onSelectActivity: (activity: string) => void;
  userProfile?: OnboardingData | null;
  activityProgress?: {
    storytelling?: {
      currentStep: number;
      selectedField: string;
      vocabularyWords?: any[];
      quizAnswers?: any[];
      userStory?: string;
      isCompleted?: boolean;
    };
  };
}

export function Dashboard({ onSelectActivity, userProfile, activityProgress }: DashboardProps) {
  const [activeSection, setActiveSection] = useState("main");
  const [activeTab, setActiveTab] = useState("main");

  const getUserName = () => {
    if (userProfile?.name) {
      const nameParts = userProfile.name.trim().split(' ');
      return nameParts[0];
    }
    return "Alex";
  };

  const getStatsBasedOnLevel = () => {
    // If no user profile, return reset values
    if (!userProfile) {
      return { wordsLearned: 0, weeklyGoal: 0, currentStreak: 0, totalScore: 0 };
    }

    const baseStats = {
      beginner: { wordsLearned: 89, weeklyGoal: 25, currentStreak: 5, totalScore: 650 },
      intermediate: { wordsLearned: 234, weeklyGoal: 50, currentStreak: 12, totalScore: 1450 },
      advanced: { wordsLearned: 412, weeklyGoal: 75, currentStreak: 18, totalScore: 2890 }
    };

    const level = userProfile?.vocabularyLevel || 'intermediate';
    return baseStats[level as keyof typeof baseStats] || baseStats.intermediate;
  };

  const userStats = getStatsBasedOnLevel();

  const weeklySchedule = [
    {
      id: 1,
      day: "Monday",
      date: "Jan 20, 2025",
      time: "10:00 AM - 11:00 AM",
      topic: "Advanced Vocabulary in Business Context",
      type: "Live Session"
    },
    {
      id: 2,
      day: "Wednesday",
      date: "Jan 22, 2025",
      time: "2:00 PM - 3:00 PM",
      topic: "Presentation Skills & Public Speaking",
      type: "Interactive Workshop"
    },
    {
      id: 3,
      day: "Friday",
      date: "Jan 24, 2025",
      time: "11:00 AM - 12:00 PM",
      topic: "AI Storytelling & Creative Writing",
      type: "Practice Session"
    },
    {
      id: 4,
      day: "Saturday",
      date: "Jan 25, 2025",
      time: "3:00 PM - 4:00 PM",
      topic: "Mock Interview & Feedback",
      type: "One-on-One"
    }
  ];

  const mainActivities = [
    {
      id: 'storytelling',
      title: 'AI Storytelling',
      icon: '📚',
      description: 'Build vocabulary through interactive storytelling with AI guidance',
      currentField: activityProgress?.storytelling?.selectedField || 'Marketing',
      progress: activityProgress?.storytelling ? {
        current: activityProgress.storytelling.currentStep || 1,
        total: 5
      } : undefined
    }
  ];

  const practiceTools = [
    {
      id: 'quiz',
      title: 'Vocabulary Quiz',
      icon: '🎯',
      description: 'Test your knowledge with contextual vocabulary questions'
    },
    {
      id: 'interview',
      title: 'Interview Prep',
      icon: '🎤',
      description: 'Master professional vocabulary for promotion interviews'
    },
    {
      id: 'voice-chat',
      title: 'AI Voice Chat',
      icon: '💬',
      description: 'Have natural conversations with AI to practice speaking and vocabulary'
    }
  ];

  const renderActivityCard = (activity: any) => (
    <div key={activity.id} className="activity-card" onClick={() => onSelectActivity(activity.id)}>
      <div className="activity-header">
        <div className="activity-icon">
          {activity.icon}
        </div>
        <div className="activity-info">
          <h3>{activity.title}</h3>
          <p>{activity.description}</p>
        </div>
      </div>
      {activity.progress && (
        <div className="activity-status">
          <div style={{ width: '100%' }}>
            <div className="progress-label">
              <span>Progress</span>
              <span>Step {activity.progress.current} of {activity.progress.total}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(activity.progress.current / activity.progress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      {activity.progress ? (
        <button className="continue-button">
          Continue from Step {activity.progress.current}
        </button>
      ) : (
        <button className="continue-button">
          Start Activity
        </button>
      )}
    </div>
  );

  return (
    <div className="container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="card card-hover">
          <h1 className="welcome-title">
            {userProfile ? `Welcome back, ${getUserName()}!` : 'Welcome to Aduffy Learning!'}
          </h1>
          <p className="welcome-subtitle">
            {userProfile 
              ? "Ready to transform your communication skills and advance your career with Aduffy Learning's professional vocabulary mastery program?"
              : "Complete your onboarding to get started with personalized learning experiences."
            }
          </p>
          {userProfile ? (
            <>
              <div className="badge badge-primary">
                {userProfile?.vocabularyLevel || "Beginner"} Level
              </div>
              {userProfile?.fieldOfInterest && (
                <div className="badge badge-success">
                  {userProfile.fieldOfInterest} Focus
                </div>
              )}
            </>
          ) : (
            <div className="badge badge-warning">
              Setup Required
            </div>
          )}
        </div>
      </div>

      {/* Course Information */}
      <div className="card course-card">
        <div className="course-header">
          <div>
            <h3 className="course-title">Professional Communication Mastery</h3>
            <p className="course-subtitle">Course Code: PCM-2024</p>
          </div>
          <div className="badge badge-success">Active</div>
        </div>
        
        <div className="course-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: userProfile ? "68%" : "0%" }}></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
            <span className="text-secondary">Progress</span>
            <span>{userProfile ? "68% Complete" : "0% Complete"}</span>
          </div>
        </div>

        {/* Instructor Card */}
        <div className="instructor-card">
          <div className="instructor-avatar">NS</div>
          <div className="instructor-info">
            <h4>Neelu Sharma</h4>
            <p>Academic Head</p>
            <p>IELTS Certified, MA Applied Linguistics</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
              <span>⭐ 4.9</span>
              <span className="badge badge-primary">Business Communication & IELTS</span>
            </div>
          </div>
        </div>
      </div>

      
      
        
{/* NEW BLOCK */}
      {/* Weekly Schedule */}
      {/* <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "var(--font-size-xl)", fontWeight: "600" }}>Weekly Class Schedule</h2>
          <div className="badge badge-primary">This Week</div>
        </div>
        
        <table className="schedule-table">
          <tbody>
            {weeklySchedule.map((session) => (
              <tr key={session.id} className="schedule-row">
                <td className="schedule-cell">
                  <div className="schedule-time">
                    {session.time}
                  </div>
                  <div>{session.topic}</div>
                </td>
                <td className="schedule-cell">
                  <div className="badge badge-primary">{session.type}</div>
                </td>
                <td className="schedule-cell" style={{ textAlign: "right" }}>
                  <button className="button button-primary">Join</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Activities Section */}
      <div className="activities-section">
        <div className="activities-header">
          <h2 className="activities-title">AI Learning Activities</h2>
          <div className="nav-tabs">
            {/* NEW BLOCK */}
            {/* <button 
              className={`nav-tab ${activeTab === 'main' ? 'active' : ''}`}
              onClick={() => setActiveTab('main')}
            >
              📚 Main Activities
            </button> */}
            {/* NEW BLOCK */}
            {/* <button 
              className={`nav-tab ${activeTab === 'practice' ? 'active' : ''}`}
              onClick={() => setActiveTab('practice')}
            >
              🎯 Practice Tools
            </button> */}
          </div>
        </div>

        <div className="activities-content">
          {activeTab === 'main' ? (
            mainActivities.map(renderActivityCard)
          ) : (
            practiceTools.map(renderActivityCard)
          )}
        </div>
      </div>
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-value">{userStats.wordsLearned}</div>
          <div className="stat-label">Words Learned</div>
          <div style={{ color: userStats.wordsLearned > 0 ? "var(--success)" : "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>
            {userStats.wordsLearned > 0 ? "+12 this week" : "No words learned yet"}
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-value">{userStats.weeklyGoal}/25</div>
          <div className="stat-label">Weekly Progress</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(userStats.weeklyGoal/25) * 100}%` }}
            ></div>
          </div>
          <div style={{ color: userStats.weeklyGoal > 0 ? "var(--success)" : "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>
            {userStats.weeklyGoal > 0 ? "+12 this week" : "No progress yet"}
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-value">{userStats.currentStreak} days</div>
          <div className="stat-label">Current Streak</div>
          <div style={{ color: userStats.currentStreak > 0 ? "var(--success)" : "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>
            {userStats.currentStreak > 0 ? "Keep it up! 🔥" : "Start your streak today!"}
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-value">{userStats.totalScore}</div>
          <div className="stat-label">Total Score</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Expert level: 3000</div>
        </div>
      </div>
    </div>
  );
}