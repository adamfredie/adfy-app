# WordBank - User Learning Progress

## Overview

The WordBank component now shows **only words that users have learned from their activities**, not generic sample data. This creates a personalized learning experience where users see their actual progress.

## How It Works

### 1. **Data Flow**
```
User completes Activity (Storytelling, Quiz, etc.)
    ↓
Words are saved to vocabulary_progress table
    ↓
WordBank fetches user's learned words
    ↓
Gets word details from word_bank table
    ↓
Displays personalized word list
```

### 2. **Database Tables**

#### **`vocabulary_progress`** - User Learning Progress
- `user_id`: Which user learned the word
- `word`: The vocabulary term they learned
- `field_category`: Professional field (business, tech, healthcare)
- `created_at`: When they learned it

#### **`word_bank`** - Word Definitions
- `word`: Vocabulary term
- `type`: Part of speech (noun, verb, etc.)
- `difficulty`: Beginner/intermediate/advanced
- `definition`: What the word means
- `field_category`: Professional field

## Setup

### 1. **Run the SQL Setup**
Execute `supabase/setup.sql` in your Supabase SQL editor to create the required tables.

### 2. **Add Words to word_bank**
Insert word definitions into the `word_bank` table:

```sql
INSERT INTO word_bank (word, type, difficulty, definition, field_category) VALUES
('Innovation', 'noun', 'intermediate', 'A new method, idea, or product', 'business'),
('Algorithm', 'noun', 'intermediate', 'A set of rules to solve a problem', 'technology'),
('Diagnosis', 'noun', 'intermediate', 'Identification of an illness', 'healthcare');
```

### 3. **Save User Progress**
When users complete activities, save their learned words:

```typescript
import { saveVocabularyWords } from '../src/api/supabase';

// After user completes an activity
await saveVocabularyWords(userId, wordsLearned, userField);
```

## Features

✅ **Personalized**: Shows only words the user has learned
✅ **Field-Specific**: Filters by user's professional field
✅ **Learning Dates**: Shows when each word was learned
✅ **Instant Search**: Fast client-side filtering for responsive UX
✅ **Responsive**: Works on all devices

## What Users See

- **Word**: The vocabulary term
- **Type**: Part of speech
- **Difficulty**: Beginner/intermediate/advanced
- **Definition**: What the word means
- **Learning Date**: When they learned it
- **Field**: Their professional domain

## Benefits

1. **Motivation**: Users see their learning progress
2. **Relevance**: Words match their profession
3. **Tracking**: Know which words they've mastered
4. **Growth**: Vocabulary expands with activities

## Example User Journey

1. **User completes storytelling activity** → Learns 5 business words
2. **User takes vocabulary quiz** → Learns 3 more business words
3. **User visits WordBank** → Sees all 8 words they've learned
4. **Words are filtered by field** → Only shows business-related words

## Technical Implementation

### **Why Client-Side Filtering?**
- **Instant results** - No network delay for search
- **Better UX** - Users see results immediately as they type
- **Simpler code** - Less state management, no loading states
- **More efficient** - No unnecessary API calls
- **Perfect for personal vocabularies** - Users typically have 10-100 words

### **Performance Benefits**
- Single data fetch on component mount
- Instant search filtering
- No server load during search
- Better offline experience

The WordBank is now a **personal learning portfolio** that grows with the user's activities! 🎯
