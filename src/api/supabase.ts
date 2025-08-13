import { createClient } from "@supabase/supabase-js"
import { OnboardingData } from "/Users/sadia/Documents/Learning Language/adfy-app/components/Onboarding"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing supabase environment variables")
} else {
    console.log("Supabase environment variables loaded")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)




export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

// User data functions
export const storeUserOnboardingData = async (userId: string, onboardingData: OnboardingData) => {
    const { data,error } = await supabase
        .from('user_profiles')
        .upsert({
            user_id: userId,
            name: onboardingData.name,
            email: onboardingData.email,
            job_title: onboardingData.jobTitle,
            company: onboardingData.company,
            field: onboardingData.field,
            experience_level: onboardingData.experienceLevel,
            vocabulary_level: onboardingData.vocabularyLevel,
            communication_confidence: onboardingData.communicationConfidence,
            communication_challenges: onboardingData.communicationChallenges,
            improvement_goals: onboardingData.improvementGoals,
            current_skill_level: onboardingData.currentSkillLevel,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()

    if (error) throw error
    return data 
}

// Get user profile data
export const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        // .limit(1)
        // .maybeSingle()
        .single()

    if (error) throw error
    return data
}