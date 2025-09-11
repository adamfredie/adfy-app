-- Add gender and avatar_url columns to user_profiles table
-- This migration adds the missing fields that are used in the onboarding process

-- Check if the gender column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'gender'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN gender VARCHAR(50);
        RAISE NOTICE 'Added gender column to user_profiles table';
    ELSE
        RAISE NOTICE 'gender column already exists in user_profiles table';
    END IF;
END $$;

-- Check if the avatar_url column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN avatar_url TEXT;
        RAISE NOTICE 'Added avatar_url column to user_profiles table';
    ELSE
        RAISE NOTICE 'avatar_url column already exists in user_profiles table';
    END IF;
END $$;

-- Add constraints for gender field (optional values)
DO $$ 
BEGIN
    -- Add check constraint for gender if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.check_constraints 
        WHERE constraint_name = 'user_profiles_gender_check'
    ) THEN
        ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_gender_check 
        CHECK (gender IS NULL OR gender IN ('male', 'female', 'prefer-not-to-say', 'other'));
        RAISE NOTICE 'Added gender check constraint to user_profiles table';
    ELSE
        RAISE NOTICE 'gender check constraint already exists in user_profiles table';
    END IF;
END $$;

-- Create index on gender for better query performance (optional)
CREATE INDEX IF NOT EXISTS idx_user_profiles_gender ON user_profiles(gender);

-- Create index on avatar_url for better query performance (optional)
CREATE INDEX IF NOT EXISTS idx_user_profiles_avatar_url ON user_profiles(avatar_url);

