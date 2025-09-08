
import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiSettings } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa6";
import { OnboardingData } from "./Onboarding";

import { useAuth } from "../src/contexts/AuthContext";

const UserProfile: React.FC<{
  onBack: () => void;
  userProfile: OnboardingData | null;
}> = ({ onBack, userProfile }) => {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences">("profile");
  const [activeSection, setActiveSection] = useState("Profile");

  const [expandedSections, setExpandedSections] = useState({
    goalsChallenges: false,
    comminicationChallenges: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => {
      const allClosed = Object.keys(prev).reduce((acc, key) => {
        acc[key as keyof typeof expandedSections] = false;
        return acc;
      }, {} as typeof expandedSections);

      return {
        ...allClosed,
        [section]: !prev[section],
      };
    });
  };

  const communicationChallenges = [
    { id: "public-speaking", label: "Public speaking and presentations" },
    { id: "meeting-participation", label: "Active participation in meetings" },
    { id: "email-clarity", label: "Writing clear and professional emails" },
    { id: "difficult-conversations", label: "Having difficult conversations" },
    { id: "networking", label: "Professional networking" },
    { id: "cross-team-collaboration", label: "Cross-team collaboration" },
    { id: "client-communication", label: "Client communication" },
    { id: "virtual-meetings", label: "Virtual meeting facilitation" },
    { id: "persuasive-writing", label: "Persuasive writing and proposals" },
    { id: "conflict-resolution", label: "Conflict resolution" },
  ];

  const improvementGoals = [
    { id: "confidence", label: "Build confidence in speaking" },
    { id: "vocabulary", label: "Expand professional vocabulary" },
    { id: "clarity", label: "Improve message clarity" },
    { id: "persuasion", label: "Enhance persuasive communication" },
    { id: "leadership", label: "Develop leadership communication" },
    { id: "storytelling", label: "Master storytelling techniques" },
    { id: "active-listening", label: "Improve active listening skills" },
    { id: "emotional-intelligence", label: "Enhance emotional intelligence" },
  ];

  // ---------------- Profile Form States ----------------
  const initialForm = {
    jobTitle: "Marketing Head",
    company: "Acufly",
    professionalField: "Marketing",
    experienceLevel: "Mid level 3–7",
  };

  const initialCheckedItems = communicationChallenges
    .concat(improvementGoals)
    .reduce((acc, item) => ({ ...acc, [item.label]: false }), {});

  const [form, setForm] = useState(initialForm);
  const [checkedItems, setCheckedItems] = useState(initialCheckedItems);
  const [ischanged, setIsChanged] = useState(false);

  // Handle checkbox changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCheckedItems((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Check if form or checkboxes changed
  useEffect(() => {
    const hasFormChanged = Object.entries(form).some(
      ([key, value]) => value !== initialForm[key as keyof typeof initialForm]
    );
    const hasCheckboxChanged = Object.entries(checkedItems).some(
      ([key, value]) => value !== initialCheckedItems[key]
    );
    setIsChanged(hasFormChanged || hasCheckboxChanged);
  }, [form, checkedItems]);

  const {signOut} = useAuth();
  // const userStats = getStatsBasedOnLevel();
  return (
    <div className="w-full max-w-[500px] mx-auto bg-white min-h-screen shadow-lg flex flex-col ">
      {/* ------------------- HEADER ------------------- */}
      <div className="flex items-center gap-1 px-4  pt-4 pb-5  ">
        <button onClick={() => (activeSection === "Settings" ? setActiveSection("Profile") : onBack())}>
          <FiArrowLeft size={20} className="text-yellow-500" />
        </button>
        <div className="titleContainer px-3 ">
          <h1>{activeSection}</h1>
        </div>
      </div>

      {/* ------------------- PROFILE HEADER ------------------- */}
      <div className="flex items-center gap-2 h-[80px] px-4 ">
        <div className="relative">
          {userProfile?.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt="User avatar"
              className="w-20 h-20 rounded-full object-cover bg-gray-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-pink-300 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
          )}
        </div>

        <div className="flex-1 ">
          <h2 className="text-[1rem] font-bold">{userProfile?.name}</h2>
          <p className="text-[13px] text-gray-600 font-normal">Professional Communication Mastery</p>
        </div>

        <FiSettings
          size={20}
          className="text-gray-700 cursor-pointer"
          onClick={() =>
            setActiveSection((elem) => (elem === "Settings" ? "Profile" : "Settings"))
          }
        />
      </div>

      {/* ------------------- MAIN CONTENT ------------------- */}
      {activeSection === "Settings" ? (
        <div className="flex flex-col pt-6">
          <div className="border-t-[3px] border-[var(--primary)] pt-2"></div>
          <div className="privacy px-6  text-[1rem] ">
            <div className="w-full text-left py-2 font-bold flex justify-between">
              Privacy Policy <FaArrowRight className="text-gray-300" />
            </div>
            <div className="w-full text-left py-2 font-bold flex justify-between">
              Terms of use <FaArrowRight className="text-gray-300" />
            </div>
            <div className="w-full text-left py-2 font-bold flex justify-between">
              Support <FaArrowRight className="text-gray-300" />
            </div>
          </div>
          <div className="border-t-4 border-b-4 flex items-center  px-6 mt-4 py-4">
            <button className="text-[var(--primary)] font-semibold" onClick={signOut}>Log out</button>
          </div>
        </div>
      ) : (
        <div className="container   ">
          {/* Tabs */}
          <div className="flex border-b text-[14px] ">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 pt-3 pb-2 text-center  font-semibold ${
                activeTab === "profile"
                  ? "border-b-[3px] border-[var(--primary)] font-extrabold"
                  : "text-[var(--font-size-sm)] font-extrabold border-b-2 border-gray-300"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex-1 pt-3 pb-2 text-center font-semibold ${
                activeTab === "preferences"
                  ? "border-b-[3px] border-[var(--primary)] font-extrabold"
                  : "text-[var(--font-size-sm)] font-extrabold border-b-2 border-gray-300"
              }`}
            >
              Learning Preferences
            </button>
          </div>

          {/* Content */}
          <div className="flex-1  py-4  px-4">
            {activeTab === "profile" ? (
              <div>
                <h3 className="userProfileLabel">Professional Information</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Update your job title, company, and professional details
                </p>

                <div className="mb-3">
                  <label className="userProfileLabel">Job Title</label>
                  <input
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                    className="w-full border rounded-md px-3 py-1 text-sm mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label className="userProfileLabel">Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full border rounded-md px-3 py-1 text-sm mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label className="userProfileLabel">Professional Field</label>
                  <select
                    value={form.professionalField}
                    onChange={(e) => setForm({ ...form, professionalField: e.target.value })}
                    className="w-full border rounded-md px-3 py-1 text-sm mt-1"
                  >
                    <option>Marketing</option>
                    <option>Engineering</option>
                    <option>Design</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="userProfileLabel">Experience Level</label>
                  <select
                    value={form.experienceLevel}
                    onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                    className="w-full border rounded-md px-3 py-1 text-sm mt-1"
                  >
                    <option>Mid level 3–7</option>
                    <option>Entry level 0–2</option>
                    <option>Senior level 8+</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="!mt-0">
                {/* Communication Challenges */}
                <div className="div border-b-8 border-gray-100">
                  <div className="challengesDiv">
                    <div
                      className="section-header"
                      onClick={() => toggleSection("comminicationChallenges")}
                    >
                      <h2>Communication Challenges</h2>
                      <span className="material-symbols-outlined">
                        {expandedSections.comminicationChallenges
                          ? "expand_circle_up"
                          : "expand_circle_down"}
                      </span>
                    </div>
                    {expandedSections.comminicationChallenges && (
                      <div className="section-content">
                        <div className="communication-challenges-grid">
                          {communicationChallenges.map((challenge) => (
                            <div key={challenge.id} className="communication-challenge-item">
                              <input
                                type="checkbox"
                                name={challenge.label}
                                onChange={handleChange}
                                checked={!!checkedItems[challenge.label]}
                              />
                              <label className="communication-challenge-label">
                                {challenge.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Improvement Goals */}
                <div className="div border-b-8 border-gray-100">
                  <div className="challengesDiv">
                    <div
                      className="section-header"
                      onClick={() => toggleSection("goalsChallenges")}
                    >
                      <h2>Primary Improvement Goals</h2>
                      <span className="material-symbols-outlined">
                        {expandedSections.goalsChallenges
                          ? "expand_circle_up"
                          : "expand_circle_down"}
                      </span>
                    </div>
                    {expandedSections.goalsChallenges && (
                      <div className="section-content">
                        <div className="communication-challenges-grid">
                          {improvementGoals.map((challenge) => (
                            <div key={challenge.id} className="communication-challenge-item">
                              <input
                                type="checkbox"
                                name={challenge.label}
                                onChange={handleChange}
                                checked={!!checkedItems[challenge.label]}
                              />
                              <label className="communication-challenge-label">
                                {challenge.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {ischanged && (
            <div className="px-4 pt-2 mb-24">
              <button className="w-full bg-[var(--primary)] py-2 rounded-md font-semibold">
                Save
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
