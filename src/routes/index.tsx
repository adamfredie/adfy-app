import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SplashScreen } from '../../components/SplashScreen';
import { WelcomePages } from '../../components/WelcomePages';
import { Onboarding } from '../../components/Onboarding';
import { MainApp } from '../../components/MainApp';
import { NotFound } from '../components/NotFound';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Lazy load components for better performance
const AuthWrapper = React.lazy(() => import('../../components/auth/AuthWrapper').then(module => ({ default: module.AuthWrapper })));
const SignupForm = React.lazy(() => import('../../components/auth/SignupForm').then(module => ({ default: module.SignupForm })));

// Wrapper components to handle props
function AuthWrapperWrapper() {
  return <AuthWrapper onAuthSuccess={() => {}} onClose={() => {}} skipAuthCheck={false} />;
}

function SignupFormWrapper() {
  return <SignupForm onSuccess={() => {}} onSwitchToLogin={() => {}} onClose={() => {}} />;
}

export function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/welcome" element={<WelcomePages />} />
          <Route path="/auth/login" element={<AuthWrapperWrapper />} />
          <Route path="/auth/signup" element={<SignupFormWrapper />} />
          
          {/* Protected routes */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } 
          />
          
          {/* Main app routes */}
          <Route 
            path="/app/*" 
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
