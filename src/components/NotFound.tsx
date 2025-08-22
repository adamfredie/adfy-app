import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();

  const handleGoToDashboard = () => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
    } else {
      navigate('/welcome');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/welcome');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Go to Welcome'}
          </button>
          
          {isAuthenticated && (
            <button
              onClick={handleSignOut}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Sign Out
            </button>
          )}
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
