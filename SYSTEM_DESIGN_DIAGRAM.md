# ADFY Learning App - System Design Diagram

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    FRONTEND LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   React 19.1    │  │   TypeScript    │  │   Vite 6.3      │  │  TailwindCSS    │ │
│  │                 │  │                 │  │                 │  │     3.4.1       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 APPLICATION LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                              MAIN APP COMPONENT                                │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │ │
│  │  │   SplashScreen  │  │  WelcomePages   │  │   Onboarding    │  │   Dashboard │ │ │
│  │  │                 │  │                 │  │                 │  │             │ │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │ │
│  │                                                                                 │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │ │
│  │  │ Storytelling    │  │ VocabularyQuiz  │  │ InterviewPrep   │  │   Settings  │ │ │
│  │  │   Activity      │  │                 │  │                 │  │             │ │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │ │
│  │                                                                                 │ │
│  │  ┌─────────────────┐  ┌─────────────────┐                                      │ │
│  │  │ VoiceConversation│  │Pronunciation   │                                      │ │
│  │  │                 │  │  Practice       │                                      │ │
│  │  └─────────────────┘  └─────────────────┘                                      │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 CONTEXT LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                            AUTH CONTEXT (AuthContext.tsx)                      │ │
│  │                                                                                 │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │ │
│  │  │   User State    │  │  Session State  │  │ User Profile    │                │ │
│  │  │                 │  │                 │  │                 │                │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘                │ │
│  │                                                                                 │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │ │
│  │  │   signUp()      │  │   signIn()      │  │   signOut()     │                │ │
│  │  │                 │  │                 │  │                 │                │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘                │ │
│  │                                                                                 │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │ │
│  │  │updateUserProfile│  │refreshUserProfile│  │runDiagnostics  │                │ │
│  │  │                 │  │                 │  │                 │                │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘                │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                  API LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                              SUPABASE API                                      │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │ │
│  │  │ Authentication  │  │   User Profiles │  │  Database       │                │ │
│  │  │                 │  │                 │  │  Operations     │                │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘                │ │
│  │                                                                                 │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │ │
│  │  │storeUserOnboarding│ │getUserProfile  │  │testConnection   │                │ │
│  │  │                 │  │                 │  │                 │                │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘                │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                              GEMINI AI API                                     │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │ │
│  │  │ Story Analysis  │  │ Voice Response  │  │ Random Words    │                │ │
│  │  │                 │  │                 │  │                 │                │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘                │ │
│  │                                                                                 │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │ │
│  │  │Audio Processing │  │ Topic Generation│  │ Example         │                │ │
│  │  │                 │  │                 │  │ Generation      │                │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘                │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                            ELEVENLABS API                                      │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        Text-to-Speech Conversion                           │ │ │
│  │  │                                                                             │ │ │
│  │  │  Voice ID: 69nXRvRvFpjSXhH7IM5l                                           │ │ │
│  │  │  Settings: stability: 0.5, similarity_boost: 0.75                         │ │ │
│  │  └─────────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────┘
│                                 EXTERNAL SERVICES                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Supabase      │  │   Google Gemini │  │  ElevenLabs     │  │   Vercel        │ │
│  │   (Database +   │  │   (AI/LLM)      │  │  (TTS)          │  │   (Deployment) │ │
│  │    Auth)        │  │                 │  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘

## 🔄 Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │───▶│  React State    │───▶│   API Calls     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Updates    │◀───│  Context State  │◀───│  External APIs  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🗄️ Database Schema (Supabase)

### User Profiles Table
```sql
user_profiles {
  user_id: UUID (Primary Key, references auth.users)
  name: TEXT
  email: TEXT
  job_title: TEXT
  company: TEXT
  field: TEXT
  experience_level: TEXT
  vocabulary_level: TEXT
  communication_confidence: TEXT
  communication_challenges: TEXT
  improvement_goals: TEXT
  current_skill_level: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

## 🔐 Authentication Flow

```
1. User Registration
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Sign Up   │───▶│  Supabase   │───▶│ Email Sent  │
   │             │    │   Auth      │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘

