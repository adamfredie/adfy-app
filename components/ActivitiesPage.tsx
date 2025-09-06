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
    <div className="w-full max-w-[500px] mx-auto bg-white h-screen shadow-lg flex flex-col mb-4 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b border-gray-200 bg-white sticky top-0">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="text-[var(--primary)]">
            <FiArrowLeft size={22} strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold">Activities</h1>
          <div className="w-6"></div> {/* Spacer */}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="flex-1 px-4 space-y-4 mt-4">
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
            <button className="aduffy-button continue-button">
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
            </div>
          </div>
          <div className="activity-footer">
            <button className="aduffy-button continue-button">
              Start Writing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
