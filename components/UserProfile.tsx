import React, { useState } from "react";
import { FiArrowLeft, FiSearch, FiMenu, FiSettings, FiChevronDown } from "react-icons/fi";

import CountUp from "../components/ui/Countup";
import SpotlightCard from "../components/SpotlightCard";
import { LuBrain } from "react-icons/lu";
import { IoIosTrendingUp } from "react-icons/io";
import { FiBookOpen } from "react-icons/fi";

// Main UserProfile Component
const UserProfile: React.FC<{ onBack: () => void; userProfile: { name: Object } }> = ({
  onBack,
  userProfile,
}) => {
  // ------------------- STATE -------------------
  // Track active tab → "profile" | "preferences"
  const [activeTab, setActiveTab] = useState<"profile" | "preferences">("profile");

  // Toggle expand/collapse for sections in "Learning Preferences"
  const [expandedSections, setExpandedSections] = useState({
    course: true,
    learningStats: true,
    activities: true,
  });

  // Function to toggle open/close section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Helper: Return stats based on user’s vocabulary level
  const getStatsBasedOnLevel = () => {
    if (!userProfile) {
      return { wordsLearned: 0, weeklyGoal: 0, currentStreak: 0, totalScore: 0 };
    }
    const baseStats = {
      beginner: { wordsLearned: 89, weeklyGoal: 25, currentStreak: 5, totalScore: 650 },
      intermediate: { wordsLearned: 234, weeklyGoal: 50, currentStreak: 12, totalScore: 1450 },
      advanced: { wordsLearned: 412, weeklyGoal: 75, currentStreak: 18, totalScore: 2890 },
    };
    const level = userProfile?.vocabularyLevel || "intermediate";
    return baseStats[level as keyof typeof baseStats] || baseStats.intermediate;
  };

  const userStats = getStatsBasedOnLevel();

  return (
    <div className="w-full max-w-[500px] mx-auto bg-white h-screen shadow-lg flex flex-col">
      {/* ------------------- HEADER ------------------- */}
      <div className="flex items-center justify-between px-4 py-5 border-b">
        {/* Back button */}
        <button onClick={onBack}>
          <FiArrowLeft size={22} className="text-yellow-500" />
        </button>

        {/* Page Title */}
        <h1 className="text-lg font-semibold">Profile</h1>

        {/* Search + Menu Icons */}
        <div className="flex gap-4">
          <FiSearch size={20} className="text-gray-700" />
          <FiMenu size={22} className="text-gray-700" />
        </div>
      </div>

      {/* ------------------- PROFILE HEADER ------------------- */}
      <div className="flex items-center justify-between px-4 mt-6">
        {/* Avatar + Edit button */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-pink-300 flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <button className="absolute bottom-0 right-0 bg-white rounded-full px-2 py-0.5 shadow-md text-xs font-semibold">
            Edit
          </button>
        </div>

        {/* Name + Subtitle */}
        <div className="flex-1 ml-4">
          <h2 className="text-base font-semibold">{userProfile.name}</h2>
          <p className="text-sm text-gray-600">Professional Communication Mastery</p>
        </div>

        {/* Settings Icon */}
        <FiSettings size={22} className="text-gray-700" />
      </div>

      {/* ------------------- TABS ------------------- */}
      <div className="flex border-b mt-6">
        {/* Profile Tab */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === "profile"
              ? "text-yellow-500 border-b-2 border-yellow-500"
              : "text-gray-600"
          }`}
        >
          Profile
        </button>

        {/* Learning Preferences Tab */}
        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === "preferences"
              ? "text-yellow-500 border-b-2 border-yellow-500"
              : "text-gray-600"
          }`}
        >
          Learning Preferences
        </button>
      </div>

      {/* ------------------- CONTENT AREA ------------------- */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {activeTab === "profile" ? (
          // ---------------- PROFILE FORM ----------------
          <div>
            <h3 className="text-sm font-semibold mb-2">Professional Information</h3>
            <p className="text-xs text-gray-500 mb-4">
              Update your job title, company, and professional details
            </p>

            {/* Job Title */}
            <div className="mb-3">
              <label className="text-sm text-gray-600">Job Title</label>
              <input
                type="text"
                defaultValue="Marketing Head"
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
              />
            </div>

            {/* Company */}
            <div className="mb-3">
              <label className="text-sm text-gray-600">Company</label>
              <input
                type="text"
                defaultValue="Acufly"
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
              />
            </div>

            {/* Professional Field */}
            <div className="mb-3">
              <label className="text-sm text-gray-600">Professional Field</label>
              <select className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                <option>Marketing</option>
                <option>Engineering</option>
                <option>Design</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="mb-3">
              <label className="text-sm text-gray-600">Experience Level</label>
              <select className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                <option>Mid level 3–7</option>
                <option>Entry level 0–2</option>
                <option>Senior level 8+</option>
              </select>
            </div>
          </div>
        ) : (
          // ---------------- LEARNING PREFERENCES ----------------
          <div>
            {/* Learning Statistics Section */}
            <div className="dashboard-section">
              {/* Section Header with Toggle */}
              <div className="section-header" onClick={() => toggleSection("learningStats")}>
                <h2>Learning Statistics</h2>
                <span className="material-symbols-outlined">
                  {expandedSections.learningStats ? "expand_circle_up" : "expand_circle_down"}
                </span>
              </div>

              {/* Show stats only when expanded */}
              {expandedSections.learningStats && (
                <div className="section-content">
                  <div className="stats-grid">
                    {/* Words Learned Card */}
                    <SpotlightCard
                      className="custom-spotlight-card stat-card stat-words"
                      spotlightColor="rgba(238, 221, 194, 0.85)"
                    >
                      <div className="stat-label flex justify-between w-full">
                        Words Learned{" "}
                        <div className="dashboardIco text-[#f8a725] bg-[#fee8c5] ">
                          <FiBookOpen />
                        </div>
                      </div>
                      <CountUp
                        from={0}
                        to={userStats.wordsLearned}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text stat-value"
                      />
                      <div className="stat-sub">
                        <span className="text-[#28a745]">+12</span> this week
                      </div>
                    </SpotlightCard>

                    {/* Streak Card */}
                    <SpotlightCard
                      className="custom-spotlight-card stat-card stat-streak"
                      spotlightColor="rgba(195, 220, 202, 0.8)"
                    >
                      <div className="stat-label flex justify-between w-full">
                        Current Streak{" "}
                        <div className="dashboardIco !text-[#28a745] bg-[#c8e7ce]">
                          <IoIosTrendingUp />
                        </div>
                      </div>
                      <div className="streakCounter flex gap-1 items-center ">
                        <CountUp
                          from={0}
                          to={userStats.currentStreak}
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
                        <div className="dashboardIco bg-[#b4b4b4] ">
                          <LuBrain />
                        </div>
                      </div>
                      <CountUp
                        from={0}
                        to={userStats.totalScore}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text stat-value"
                      />
                      <div className="stat-sub">Expert level: 3000</div>
                    </SpotlightCard>
                  </div>
                </div>
              )}
            </div>

            {/* Goals & Challenges */}
            <div className="flex items-center justify-between border-b py-3">
              <span className="text-sm font-medium">Goals & Challenges</span>
              <FiChevronDown />
            </div>
          </div>
        )}
      </div>

      {/* ------------------- SAVE BUTTON ------------------- */}
      <div className="px-4 py-3 mb-10">
        <button className="w-full bg-yellow-500 text-white py-2 rounded-md font-semibold">
          Save
        </button>
      </div>

      {/* ------------------- BOTTOM NAV ------------------- */}
      <nav className="bottom-nav border-t bg-white flex justify-around py-2">
        <button className="nav-btn flex flex-col items-center text-gray-600">
          <span role="img" aria-label="Home">
            🏠
          </span>
          <span className="text-xs">Home</span>
        </button>
        <button className="nav-btn flex flex-col items-center text-gray-600">
          <span role="img" aria-label="Activities">
            📚
          </span>
          <span className="text-xs">Activities</span>
        </button>
        <button className="nav-btn flex flex-col items-center text-yellow-500 font-semibold">
          <span role="img" aria-label="Profile">
            👤
          </span>
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default UserProfile;