2. Email Verification
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │ Email Link  │───▶│ Auth Code   │───▶│  Session    │
   │   Clicked   │    │ Exchange    │    │  Created    │
   └─────────────┘    └─────────────┘    └─────────────┘

3. User Login
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Sign In   │───▶│  Supabase   │───▶│ Dashboard   │
   │             │    │   Auth      │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘
```

## 🎯 Core Features & Components

### 1. Learning Activities
- **Storytelling Activity**: AI-powered story analysis using Gemini
- **Vocabulary Quiz**: Interactive word learning
- **Interview Prep**: Professional communication practice
- **Voice Conversation**: Real-time voice interaction with AI
- **Pronunciation Practice**: Speech improvement exercises

### 2. AI Integration
- **Gemini 2.0 Flash**: Story analysis, voice response generation, topic generation
- **ElevenLabs**: High-quality text-to-speech conversion
- **Real-time Processing**: Audio transcription and AI feedback

### 3. User Experience
- **Progressive Onboarding**: Multi-step user setup
- **Adaptive Learning**: Personalized content based on user profile
- **Progress Tracking**: Activity completion monitoring
- **Responsive Design**: Mobile-first approach with TailwindCSS

## 🛠️ Technical Stack

### Frontend
- **React 19.1**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Vite 6.3**: Fast build tool and dev server
- **TailwindCSS 3.4.1**: Utility-first CSS framework

### Backend & Services
- **Supabase**: Database, authentication, and real-time features
- **Google Gemini AI**: Advanced language model integration
- **ElevenLabs**: Professional text-to-speech
- **Vercel**: Deployment and hosting

### State Management
- **React Context**: Centralized auth state management
- **Local State**: Component-level state management
- **Supabase Real-time**: Database synchronization

## 🔧 Development & Deployment

### Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
VITE_VERCEL_URL=your_vercel_url (auto)
VITE_SITE_URL=your_custom_domain (optional)
```

### Build & Deploy
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run supabase:types # Generate TypeScript types
```

## 📱 Component Architecture

### Core Components
- **App.tsx**: Main application orchestrator
- **AuthContext.tsx**: Authentication state management
- **Navigation.tsx**: Main navigation component
- **Dashboard.tsx**: Central activity hub

### Feature Components
- **StorytellingActivity.tsx**: Story creation and AI analysis
- **VoiceConversation.tsx**: Real-time voice interaction
- **VocabularyQuiz.tsx**: Interactive word learning
- **InterviewPrep.tsx**: Professional communication practice

### UI Components
- **Header.tsx**: Activity-specific headers
- **Settings.tsx**: User preferences and profile management
- **Onboarding.tsx**: User setup flow
- **SplashScreen.tsx**: App initialization

## 🔄 State Management Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Action   │───▶│  Component      │───▶│  Context        │
│                 │    │   State         │    │   Update        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Re-render  │◀───│  Context        │◀───│  API Response   │
│                 │    │   State         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Performance Optimizations

1. **Code Splitting**: Dynamic imports for API modules
2. **Lazy Loading**: Component-level lazy loading
3. **Optimized Builds**: Vite-based fast builds
4. **Efficient State**: Minimal re-renders with Context
5. **API Caching**: Intelligent API response handling

## 🔒 Security Features

1. **Supabase Auth**: Secure authentication with JWT tokens
2. **Environment Variables**: Secure API key management
3. **CORS Protection**: Proper origin validation
4. **Input Validation**: Type-safe data handling
5. **Session Management**: Secure session handling

## 📊 Monitoring & Debugging

1. **Console Logging**: Comprehensive debug logging
2. **Error Boundaries**: Graceful error handling
3. **Diagnostics**: Built-in Supabase connection testing
4. **Performance Monitoring**: React DevTools integration
5. **API Health Checks**: Connection status monitoring

---

*This diagram represents the current system architecture of the ADFY Learning App as of the latest codebase analysis. The system is designed with scalability, maintainability, and user experience as core principles.*
