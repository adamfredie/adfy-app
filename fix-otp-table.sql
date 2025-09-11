-- Fix OTP verification table
-- Run this in your Supabase SQL editor to ensure the table is properly set up

-- Drop the table if it exists (to recreate it properly)
DROP TABLE IF EXISTS otp_verification CASCADE;

-- Create the OTP verification table with all required columns
CREATE TABLE otp_verification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX idx_otp_verification_email ON otp_verification(email);
CREATE INDEX idx_otp_verification_expires ON otp_verification(expires_at);

-- Enable Row Level Security
ALTER TABLE otp_verification ENABLE ROW LEVEL SECURITY;

-- Policies for OTP verification
CREATE POLICY "Users can insert OTP for any email" ON otp_verification
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can verify OTP for any email" ON otp_verification
  FOR UPDATE USING (true);

CREATE POLICY "Users can select OTP for verification" ON otp_verification
  FOR SELECT USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON otp_verification TO authenticated;
