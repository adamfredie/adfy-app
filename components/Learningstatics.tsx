import React, { useEffect, useState } from 'react';
import CountUp from './ui/Countup';
import SpotlightCard from './SpotlightCard';
import { FiBookOpen } from 'react-icons/fi';
import { IoIosTrendingUp } from 'react-icons/io';
import { LuBrain } from 'react-icons/lu';
import { getUserLearningStats } from '../src/api/supabase';
import { useAuth } from '../src/contexts/AuthContext';

interface LearningStats {
  wordsLearned: number;
  currentStreak: number;
  totalScore: number;
  weeklyProgress: number;
}

function Learningstatics({ userStats, expandedSections, toggleSection }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<LearningStats>({
    wordsLearned: 0,
    currentStreak: 0,
    totalScore: 0,
    weeklyProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const userStats = await getUserLearningStats(user.id);
          setStats(userStats);
        } catch (error) {
          console.error('Error fetching learning stats:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStats();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="dashboard-section">
        <div className="section-header" onClick={() => toggleSection("learningStats")}>
          <h2>Learning Statistics</h2>
          <span className="material-symbols-outlined">
            {expandedSections.learningStats ? "expand_circle_up" : "expand_circle_down"}
          </span>
        </div>
        {expandedSections.learningStats && (
          <div className="section-content">
            <div className="stats-grid">
              <div className="loading-placeholder">Loading statistics...</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="section-header" onClick={() => toggleSection("learningStats")}>
        <h2>Learning Statistics</h2>
        <span className="material-symbols-outlined">
          {expandedSections.learningStats ? "expand_circle_up" : "expand_circle_down"}
        </span>
      </div>

      {expandedSections.learningStats && (
        <div className="section-content">
          <div className="stats-grid">
            {/* Words Learned Card */}
            <SpotlightCard
              className="custom-spotlight-card stat-card stat-words"
              spotlightColor="rgba(238, 221, 194, 0.85)"
            >
              <div className="stat-label flex justify-between w-full">
                Words Learned
                <div className="dashboardIco text-[#f8a725] bg-[#fee8c5]">
                  <FiBookOpen />
                </div>
              </div>
              <CountUp
                from={0}
                to={stats.wordsLearned}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text stat-value"
              />
              <div className="stat-sub">
                <span className="text-[#28a745]">+{stats.weeklyProgress}</span> this week
              </div>
            </SpotlightCard>

            {/* Streak Card */}
            <SpotlightCard
              className="custom-spotlight-card stat-card stat-streak"
              spotlightColor="rgba(195, 220, 202, 0.8)"
            >
              <div className="stat-label flex justify-between w-full">
                Current Streak
                <div className="dashboardIco !text-[#28a745] bg-[#c8e7ce]">
                  <IoIosTrendingUp />

                </div>
              </div>
              <div className="streakCounter flex gap-1 items-center">
                <CountUp
                  from={0}
                  to={stats.currentStreak}
                  separator=","
                  direction="up"
                  duration={2}
                  className="count-up-text stat-value !text-[#28a745]"
                />
                <span className="!text-[#28a745] stat-value">days</span>
              </div>
              <div className="stat-sub">Keep it up! 🔥</div>
            </SpotlightCard>

            {/* Total Score Card */}
            <SpotlightCard
              className="custom-spotlight-card stat-card stat-score"
              spotlightColor="rgba(192, 192, 192, 0.85)"
            >
              <div className="stat-label flex justify-between w-full">
                Total Score
                <div className="dashboardIco bg-[#b4b4b4]">
                  <LuBrain />
                </div>
              </div>
              <CountUp
                from={0}
                to={stats.totalScore}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text stat-value"
              />

            </SpotlightCard>
          </div>
        </div>
      )}
    </div>
  );
}

export default Learningstatics;