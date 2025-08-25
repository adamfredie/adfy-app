import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection, getURL } from '../api/supabase';
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
  const [userProfile, setUserProfile] = useState<OnboardingData|null>(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Computed properties
  const isAuthenticated = !!user && !!session;
  const isEmailVerified = !!user?.email_confirmed_at;

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;
    let safetyTimeout: NodeJS.Timeout;

    // Safety timeout to ensure loading state is always reset
    safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('⚠️ AuthContext: Safety timeout reached, forcing loading to false');
        setLoading(false);
      }
    }, 10000); // 10 second safety timeout

    // Check if Supabase client is properly initialized
    if (!supabase) {
      console.error('❌ AuthContext: Supabase client is not initialized!');
      console.error('❌ AuthContext: This will cause infinite loading. Check environment variables.');
      
      // Force loading to false to prevent infinite loading
      if (mounted) {
        setLoading(false);
      }
      return;
    }

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

    // Check if this is an auth callback (email verification)
    const checkAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        console.log('🔍 AuthContext: Detected auth code in URL, exchanging for session...');
        console.log('🔍 AuthContext: Code length:', code.length);
        
        // Validate the code before using it
        if (code.length < 10) {
          console.error('❌ AuthContext: Invalid auth code (too short)');
          // Clear the invalid URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          return false;
        }
        
        try {
          // Exchange the code for a session - Updated for Supabase v2.55.0+
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('❌ AuthContext: Failed to exchange code for session:', error);
            // Clear the invalid URL parameters on error
            window.history.replaceState({}, document.title, window.location.pathname);
            return false;
          }
          
          if (data.session) {
            console.log('✅ AuthContext: Successfully exchanged code for session');
            console.log('👤 User authenticated:', data.user?.email);
            console.log('📧 Email confirmed:', data.user?.email_confirmed_at);
            
            // Clear the URL parameters to avoid issues
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Set the session and user immediately
            setSession(data.session);
            setUser(data.user);
            
            // Fetch user profile
            if (data.user) {
              await fetchUserProfile(data.user.id);
            }
            
            return true;
          }
        } catch (error) {
          console.error('❌ AuthContext: Exception during code exchange:', error);
          // Clear the invalid URL parameters on exception
          window.history.replaceState({}, document.title, window.location.pathname);
          return false;
        }
      }
      
      return false;
    };

    // Get initial session
    const getInitialSession = async () => {
      try {
        // Double-check Supabase client is available
        if (!supabase) {
          console.error('❌ AuthContext: Supabase client not available in getInitialSession');
          return;
        }

        console.log('🔍 AuthContext: Getting initial session...');
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          console.log('🔍 AuthContext: Initial session retrieved:', initialSession ? 'exists' : 'none');
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          // If we have a session, get the user profile
          if (initialSession?.user) {
            console.log('🔍 AuthContext: Found existing session, fetching user profile...');
            
            // Add timeout protection for profile fetching
            try {
              const profilePromise = fetchUserProfile(initialSession.user.id);
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Profile fetch timeout after 5 seconds')), 5000);
              });
              
              await Promise.race([profilePromise, timeoutPromise]);
              console.log('✅ AuthContext: User profile fetched successfully');
            } catch (error) {
              console.warn('⚠️ AuthContext: Profile fetch failed or timed out:', error);
              
              // During hot reload, try to recover profile from localStorage as backup
              if (typeof window !== 'undefined') {
                try {
                  const storedProfile = localStorage.getItem('adfy-user-profile');
                  if (storedProfile) {
                    const parsedProfile = JSON.parse(storedProfile);
                    console.log('🔄 AuthContext: Recovered profile from localStorage during hot reload');
                    setUserProfile(parsedProfile);
                  }
                } catch (localStorageError) {
                  console.log('ℹ️ AuthContext: No stored profile in localStorage');
                }
              }
            }
          } else {
            console.log('🔍 AuthContext: No existing session found');
          }
        }
      } catch (error) {
        console.error('❌ AuthContext: Exception getting initial session:', error);
      } finally {
        if (mounted) {
          console.log('✅ AuthContext: Setting loading to false');
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('🔄 AuthContext: Auth state changed:', event, newSession);
        
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (event === 'SIGNED_IN' && newSession?.user) {
            console.log('🔍 AuthContext: SIGNED_IN event, fetching user profile...');
            try {
              // Add timeout protection
              const profilePromise = fetchUserProfile(newSession.user.id);
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Profile fetch timeout after 5 seconds')), 5000);
              });
              
              await Promise.race([profilePromise, timeoutPromise]);
              console.log('✅ AuthContext: User profile fetched successfully');
            } catch (error) {
              console.warn('⚠️ AuthContext: Profile fetch failed or timed out:', error);
              // Continue anyway - don't let profile failure block the app...
            }
          } else if (event === 'SIGNED_OUT') {
            setUserProfile(null);
          } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
            // Handle token refresh (important for email verification)
            console.log('🔄 Token refreshed, user:', newSession.user.email);
            try {
              const profilePromise = fetchUserProfile(newSession.user.id);
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Profile fetch timeout after 5 seconds')), 5000);
              });
              
              await Promise.race([profilePromise, timeoutPromise]);
            } catch (error) {
              console.warn('⚠️ AuthContext: Profile fetch failed or timed out:', error);
            }
          } else if (event === 'USER_UPDATED' && newSession?.user) {
            // Handle user updates (like email confirmation)
            console.log('👤 User updated:', newSession.user.email, 'confirmed:', newSession.user.email_confirmed_at);
            try {
              const profilePromise = fetchUserProfile(newSession.user.id);
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Profile fetch timeout after 5 seconds')), 5000);
              });
              
              await Promise.race([profilePromise, timeoutPromise]);
            } catch (error) {
              console.warn('⚠️ AuthContext: Profile fetch failed or timed out:', error);
            }
          }
        }
      }
    );

    // Check for auth callback after a short delay
    setTimeout(async () => {
      if (mounted) {
        const isAuthCallback = await checkAuthCallback();
        if (isAuthCallback) {
          console.log('✅ AuthContext: Auth callback processed successfully');
        }
      }
    }, 100);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout); // Clear safety timeout on cleanup
    };
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      // Check if Supabase client is available
      if (!supabase) {
        console.error('❌ AuthContext: Supabase client not available in fetchUserProfile');
        setUserProfile(null);
        return;
      }

      console.log('🔍 AuthContext: Fetching user profile for user:', userId);
      const { getUserProfile } = await import('../api/supabase');
      const profile = await getUserProfile(userId);
      
      // Store profile in localStorage as backup for hot reloads
      if (profile && typeof window !== 'undefined') {
        try {
          localStorage.setItem('adfy-user-profile', JSON.stringify(profile));
          console.log('💾 AuthContext: Profile stored in localStorage for hot reload recovery');
        } catch (localStorageError) {
          console.log('ℹ️ AuthContext: Could not store profile in localStorage');
        }
      }
      
      setUserProfile(profile);
      return profile;
    } catch (error: any) {
      console.log('ℹ️ User profile not found (this is normal for new users):', error.message);
      // Profile might not exist yet (new user) - this is not an error
      // Only log as error if it's not a "not found" type error
      if (error.code !== 'PGRST116' && error.message !== 'No rows returned') {
        console.error('Error fetching user profile:', error);
      }
      setUserProfile(null);
      return null;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthLoading(true);
    try {
      // Get the correct redirect URL for the current environment
      const redirectTo = getURL();
      
      console.log('🔐 AuthContext: Signing up with redirectTo:', redirectTo);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo
        }
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
    console.log('🔧 AuthContext: updateUserProfile called with:', profile);
    
    if (!user) {
      console.error('❌ AuthContext: No user found');
      throw new Error('No user authenticated');
    }
    
    console.log('👤 AuthContext: Current user:', user.id);
    
    try {
      console.log('📦 AuthContext: Importing storeUserOnboardingData...');
      const { storeUserOnboardingData } = await import('../api/supabase');
      console.log('✅ AuthContext: storeUserOnboardingData imported successfully');
      
      console.log('🚀 AuthContext: Calling storeUserOnboardingData...');
      await storeUserOnboardingData(user.id, { ...userProfile, ...profile } as OnboardingData);
      console.log('✅ AuthContext: storeUserOnboardingData completed successfully');
      
      // Refresh the profile
      console.log('🔄 AuthContext: Refreshing user profile...');
      await refreshUserProfile();
      console.log('✅ AuthContext: User profile refreshed successfully');
      
    } catch (error) {
      console.error('❌ AuthContext: Error updating user profile:', error);
      console.error('❌ AuthContext: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error type'
      });
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
