# Word Bank Table Integration

This document explains how the `word_bank` table is now integrated with the vocabulary learning system.

## Overview

The `word_bank` table now stores vocabulary words with their definitions, parts of speech, difficulty levels, and field categories. This provides a centralized repository of vocabulary that can be referenced across the application.

## How It Works

### Automatic Word Storage
When a user completes the storytelling activity:

1. **Words are automatically saved** to both tables:
   - `word_bank`: Stores the word definitions and metadata
   - `vocabulary_progress`: Tracks user learning progress

2. **Duplicate prevention**: The system checks if words already exist in `word_bank` before inserting

3. **Field categorization**: Words are tagged with their professional field for better organization

### Data Flow
```
User completes activity → calculateFinalScore() → saveVocabularyWords() → 
├── saveWordsToWordBank() → word_bank table
└── vocabulary_progress table
```

## New Functions Added

### 1. `saveWordsToWordBank(words, field)`
- **Purpose**: Saves vocabulary words to the `word_bank` table
- **Parameters**: 
  - `words`: Array of `DailyWord` objects
  - `field`: Professional field category (e.g., 'marketing', 'technology')
- **Behavior**: Only inserts new words, skips existing ones
- **Returns**: Array of inserted word records

### 2. `getWordBankWordsByField(field)`
- **Purpose**: Retrieves words from `word_bank` by field category
- **Parameters**: `field` - The professional field to filter by
- **Returns**: Array of `WordBankWord` objects for the specified field

## Modified Functions

- **`saveVocabularyWords()`** - Now automatically saves to both tables:
  - First saves to `word_bank` (word definitions)
  - Then saves to `vocabulary_progress` (user progress)

## Database Structure

The `word_bank` table has the following structure:
```sql
CREATE TABLE word_bank (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(100) NOT NULL DEFAULT 'noun',
  difficulty VARCHAR(50) NOT NULL DEFAULT 'intermediate' 
    CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  definition TEXT NOT NULL,
  field_category VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Database Policies

The `word_bank` table has the following Row Level Security policies:

- **SELECT**: All authenticated users can read
- **INSERT**: All authenticated users can insert new words
- **No UPDATE/DELETE**: Words are read-only once inserted

## Benefits

1. **Centralized Vocabulary**: All vocabulary words are stored in one place
2. **Eliminates Duplicates**: Prevents storing the same word multiple times
3. **Better Organization**: Words are categorized by professional field
4. **Improved Performance**: Faster word lookups and filtering
5. **Data Consistency**: Ensures all users see the same word definitions

## Usage Example

```typescript
import { saveVocabularyWords } from '../src/api/supabase';

// This now automatically saves to both tables
await saveVocabularyWords(userId, dailyWords, selectedField);
```

## Migration Notes

- Existing functionality remains unchanged
- The `vocabulary_progress` table continues to work as before
- New words will automatically populate both tables
- The system gracefully handles existing data
