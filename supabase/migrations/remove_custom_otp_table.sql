-- Remove custom OTP verification table since we're now using Supabase's built-in OTP
-- This migration removes the custom otp_verification table

-- Drop the custom OTP verification table
DROP TABLE IF EXISTS otp_verification CASCADE;

-- Note: Supabase's built-in OTP functionality handles email verification
-- without requiring a custom database table
