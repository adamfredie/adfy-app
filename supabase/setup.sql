-- Setup for WordBank functionality
-- This creates the minimal tables needed for users to see words they've learned

-- Table to track user's vocabulary progress (words they've learned)
CREATE TABLE IF NOT EXISTS vocabulary_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word VARCHAR(255) NOT NULL,
  field_category VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure each user can only learn a word once
  UNIQUE(user_id, word)
);

-- Table to store word definitions and details
CREATE TABLE IF NOT EXISTS word_bank (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(100) NOT NULL DEFAULT 'noun',
  difficulty VARCHAR(50) NOT NULL DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  definition TEXT NOT NULL,
  field_category VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vocabulary_progress_user_id ON vocabulary_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_progress_field ON vocabulary_progress(field_category);
CREATE INDEX IF NOT EXISTS idx_word_bank_word ON word_bank(word);
CREATE INDEX IF NOT EXISTS idx_word_bank_field ON word_bank(field_category);

-- Enable Row Level Security
ALTER TABLE vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_bank ENABLE ROW LEVEL SECURITY;

-- Policies for vocabulary_progress (users can only see their own progress)
CREATE POLICY "Users can view their own vocabulary progress" ON vocabulary_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vocabulary progress" ON vocabulary_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for word_bank (all authenticated users can read and insert)
CREATE POLICY "Authenticated users can read word bank" ON word_bank
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert word bank" ON word_bank
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT, INSERT ON vocabulary_progress TO authenticated;
GRANT SELECT, INSERT ON word_bank TO authenticated;

-- Note: OTP verification now handled by Supabase's built-in signInWithOtp functionality
-- No custom OTP table needed