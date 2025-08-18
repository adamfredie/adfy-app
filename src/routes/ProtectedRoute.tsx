import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, userProfile } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to welcome page
  if (!isAuthenticated) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  // Special case: Allow access to onboarding page even without userProfile
  // This prevents infinite redirect loops when new users need to complete onboarding
  if (location.pathname === '/onboarding') {
    return <>{children}</>;
  }

  // If authenticated but hasn't completed onboarding, redirect to onboarding
  if (!userProfile || !userProfile.name || !userProfile.jobTitle) {
    return <Navigate to="/onboarding" replace />;
  }

  // User is authenticated and has completed onboarding, show protected content
  return <>{children}</>;
}
