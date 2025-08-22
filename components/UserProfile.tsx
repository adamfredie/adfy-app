import React, { useState } from "react";
import {
  FiArrowLeft,
  FiSearch,
  FiMenu,
  FiSettings,
} from "react-icons/fi";
import Learningstatics from "./Learningstatics";
import { FaArrowRight } from "react-icons/fa6";

// Main UserProfile Component
const UserProfile: React.FC<{
  onBack: () => void;
  userProfile: { name: Object };
}> = ({ onBack, userProfile }) => {

  const [activeTab, setActiveTab] = useState<"profile" | "preferences">("profile");

  // Toggle expand/collapse for sections in "Learning Preferences"
  const [expandedSections, setExpandedSections] = useState({
    course: true,
    learningStats: false,
    // activities: true,
    goalsChallenges: false,
  });

  // Function to toggle open/close section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

const [activeSection, setActiveSection] = useState("profile"); 

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

    const level = userProfile?.vocabulary_level || "intermediate";
    return baseStats[level as keyof typeof baseStats] || baseStats.intermediate;
  };

  const userStats = getStatsBasedOnLevel();

  return (
    <div className="w-full max-w-[500px] mx-auto bg-white h-screen shadow-lg flex flex-col">
      {/* ------------------- HEADER ------------------- */}
      <div className="flex items-center justify-between px-4 py-2 ">
        {/* Back button */}
        <button onClick={onBack}>
          <FiArrowLeft size={22} className="text-yellow-500" />
        </button>

        {/* Page Title */}
        <div className="titleContainer px-3 w-full">
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>

        {/* Search + Menu Icons */}
        <div className="flex gap-4">
          <FiSearch size={20} className="text-black font-bold" />
          <FiMenu size={22} className="text-black font-bold" />
        </div>
      </div>

      {/* ------------------- PROFILE HEADER ------------------- */}
      <div className="flex items-center justify-between px-4 mt-4">
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
          <FiSettings
            size={22}
            className="text-gray-700 cursor-pointer"
            onClick={() => setActiveSection((elem)=>{
              if(elem =="settings"){
                return 'profile'
              }else{
                return 'settings'
              }
            })}
          />
      </div>

      {/* // at bottom of return(), just before closing </div> of main container: */}
     {activeSection === "settings" ? (
  <div className=" flex flex-col mt-16">

    <div className="border-t-[3px] border-[var(--primary)] pt-2"></div>

    <div className="privacy px-6">

      <div className="w-full text-left py-2  font-bold flex justify-between">
        Privacy Policy
        <button className="text-gray-300">
          <FaArrowRight/>
          </button>
        </div>
       <div className="w-full text-left py-2  font-bold flex justify-between">
        Terms of use
        <button className="text-gray-300">
          <FaArrowRight/>
          </button>
        </div>
       <div className="w-full text-left py-2  font-bold flex justify-between">
        Support
        <button className="text-gray-300">
          <FaArrowRight/>
          </button>
        </div>
    </div>

    <div className="border-t-2 px-6 mt-4 pt-4">
      <button className="text-[var(--primary)] font-semibold">Log out</button>
    </div>
  </div>
):

      <div className="container">

      <div className="flex border-b mt-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === "profile"
              ? "  border-b-[3px] border-[var(--primary)] font-extrabold"
              : "text-[var(--font-size-sm)] font-extrabold  border-b-2 border-gray-300"
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === "preferences"
              ? "  border-b-[3px] border-[var(--primary)] font-extrabold"
              : "text-[var(--font-size-sm)] font-extrabold border-b-2 border-gray-300"
          }`}
        >
          <h2>
            Learning Preferences
          </h2>
        </button>
      </div>

      {/* ------------------- CONTENT AREA ------------------- */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {activeTab === "profile" ? (
          // ---------------- PROFILE FORM ----------------
          <div>
            <h3 className="userProfileLabel">Professional Information</h3>
            <p className="text-sm text-gray-700 mb-4">
              Update your job title, company, and professional details
            </p>

            {/* Job Title */}
            <div className="mb-3">
              <label className="userProfileLabel">Job Title</label>
              <input
                type="text"
                defaultValue="Marketing Head"
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
              />
            </div>

            {/* Company */}
            <div className="mb-3">
              <label className="userProfileLabel">Company</label>
              <input
                type="text"
                defaultValue="Acufly"
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
              />
            </div>

            {/* Professional Field */}
            <div className="mb-3">
              <label className="userProfileLabel">Professional Field</label>
              <select className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                <option>Marketing</option>
                <option>Engineering</option>
                <option>Design</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="mb-3">
              <label className="userProfileLabel">Experience Level</label>
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
            <Learningstatics userStats={userStats} expandedSections={expandedSections} toggleSection={toggleSection} />

            {/* Goals & Challenges */}
            <div className="dashboard-section">
              <div className="section-header" onClick={() => toggleSection('goalsChallenges')}>
                <h2>Goals & Challenges</h2>
                <span className="material-symbols-outlined">
                  {expandedSections.goalsChallenges ? "expand_circle_up" : "expand_circle_down"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------- SAVE BUTTON ------------------- */}
      <div className="px-4 py-3 mb-10">
        <button className="w-full bg-[var(--primary)]  py-2 rounded-md font-semibold">
          Save
        </button>
      </div>
      </div>

}


      {/* ------------------- TABS ------------------- */}


      {/* ------------------- BOTTOM NAV ------------------- */}
      {/* Bottom Navigation (mobile only) */}
      <nav className="bottom-nav">
        <button className="nav-btn">
          <span role="img" aria-label="Home">🏠</span>
          <span>Home</span>
        </button>
        <button className="nav-btn">
          <span role="img" aria-label="Activities">📚</span>
          <span>Activities</span>
        </button>
        <button className="nav-btn active">
          <span role="img" aria-label="Profile">👤</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default UserProfile;
