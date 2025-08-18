import { createClient } from "@supabase/supabase-js"
import { OnboardingData } from "/Users/sadia/Documents/Learning Language/adfy-app/components/Onboarding"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isDevelopment = import.meta.env.DEV;

// Helper function to get the correct URL for redirects based on environment
export const getURL = () => {
  // For Vercel deployments
  if (import.meta.env.VITE_VERCEL_URL) {
    return `https://${import.meta.env.VITE_VERCEL_URL}`;
  }
  
  // For production with custom domain
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL;
  }
  
  // For local development
  if (isDevelopment) {
    return 'http://localhost:5173';
  }
  
  // Fallback - try to detect from window.location
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Default fallback
  return 'http://localhost:3000';
};

// Get the current URL for auth redirects
const getCurrentURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return getURL();
};

console.log('🔧 Supabase configuration check:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length,
  keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined',
  currentURL: getURL(),
  isDevelopment
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey
    });
    throw new Error("Missing supabase environment variables")
} else {
    if (isDevelopment) {
        console.log("✅ Supabase environment variables loaded successfully")
    }
}

// Create Supabase client with additional options for debugging
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Add these for better production handling
        // flowType: 'pkce',
        debug: import.meta.env.DEV // Enable debug in development only
    },
    global: {
        headers: {
            'X-Client-Info': 'adfy-app'
        }
    }
})

// Test Supabase connection immediately
export const testSupabaseConnection = async () => {
    try {
        if (isDevelopment) {
            console.log('🔍 Testing Supabase connection...');
        }
        
        // Test basic connection
        const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
        
        if (error) {
            if (isDevelopment) {
                console.error('❌ Supabase connection test failed:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                
                // Check for specific error types
                if (error.code === 'PGRST301') {
                    console.error('🚫 CORS issue detected - Request blocked by CORS policy');
                } else if (error.code === 'PGRST116') {
                    console.error('🔒 Authentication required - Check API key permissions');
                } else if (error.code === '42P01') {
                    console.error('📋 Table "user_profiles" does not exist - Check database schema');
                }
            }
            
            return { success: false, error };
        } else {
            if (isDevelopment) {
                console.log('✅ Supabase connection test successful');
            }
            return { success: true, data };
        }
    } catch (err) {
        if (isDevelopment) {
            console.error('💥 Exception during Supabase connection test:', err);
        }
        return { success: false, error: err };
    }
};

// Test table access
export const testTableAccess = async () => {
  try {
    console.log('🔍 Testing user_profiles table access...');
    
    // Try to select from the table to see if it exists and is accessible
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Table access test failed:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Check if it's a table doesn't exist error
      if (error.code === '42P01') {
        console.error('📋 Table "user_profiles" does not exist! You need to create it in Supabase.');
      }
      
      return { success: false, error };
    } else {
      console.log('✅ Table access test successful. Sample data:', data);
      return { success: true, data };
    }
  } catch (err) {
    console.error('💥 Exception testing table access:', err);
    return { success: false, error: err };
  }
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

// User data functions
export const storeUserOnboardingData = async (userId: string, onboardingData: OnboardingData) => {
  try {
    console.log('🔍 storeUserOnboardingData: Starting with data:', onboardingData);
    console.log('🔍 storeUserOnboardingData: User ID:', userId);
    
    // No need to call supabase.auth.getUser() - we already have the user data from AuthContext
    // The email is already in onboardingData.email
    
    // Prepare the data with proper fallbacks and validation
    const profileData = {
      user_id: userId,
      name: onboardingData.name || 'Unknown User',
      email: onboardingData.email || '', // Use email from onboardingData instead
      job_title: onboardingData.jobTitle || '',
      company: onboardingData.company || '',
      field: onboardingData.field || onboardingData.fieldOfInterest || '',
      experience_level: onboardingData.experienceLevel || '',
      vocabulary_level: onboardingData.vocabularyLevel || 'intermediate',
      communication_confidence: onboardingData.communicationConfidence || {},
      communication_challenges: onboardingData.communicationChallenges || [],
      improvement_goals: onboardingData.improvementGoals || [],
      current_skill_level: onboardingData.currentSkillLevel || 'intermediate',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    console.log('🔍 storeUserOnboardingData: Prepared profile data:', profileData);
    console.log('🚀 storeUserOnboardingData: About to call Supabase upsert...');
    console.log('🔍 storeUserOnboardingData: profileData for Supabase:', JSON.stringify(profileData, null, 2));
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profileData)
      .select();

    if (error) {
      console.error("❌ storeUserOnboardingData failed:", error);
      console.error("❌ Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log("✅ storeUserOnboardingData successful:", data);
    return data;
  } catch (error) {
    console.error("💥 storeUserOnboardingData exception:", error);
    throw error;
  }
}

// Get user profile data
export const getUserProfile = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error) {
            // If it's a "no rows returned" error, this is normal for new users
            if (error.code === 'PGRST116' || error.message.includes('No rows returned')) {
                console.log('ℹ️ No user profile found for user:', userId, '- This is normal for new users');
                return null;
            }
            // For other errors, throw them
            throw error;
        }
        
        // Profile found, return mapped data
        const mappedProfile = {
          ...data,
          name: data.name, // Add explicit mapping for name field
          jobTitle: data.job_title,
          experienceLevel: data.experience_level,
          vocabularyLevel: data.vocabulary_level,
          communicationConfidence: data.communication_confidence,
          communicationChallenges: data.communication_challenges,
          improvementGoals: data.improvement_goals,
          currentSkillLevel: data.current_skill_level
      };
      
      console.log('🔍 getUserProfile: Raw data from database:', data);
      console.log('🔍 getUserProfile: Mapped profile:', mappedProfile);
      
      return mappedProfile;
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        throw error;
    }
}

