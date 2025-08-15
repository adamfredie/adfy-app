import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection } from '../api/supabase';
import { OnboardingData } from '../../components/Onboarding';

// Define the shape of our auth context
interface AuthContextType {
  // User state
  user: User | null;
  session: Session | null;
  userProfile: OnboardingData | null;
  
  // Loading states
  loading: boolean;
  authLoading: boolean;
  
  // Authentication methods
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  
  // Profile management
  updateUserProfile: (profile: Partial<OnboardingData>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  
  // Utility methods
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  
  // Debug methods
  runDiagnostics: () => Promise<any>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// The main AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  // Core auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<OnboardingData | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Computed properties
  const isAuthenticated = !!user && !!session;
  const isEmailVerified = !!user?.email_confirmed_at;

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;

    // Test Supabase connection first
    const testConnection = async () => {
      try {
        console.log('🔍 AuthContext: Testing Supabase connection...');
        const result = await testSupabaseConnection();
        if (result.success) {
          console.log('✅ AuthContext: Supabase connection successful');
        } else {
          console.error('❌ AuthContext: Supabase connection failed:', result.error);
        }
      } catch (error) {
        console.error('💥 AuthContext: Exception testing Supabase connection:', error);
      }
    };

    testConnection();

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          // If we have a session, get the user profile
          if (initialSession?.user) {
            await fetchUserProfile(initialSession.user.id);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession);
        
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (event === 'SIGNED_IN' && newSession?.user) {
            await fetchUserProfile(newSession.user.id);
          } else if (event === 'SIGNED_OUT') {
            setUserProfile(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { getUserProfile } = await import('../api/supabase');
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Profile might not exist yet (new user)
      setUserProfile(null);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && !data.user.email_confirmed_at) {
        return { 
          success: true, 
          error: 'Please check your email and verify your account before signing in.' 
        };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔐 AuthContext: signIn started');
    setAuthLoading(true);
    try {
      console.log('🔐 AuthContext: Calling supabase.auth.signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('🔐 AuthContext: supabase.auth.signInWithPassword completed');

      if (error) {
        console.log('🔐 AuthContext: Sign in error:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user && !data.user.email_confirmed_at) {
        console.log('🔐 AuthContext: Email not confirmed');
        return { 
          success: false, 
          error: 'Please verify your email before signing in.' 
        };
      }

      console.log('🔐 AuthContext: Sign in successful');
      return { success: true };
    } catch (error) {
      console.log('🔐 AuthContext: Sign in exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: errorMessage };
    } finally {
      console.log('🔐 AuthContext: Setting authLoading to false');
      setAuthLoading(false);
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      // State will be cleared by the auth state change listener
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
// Update user profile
  // Update user profile
  const updateUserProfile = async (profile: Partial<OnboardingData>): Promise<void> => {
    if (!user) throw new Error('No user authenticated');
    
    try {
      const { storeUserOnboardingData } = await import('../api/supabase');
      await storeUserOnboardingData(user.id, { ...userProfile, ...profile } as OnboardingData);
      
      // Refresh the profile
      await refreshUserProfile();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Refresh user profile
  const refreshUserProfile = async (): Promise<void> => {
    if (!user) return;
    
    try {
      await fetchUserProfile(user.id);
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      throw error;
    }
  };

  // Debug method to run Supabase diagnostics
  const runDiagnostics = async () => {
    try {
      const { runSupabaseDiagnostics } = await import('../api/supabase');
      return await runSupabaseDiagnostics();
    } catch (error) {
      console.error('Error running diagnostics:', error);
      throw error;
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    authLoading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    refreshUserProfile,
    isAuthenticated,
    isEmailVerified,
    runDiagnostics,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
