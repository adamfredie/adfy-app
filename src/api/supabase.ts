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
    return `${import.meta.env.VITE_SITE_URL}`;
  }
  
  // For local development
  if (isDevelopment) {
    return 'http://localhost:5173';
  }
  
  // Fallback - try to detect from window.location
  if (typeof window !== 'undefined') {
    return `${window.location.origin}`;
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

// Learning Statistics Functions
export interface DailyWord {
  word: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Save vocabulary words learned
export async function saveVocabularyWords(userId: string, words: DailyWord[], field: string) {
  try {
    // First, save words to word_bank table
    await saveWordsToWordBank(words, field);
    
    // Then, save user progress to vocabulary_progress table
    const vocabularyData = words.map(word => ({
      user_id: userId,
      word: word.word,
      field_category: field
    }));

    const { data, error } = await supabase
      .from('vocabulary_progress')
      .upsert(vocabularyData, { onConflict: 'user_id,word' })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving vocabulary data:', error);
    throw error;
  }
}

// Record daily activity for streak calculation
export async function recordDailyActivity(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_activity')
    .upsert([{
      user_id: userId,
      activity_date: today
    }], { onConflict: 'user_id,activity_date' })
    .select();

  if (error) throw error;
  return data;
}

// Update user's total score
export async function updateUserTotalScore(userId: string, newScore: number) {
  const { data, error } = await supabase
    .from('user_scores')
    .upsert([{
      user_id: userId,
      total_score: newScore,
      last_updated: new Date().toISOString()
    }], { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get user learning statistics
export async function getUserLearningStats(userId: string) {
  // Get total unique words learned
  const { data: wordsData, error: wordsError } = await supabase
    .from('vocabulary_progress')
    .select('word')
    .eq('user_id', userId);

  if (wordsError) throw wordsError;

  // Calculate current streak from daily activity
  const { data: activityData, error: activityError } = await supabase
    .from('daily_activity')
    .select('activity_date')
    .eq('user_id', userId)
    .order('activity_date', { ascending: false });

  if (activityError) throw activityError;

  // Calculate streak logic
  let currentStreak = 0;
  if (activityData && activityData.length > 0) {
    const today = new Date();
    let checkDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasActivity = activityData.some(activity => 
        activity.activity_date === dateStr
      );
      
      if (hasActivity) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Get total score
  const { data: scoreData, error: scoreError } = await supabase
    .from('user_scores')
    .select('total_score')
    .eq('user_id', userId)
    .single();

  if (scoreError && scoreError.code !== 'PGRST116') throw scoreError;

  return {
    wordsLearned: wordsData?.length || 0,
    currentStreak: currentStreak,
    totalScore: scoreData?.total_score || 0
  };
}

// Word Bank Functions - Simplified approach
export interface WordBankWord {
  id: string;
  word: string;
  type: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  definition: string;
  field_category?: string;
  learned_at?: string; // When the user learned this word
}

// Save words to word_bank table
export async function saveWordsToWordBank(words: DailyWord[], field: string) {
  try {
    // Check which words already exist in word_bank
    const existingWords = words.map(w => w.word);
    const { data: existingData, error: checkError } = await supabase
      .from('word_bank')
      .select('word')
      .in('word', existingWords);

    if (checkError) throw checkError;

    // Filter out words that already exist
    const existingWordSet = new Set(existingData?.map(item => item.word) || []);
    const newWords = words.filter(word => !existingWordSet.has(word.word));

    if (newWords.length === 0) {
      console.log('All words already exist in word_bank');
      return [];
    }

    // Only insert new words
    const wordBankData = newWords.map(word => ({
      word: word.word,
      type: word.partOfSpeech || 'noun',
      difficulty: word.difficulty || 'intermediate',
      definition: word.definition,
      field_category: field
    }));

    const { data, error } = await supabase
      .from('word_bank')
      .insert(wordBankData)
      .select();

    if (error) throw error;
    
    console.log(`Inserted ${newWords.length} new words into word_bank`);
    return data;
  } catch (error) {
    console.error('Error saving words to word_bank:', error);
    throw error;
  }
}

// Get words from word_bank table by field category
export async function getWordBankWordsByField(field: string): Promise<WordBankWord[]> {
  try {
    const { data, error } = await supabase
      .from('word_bank')
      .select('*')
      .eq('field_category', field)
      .order('word', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching word bank words by field:', error);
    throw error;
  }
}

// Fetch words that the user has learned from their activities
export async function getWordBankWords(userId: string, field?: string): Promise<WordBankWord[]> {
  try {
    // Get words from user's vocabulary progress (what they've learned)
    let query = supabase
      .from('vocabulary_progress')
      .select('*')
      .eq('user_id', userId);

    // Filter by field if specified
    if (field) {
      query = query.eq('field_category', field);
    }

    const { data: progressData, error: progressError } = await query;

    if (progressError) {
      console.error('Error fetching user vocabulary progress:', progressError);
      throw progressError;
    }

    if (!progressData || progressData.length === 0) {
      console.log('No vocabulary progress found for user:', userId);
      return [];
    }

    // Get detailed word information from the word_bank table
    const wordIds = progressData.map(item => item.word);
    
    // Remove field category filter from word_bank query to get all word definitions
    // This ensures we get the word details even if field categories don't match exactly
    const { data: wordDetails, error: wordDetailsError } = await supabase
      .from('word_bank')
      .select('*')
      .in('word', wordIds);

    if (wordDetailsError) {
      console.error('Error fetching word details:', wordDetailsError);
      throw wordDetailsError;
    }

    // Add debug logging to help troubleshoot field category mismatches
    console.log('Debug - Progress data:', progressData);
    console.log('Debug - Word details found:', wordDetails);
    console.log('Debug - Words with missing definitions:', 
      progressData.filter(item => !wordDetails?.find(detail => detail.word === item.word))
        .map(item => ({ word: item.word, field: item.field_category }))
    );

    // Merge progress data with word details
    const transformedWords: WordBankWord[] = (progressData || []).map((progressItem: any) => {
      const wordDetail = wordDetails?.find(detail => detail.word === progressItem.word);
      
      return {
        id: progressItem.id || progressItem.word_id,
        word: progressItem.word,
        type: wordDetail?.type || 'noun',
        difficulty: wordDetail?.difficulty || 'intermediate',
        definition: wordDetail?.definition || `Definition for ${progressItem.word}`,
        field_category: progressItem.field_category,
        learned_at: progressItem.created_at || progressItem.learned_at || new Date().toISOString()
      };
    });

    return transformedWords;
  } catch (error) {
    console.error('Error in getWordBankWords:', error);
    throw error;
  }
}

// Update user profile information in Supabase
export const updateUserProfileInSupabase = async (
  userId: string,
  updateData: {
    jobTitle: string;
    company: string;
    professionalField: string;
    experienceLevel: string;
    communicationChallenges: string[];
    improvementGoals: string[];
  }
) => {
  try {
    // First, get the current user profile to check if field is changing
    const { data: currentProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('field')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching current profile:', fetchError);
      throw fetchError;
    }

    const oldField = currentProfile?.field;
    const newField = updateData.professionalField;

    // Update the user profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        job_title: updateData.jobTitle,
        company: updateData.company,
        field: updateData.professionalField,
        experience_level: updateData.experienceLevel,
        communication_challenges: updateData.communicationChallenges,
        improvement_goals: updateData.improvementGoals,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    // If the professional field changed, migrate vocabulary progress
    if (oldField && newField && oldField !== newField) {
      console.log(`Professional field changed from ${oldField} to ${newField}, migrating vocabulary progress...`);
      
      try {
        const migrationResult = await migrateVocabularyProgress(userId, oldField, newField);
        if (migrationResult.success) {
          console.log(`Successfully migrated ${migrationResult.migratedCount} vocabulary records`);
        } else {
          console.warn('Vocabulary migration failed, but profile update succeeded');
        }
      } catch (migrationError) {
        console.error('Error during vocabulary migration:', migrationError);
        // Don't fail the entire update if migration fails
      }
    }

    console.log('User profile updated successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return { success: false, error };
  }
};

// Field Word Recommendations
export async function getFieldWordRecommendations(userId: string, field: string) {
  try {
    // Get all words from the word_bank for the given field
    const { data: wordBankData, error: wordBankError } = await supabase
      .from('word_bank')
      .select('*')
      .eq('field_category', field)
      .order('word', { ascending: true });

    if (wordBankError) {
      console.error('Error fetching word bank words for recommendations:', wordBankError);
      throw wordBankError;
    }

    // Filter out words that the user has already learned
    const { data: userWords, error: userWordsError } = await supabase
      .from('vocabulary_progress')
      .select('word')
      .eq('user_id', userId)
      .eq('field_category', field);

    if (userWordsError) {
      console.error('Error fetching user learned words:', userWordsError);
      throw userWordsError;
    }

    const learnedWordSet = new Set(userWords?.map(item => item.word) || []);
    const recommendations = wordBankData.filter(word => !learnedWordSet.has(word.word));

         console.log(`Retrieved ${recommendations.length} field recommendations for user ${userId} in field ${field}`);
     return recommendations;
  } catch (error) {
    console.error('Error in getFieldWordRecommendations:', error);
    throw error;
  }
}

// Migrate user's vocabulary progress to new field category when they change professional field
export async function migrateVocabularyProgress(userId: string, oldField: string, newField: string): Promise<{ success: boolean; migratedCount: number }> {
  try {
    // Update all vocabulary progress records for this user from old field to new field
    const { data, error } = await supabase
      .from('vocabulary_progress')
      .update({ field_category: newField })
      .eq('user_id', userId)
      .eq('field_category', oldField);

    if (error) {
      console.error('Error migrating vocabulary progress:', error);
      throw error;
    }

    // Count how many records were updated
    const { count, error: countError } = await supabase
      .from('vocabulary_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('field_category', newField);

    if (countError) {
      console.error('Error counting migrated records:', countError);
      throw countError;
    }

    const migratedCount = count || 0;
    console.log(`Successfully migrated ${migratedCount} vocabulary progress records from ${oldField} to ${newField} for user ${userId}`);
    
    return { success: true, migratedCount };
  } catch (error) {
    console.error('Failed to migrate vocabulary progress:', error);
    return { success: false, migratedCount: 0 };
  }
}