// Comprehensive Supabase diagnostic function
export const runSupabaseDiagnostics = async () => {
    console.log('🔍 Starting comprehensive Supabase diagnostics...');
    
    const results = {
        envVars: false,
        clientCreation: false,
        connection: false,
        tableAccess: false,
        auth: false
    };
    
    try {
        // 1. Check environment variables
        console.log('📋 Step 1: Environment Variables Check');
        if (supabaseUrl && supabaseAnonKey) {
            console.log('✅ Environment variables are present');
            results.envVars = true;
        } else {
            console.error('❌ Environment variables missing');
            return results;
        }
        
        // 2. Test client creation
        console.log('📋 Step 2: Client Creation Test');
        try {
            const testClient = createClient(supabaseUrl, supabaseAnonKey);
            console.log('✅ Supabase client created successfully');
            results.clientCreation = true;
        } catch (error) {
            console.error('❌ Failed to create Supabase client:', error);
            return results;
        }
        
        // 3. Test basic connection
        console.log('📋 Step 3: Basic Connection Test');
        const connectionTest = await testSupabaseConnection();
        results.connection = connectionTest.success;
        
        // 4. Test table access
        console.log('📋 Step 4: Table Access Test');
        const tableTest = await testTableAccess();
        results.tableAccess = tableTest.success;
        
        // 5. Test authentication
        console.log('📋 Step 5: Authentication Test');
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('❌ Authentication test failed:', error);
            } else {
                console.log('✅ Authentication test successful, session:', session ? 'exists' : 'none');
                results.auth = true;
            }
        } catch (error) {
            console.error('❌ Authentication test exception:', error);
        }
        
        // Summary
        console.log('📊 Supabase Diagnostics Summary:', results);
        
        if (Object.values(results).every(Boolean)) {
            console.log('🎉 All Supabase tests passed!');
        } else {
            console.log('⚠️ Some Supabase tests failed. Check the logs above for details.');
        }
        
        return results;
        
    } catch (error) {
        console.error('💥 Exception during Supabase diagnostics:', error);
        return results;
    }
};

// Browser console test function - can be called directly from browser console
export const testFromConsole = async () => {
    console.log('🔍 Testing Supabase from browser console...');
    console.log('Environment variables:', {
        url: supabaseUrl,
        hasKey: !!supabaseAnonKey,
        keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined'
    });
    
    try {
        // Test 1: Basic client creation
        console.log('📋 Test 1: Client Creation');
        const testClient = createClient(supabaseUrl, supabaseAnonKey);
        console.log('✅ Client created successfully');
        
        // Test 2: Simple query
        console.log('📋 Test 2: Simple Query Test');
        const { data, error } = await testClient.from('user_profiles').select('count').limit(1);
        
        if (error) {
            console.error('❌ Query failed:', {
                code: error.code,
                message: error.message,
                details: error.details
            });
            
            // Check for CORS issues
            if (error.message.includes('CORS') || error.message.includes('blocked')) {
                console.error('🚫 CORS issue detected! This is likely a browser security policy issue.');
                console.log('💡 Solutions:');
                console.log('1. Check if Supabase project has correct CORS origins');
                console.log('2. Ensure you\'re running from an allowed origin');
                console.log('3. Check browser console for CORS errors');
            }
        } else {
            console.log('✅ Query successful:', data);
        }
        
        // Test 3: Auth test
        console.log('📋 Test 3: Authentication Test');
        const { data: authData, error: authError } = await testClient.auth.getSession();
        if (authError) {
            console.error('❌ Auth test failed:', authError);
        } else {
            console.log('✅ Auth test successful:', authData);
        }
        
    } catch (err) {
        console.error('💥 Exception during console test:', err);
        
        // Check for network errors
        if (err instanceof TypeError && err.message.includes('fetch')) {
            console.error('🌐 Network error detected. This might be a CORS or network connectivity issue.');
        }
    }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
    (window as any).testSupabase = testFromConsole;
    console.log('🔧 Supabase test function available at: window.testSupabase()');
}

// Function to handle auth callbacks (email verification)
export const handleAuthCallback = async () => {
  try {
    console.log('🔄 handleAuthCallback: Processing auth callback...');
    
    // Get the current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ handleAuthCallback: Session error:', error);
      return { success: false, error };
    }
    
    if (session?.user) {
      console.log('✅ handleAuthCallback: User authenticated:', session.user.email);
      console.log('📧 Email confirmed:', session.user.email_confirmed_at);
      return { success: true, session, user: session.user };
    } else {
      console.log('⚠️ handleAuthCallback: No session found');
      return { success: false, error: 'No session found' };
    }
  } catch (err) {
    console.error('💥 handleAuthCallback: Exception:', err);
    return { success: false, error: err };
  }
};

// Function to check if current URL is an auth callback
export const isAuthCallback = () => {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const refreshToken = urlParams.get('refresh_token');
  const type = urlParams.get('type');
  
  return !!(accessToken && refreshToken && type === 'recovery');
};