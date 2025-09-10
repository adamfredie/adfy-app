-- Add attempts column to otp_verification table if it doesn't exist
-- This migration ensures the attempts column exists for tracking failed OTP attempts

-- Check if the attempts column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'otp_verification' 
        AND column_name = 'attempts'
    ) THEN
        ALTER TABLE otp_verification ADD COLUMN attempts INTEGER DEFAULT 0;
        RAISE NOTICE 'Added attempts column to otp_verification table';
    ELSE
        RAISE NOTICE 'attempts column already exists in otp_verification table';
    END IF;
END $$;
