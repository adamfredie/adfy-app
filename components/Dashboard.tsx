import React, { useState } from "react";
import "./styles/main.css";
import { OnboardingData } from "./Onboarding";
import { BsBook } from "react-icons/bs";
import { IoIosTrendingUp } from "react-icons/io";
import { LuBrain } from "react-icons/lu";
import { FiBookOpen } from "react-icons/fi";
import CountUp from "../components/ui/Countup"
import SpotlightCard from "../components/SpotlightCard";
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
  const getConnectorStyle = (currentIndex: number) => {
    if (currentIndex === 0) {
      // Connector after A1 (completed) - should be green
      return { background: '#22c55e' };
    } else if (currentIndex === 1) {
      // Connector after A2 (current) - should be grey
      return { background: '#e5e5e5' };
    } else {
      // All other connectors - should be grey
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
                  <div className="info-label">Course Name</div>
                  <div className="info-value">Professional Communication Mastery</div>
                </div>
              </div>
              <div className="course-info-item">
                {/* <span className="info-icon" role="img" aria-label="Duration">⏳</span> */}
                <div>
                  <div className="info-label">Course Duration</div>
                  <div className="info-value">3 months</div>
                </div>
              </div>
            </div>
            <div className="course-info-item" style={{ marginTop: 16 }}>
              {/* <span className="info-icon" role="img" aria-label="Level">💡</span> */}
              <div>
                <div className="info-label">Current Level</div>
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
                      {/* {idx < levels.length - 1 && <div className="level-connector"></div>} */}
                      {idx < levels.length - 1 && (
          <div 
            className="level-connector"
            style={getConnectorStyle(idx)}
          ></div>
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
      <div className="dashboard-section">
        

        <div className="section-header" onClick={() => toggleSection('learningStats')}>
          <h2>Learning Statistics</h2>
          <span className="material-symbols-outlined">
            
            {expandedSections.learningStats ?  'expand_circle_up': 'expand_circle_down'}
          </span>
        </div>

        {expandedSections.learningStats && (
          <div className="section-content">
            <div className="stats-grid">
            {/* Words Learned Component */}
                <SpotlightCard className="custom-spotlight-card   stat-card stat-words" spotlightColor="rgba(238, 221, 194, 0.85)">
                  <div className="stat-label flex justify-between w-full">Words Learned <div className="dashboardIco text-[#f8a725] bg-[#fee8c5] "><FiBookOpen  /></div></div>
                  <CountUp  from={0}
                      to={userStats.wordsLearned}
                      separator=","
                      direction="up"
                      duration={1}
                      className="count-up-text stat-value"/>
                  <div className="stat-sub">
                    <span className="text-[#28a745]">+12</span> this week</div>
                </SpotlightCard>

                {/* Streax Card component */}
                <SpotlightCard className="custom-spotlight-card stat-card stat-streak" spotlightColor="rgba(195, 220, 202, 0.8)">
                  <div className="stat-label flex justify-between w-full">Current Streak <div className="dashboardIco !text-[#28a745] bg-[#c8e7ce]"><IoIosTrendingUp /></div></div>
                  <div className="streakCounter flex gap-3 items-center ">

                  <CountUp  from={0}
                      to={userStats.currentStreak}
                      separator=","
                      direction="up"
                      duration={2}
                      className="count-up-text stat-value !text-[#28a745]">
                       </CountUp> 

                  <span className=" !text-[#28a745] stat-value ">days</span>    
                  </div>
                  <div className="stat-sub">Keep it up! 🔥</div>
                </SpotlightCard>

                {/* Total Score card component */}
                <SpotlightCard className="custom-spotlight-card stat-card stat-score" spotlightColor="rgba(192, 192, 192, 0.85)">
                  <div className="stat-label flex justify-between w-full">Total Score
                    <div className="dashboardIco bg-[#b4b4b4] "> 
                      <LuBrain/>
                    </div>
                  </div>
                  <CountUp  from={0}
                      to={userStats.totalScore}
                      separator=","
                      direction="up"
                      duration={1}
                      className="count-up-text stat-value"/>
                  <div className="stat-sub">Expert level: 3000</div>
                </SpotlightCard>

            </div>
          </div>
        )}
      </div>

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
      <nav className="bottom-nav">
        <button className="nav-btn active">
          <span role="img" aria-label="Home">🏠</span>
          <span>Home</span>
        </button>
        <button className="nav-btn">
          <span role="img" aria-label="Activities">📚</span>
          <span>Activities</span>
        </button>
        <button className="nav-btn">
          <span role="img" aria-label="Profile">👤</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}