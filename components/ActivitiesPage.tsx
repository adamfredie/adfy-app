import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiMessageSquare } from 'react-icons/fi';

interface ActivitiesPageProps {
  onBack: () => void;
}

const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ onBack }) => {
  const navigate = useNavigate();

  const handleActivitySelect = (activity: string) => {
    navigate(`/app/${activity}`);
  };

  return (
    <div className="w-full max-w-[500px] mx-auto bg-white min-h-screen shadow-lg flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="text-[var(--primary)]">
            <FiArrowLeft size={22} strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold">Activities</h1>
          <div className="w-6"></div> {/* Spacer */}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-20">
        <div className="space-y-4">
          {/* Word Bank Activity */}
          <div 
            className="activity-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleActivitySelect('wordBank')}
          >
            <div className="activity-header">
              <div className="activity-icon">
                <FiBookOpen size={24} className="text-[#17A2B8]" />
              </div>
              <div className="activity-info">
                <h3 className="activity-title">Word Bank</h3>
                <p className="activity-description">
                  Explore and learn words you learned so far.
                </p>
              </div>
            </div>
            <div className="activity-footer">
              <button className="activity-btn">
                Start Learning
              </button>
            </div>
          </div>

          {/* AI Storytelling Activity */}
          <div 
            className="activity-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleActivitySelect('storytelling')}
          >
            <div className="activity-header">
              <div className="activity-icon">
                <FiMessageSquare size={24} className="text-[var(--primary)]" />
              </div>
              <div className="activity-info">
                <h3 className="activity-title">AI Storytelling</h3>
                <p className="activity-description">
                  Create professional stories with AI guidance, practice vocabulary usage, and improve communication skills.
                </p>
                <div className="activity-features">
                </div>
              </div>
            </div>
            <div className="activity-footer">
              <button className="activity-btn">
                Start Writing
              </button>
            </div>
          </div>

          {/* Coming Soon Activities */}
          <div className="activity-card activity-card-disabled">
            <div className="activity-header">
              <div className="activity-icon opacity-50">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-xs">+</span>
                </div>
              </div>
              <div className="activity-info">
                <h3 className="activity-title opacity-50">More Activities</h3>
                <p className="activity-description opacity-50">
                  New learning activities are coming soon to enhance your professional development journey.
                </p>
                <div className="activity-features">
                  <span className="feature-tag opacity-50">Coming Soon</span>
                </div>
              </div>
            </div>
            <div className="activity-footer">
              <span className="activity-duration opacity-50">TBD</span>
              <button className="activity-btn opacity-50" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
