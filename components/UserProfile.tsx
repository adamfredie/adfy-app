import React from "react";
import { FiArrowLeft, FiSearch, FiMenu, FiSettings } from "react-icons/fi";

const UserProfile: React.FC = () => {
  return (
    <div className="w-full max-w-[500px] mx-auto bg-white h-screen shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button>
          <FiArrowLeft size={22} className="text-yellow-500" />
        </button>
        <h1 className="text-lg font-semibold">Profile</h1>
        <div className="flex gap-4">
          <FiSearch size={20} className="text-gray-700" />
          <FiMenu size={22} className="text-gray-700" />
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-pink-300 flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <button className="absolute bottom-0 right-0 bg-white rounded-full px-2 py-1 shadow-md text-xs font-semibold">
            Edit
          </button>
        </div>

        <h2 className="mt-3 text-lg font-semibold">Junaid Bhat</h2>
        <p className="text-sm text-gray-600 text-center px-4">
          Professional Communication Mastery
        </p>
      </div>

      {/* Settings Icon */}
      <div className="flex justify-center mt-4">
        <FiSettings size={22} className="text-gray-700" />
      </div>
    </div>
  );
};

export default UserProfile;
