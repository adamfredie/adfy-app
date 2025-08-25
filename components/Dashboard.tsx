import React, { useState } from "react";
import "./styles/main.css";
import { OnboardingData } from "./Onboarding";
import { HiOutlineBookOpen } from "react-icons/hi";
import Learningstatics from "./Learningstatics";
import { MdDescription, MdVerified } from "react-icons/md";
import { MdHourglassEmpty } from "react-icons/md";
// const BadgeIcon = require("../images/badge-icon.png");
import BottomNav from "./BottomNav";
import { desc } from "motion/react-client";

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
  const [expandedSections, setExpandedSections] = useState({
    course: true,
    learningStats: true,
    activities: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getUserName = () => {
    if (userProfile?.name) {
      const nameParts = userProfile.name.trim().split(' ');
      return nameParts[0];
    }
    return "Alex";
  };

  const getStatsBasedOnLevel = () => {
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

  // For the level progress bar
  const levels = [
    { label: "A1", status: "completed" },
    { label: "A2", status: "current" },
    { label: "B1", status: "locked" },
    { label: "B2", status: "locked" },
    { label: "C1", status: "locked" },
    { label: "C2", status: "locked" },
  ];

  // Fixed connector logic to match the first image design
  const getConnectorStyle = (currentIndex: number) => {
    if (currentIndex === 0) {
      // Connector after A1 (completed) - should be green to match completed status
      return { background: '#22c55e' };
    } else if (currentIndex === 1) {
      // Connector after A2 (current) - should be orange to match current status
      return { background: '#fbb040' };
    } else {
      // All other connectors - should be grey for locked levels
      return { background: '#e5e5e5' };
    }
  };


  // Activities
  const mainActivities = [
    {
      id: 'storytelling',
      title: 'AI Vocabulary',
      description: 'Build Vocabulary through interactive storytelling with AI guidance',
      duration: '15 Min',
    },{
      id:"wordBank",
      title:"Word Bank",
      description:"Review and revisit your learned vocabulary"
    }
  ];

  return (
    <div className="dashboard-container">

      {/* Header */}
      {/* <div className="dashboard-header">
        <div className="header-left">
          <div className="app-brand">
            <span className="app-icon"></span>
            <span className="app-name">Aduffy Learning</span>
          </div>
          <span className="user-greeting">
            Hey, {getUserName()}
          </span>
        </div>
        <div className="header-actions">
          <button className="header-btn" aria-label="Search">
            <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
          </button>
          <button className="header-btn" aria-label="Menu">
            <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div> */}

      {/* Course Details Section */}
      <div className="dashboard-section">
        <div className="section-header" onClick={() => toggleSection('course')}>
          
            <h2>Course Details</h2>
          
          {/* <span className={`section-chevron ${expandedSections.course ? 'up' : 'down'}`}>▼</span> */}
          <span className="material-symbols-outlined">
            {expandedSections.course ?  "expand_circle_up": 'expand_circle_down'}
          </span>
        </div>
        {expandedSections.course && (
          <div className="section-content">
            <div className="course-info-grid">
              <div className="course-info-item">
                {/* <span className="info-icon" role="img" aria-label="Course">📘</span> */}
                <div>
                  <div className="info-label flex gap-2">
                    <HiOutlineBookOpen className="text-xl text-[#17A2B8]" />
                    <div className="">
                      Course Name
                    </div>
                  </div>
                  <div className="info-value">Professional Communication Mastery</div>
                </div>
              </div>
              <div className="course-info-item">
                {/* <span className="info-icon" role="img" aria-label="Duration">⏳</span> */}
                <div>
                  <div className="info-label flex gap-2 ">
                    <MdHourglassEmpty className="text-xl text-[#28A745]"/>
                    <div>
                      Course Duration
                    </div>
                  </div>
                  <div className="info-value">3 months</div>
                </div>
              </div>
            </div>
            <div className="course-info-item w-full "  style={{ marginTop: 16 }}>
              {/* <span className="info-icon" role="img" aria-label="Level">💡</span> */}
              <div className="w-full">
                {/* Updated: Added shield icon and "Current Level" title to match the first image */}
                <div className="info-label current-level-header flex items-center gap-2">
                  <MdVerified className="text-lg text-[#F9A825]"/>
                  <div>
                    Current Level
                  </div>
                </div>

                <div className="level-progress">
                  {levels.map((level, idx) => (
                    <React.Fragment key={level.label}>
                      <div className={`level-item ${level.status}`}>
                        <div className="level-circle">{level.label}</div>
                          <div className="level-label">
                            {level.status === "completed" && "Completed"}
                            {level.status === "current" && "Current"}
                            {level.status === "locked" && "Locked"}
                          </div>
                        </div>

                      {idx < levels.length - 1 && (
                        <div 
                        className="level-connector"
                        style={getConnectorStyle(idx)}
                        >
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

              {/* Learning Statistics Section */}
        <Learningstatics 
          userStats={userStats} 
          expandedSections={expandedSections} 
          toggleSection={toggleSection}
        />

      {/* Activities Section */}
      <div className="dashboard-section">
        <div className="section-header" onClick={() => toggleSection('activities')}>
          <h2>Activities</h2>
          <span className="material-symbols-outlined">
            {expandedSections.activities ?  "expand_circle_up": 'expand_circle_down'}
          </span>
        </div>
        {expandedSections.activities && (
          <div className="section-content">
            <div className="activity-list">
              {mainActivities.map(activity => (
                <div key={activity.id} className="activity-card">
                  <div className="activity-header">
                    <span className="activity-title">{activity.title}</span>
                    <span className="activity-duration">{activity.duration}</span>
                  </div>
                  <div className="activity-desc">{activity.description}</div>
                  <button
                    className="activity-btn"
                    onClick={() => onSelectActivity(activity.id)}
                  >
                    Start Activity
                  </button>
                </div>
              ))}
              {/* More Activities coming soon div */}
              <div className="activity-card activity-card-disabled">
                <div className="activity-desc" style={{ textAlign: "center" }}>
                <span className="info-icon-small">i</span>
                  More activities coming soon.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation (mobile only) */}
      <BottomNav />
    </div>
  );
}