# Technical Specification - Aduffy Learning Platform

## 🏗️ System Architecture

### Frontend Architecture
```
┌─────────────────────────────────────────┐
│                App.tsx                  │
│         (Main Application)              │
├─────────────────────────────────────────┤
│  State Management & Routing Layer       │
│  - Activity routing                     │
│  - User profile management              │
│  - Progress persistence                 │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│            Component Layer              │
│  ┌─────────────┬─────────────────────┐  │
│  │  Dashboard  │  StorytellingActivity│  │
│  │  Onboarding │  Settings           │  │
│  │  Header     │  Other Activities   │  │
│  └─────────────┴─────────────────────┘  │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│          Service Layer                  │
│  ┌─────────────┬─────────────────────┐  │
│  │ Voice API   │  Local Storage      │  │
│  │ Integration │  Management         │  │
│  └─────────────┴─────────────────────┘  │
└─────────────────────────────────────────┘
```

### Technology Stack

#### Core Framework
- **React 18.2+**: Modern React with concurrent features
- **TypeScript 5.0+**: Type-safe development
- **Vite**: Fast build tool and development server

#### Styling & UI
- **Tailwind CSS v4**: Utility-first CSS framework with custom theme
- **ShadCN UI**: Pre-built component library
- **Lucide React**: Modern icon library
- **Custom ADuffy Theme**: Brand-specific color palette and components

#### Browser APIs
- **Web Speech API**: Speech recognition and synthesis
- **Local Storage API**: Data persistence
- **Audio API**: Voice playback and recording

## 📊 Data Architecture

### User Profile Structure
```typescript
interface OnboardingData {
  // Personal Information
  name: string;
  email: string;
  
  // Communication Assessment
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryGoals: string[];
  challengeAreas: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  
  // Professional Context
  field: 'marketing' | 'technology' | 'sales' | 'product' | 'finance' | 'operations';
  experience: string;
  industry: string;
  
  // Settings
  dailyGoal: number;
  reminderTime: string;
  voiceEnabled: boolean;
}
```

### Activity Progress Structure
```typescript
interface ActivityProgress {
  storytelling?: {
    currentStep: number;              // 1-5 (words, learning, writing, voice, results)
    selectedField: string;            // Professional field for vocabulary
    vocabularyWords?: DailyWord[];    // Generated vocabulary set
    quizAnswers?: QuestionResult[];   // Learning assessment results
    userStory?: string;               // User-created story
    isCompleted?: boolean;            // Activity completion status
  };
  // Future activities will extend this interface
}
```

### Vocabulary Word Structure
```typescript
interface DailyWord {
  word: string;                       // The vocabulary word
  definition: string;                 // Professional definition
  partOfSpeech: string;              // Grammar classification
  example: string;                   // Business context example
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
```

## 🔄 State Management

### Application State Flow
```
User Action → Component State → Local State Update → Persistence Layer
                      ↓
           Side Effects (Voice, API calls)
                      ↓
              UI State Updates
```

### Key State Patterns

#### 1. Activity Navigation State
```typescript
type ActivityType = 'dashboard' | 'storytelling' | 'quiz' | 'interview' | 
                   'voice-conversation' | 'pronunciation' | 'settings';

const [currentActivity, setCurrentActivity] = useState<ActivityType>('dashboard');
```

#### 2. Progress Persistence Pattern
```typescript
const handleActivityProgressUpdate = useCallback((
  activityType: keyof ActivityProgress, 
  progress: any
) => {
  setActivityProgress(prev => {
    const updatedProgress = { ...prev, [activityType]: progress };
    localStorage.setItem('aduffy-activity-progress', JSON.stringify(updatedProgress));
    return updatedProgress;
  });
}, []);
```

#### 3. User Profile Management
```typescript
const handleProfileUpdate = useCallback((updatedProfile: OnboardingData) => {
  localStorage.setItem('aduffy-user-profile', JSON.stringify(updatedProfile));
  setUserProfile(updatedProfile);
}, []);
```

## 🎙️ Voice Integration Architecture

### useVoiceInteraction Hook
```typescript
interface VoiceInteractionState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  isSpeaking: boolean;
  permissionStatus: PermissionState;
}

const useVoiceInteraction = () => {
  // Speech Recognition Setup
  // Speech Synthesis Setup  
  // Permission Management
  // Error Handling
}
```

### Voice API Integration Flow
```
User Initiates Voice → Permission Check → API Availability Check
                                  ↓
                          Start Recognition/Synthesis
                                  ↓
                          Handle Results/Errors
                                  ↓
                          Update Component State
```

### Browser Compatibility Matrix
| Feature | Chrome | Safari | Edge | Firefox |
|---------|--------|--------|------|---------|
| Speech Recognition | ✅ Full | ✅ Full | ✅ Full | ⚠️ Limited |
| Speech Synthesis | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Microphone Access | ✅ Full | ✅ Full | ✅ Full | ✅ Full |

## 🎨 Design System Architecture

### Tailwind v4 Custom Theme
```css
:root {
  /* ADuffy Learning Brand Colors */
  --aduffy-yellow: #f9a825;
  --aduffy-navy: #1a1a1a;
  --aduffy-teal: #17a2b8;
  --aduffy-orange: #fd7e14;
}

@theme inline {
  --color-aduffy-yellow: var(--aduffy-yellow);
  --color-aduffy-navy: var(--aduffy-navy);
  /* Additional theme variables */
}
```

### Component Design Patterns

#### 1. Card-Based Layout System
```typescript
const ActivityCard = ({ children, hover = true, gradient = false }) => (
  <div className={`aduffy-card ${hover ? 'hover:transform hover:scale-105' : ''}`}>
    {children}
  </div>
);
```

#### 2. Progress Indication Pattern
```typescript
const ProgressHeader = ({ currentStep, totalSteps, activity }) => (
  <div className="space-y-4">
    <Badge className="aduffy-badge-primary">
      Step {currentStep} of {totalSteps}
    </Badge>
    <Progress value={(currentStep / totalSteps) * 100} />
  </div>
);
```

#### 3. Status Badge System
```css
.aduffy-badge-success { @apply bg-success/10 text-success; }
.aduffy-badge-warning { @apply bg-warning/10 text-warning-foreground; }
.aduffy-badge-info { @apply bg-info/10 text-info; }
.aduffy-badge-primary { @apply bg-aduffy-yellow/20 text-aduffy-navy; }
```

## 📱 Component Architecture

### StorytellingActivity Component Flow
```
┌─────────────────────────────────────────┐
│        StorytellingActivity             │
├─────────────────────────────────────────┤
│  Step Management:                       │
│  - words → learning → writing →         │
│    voice → results                      │
│                                         │
│  State Management:                      │
│  - currentStep (StepType)               │
│  - furthestStep (progress tracking)     │
│  - completedSteps (Set<StepType>)       │
│  - isViewOnly (computed)                │
│                                         │
│  Progress Features:                     │
│  - Auto-save on step completion         │
│  - Resume from last position            │
│  - View-only mode for completed steps   │
│  - Backward navigation with restrictions │
└─────────────────────────────────────────┘
```

### Step Navigation Logic
```typescript
const isViewOnly = useMemo(() => {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const furthestIndex = STEP_ORDER.indexOf(furthestStep);
  return currentIndex < furthestIndex && completedSteps.has(currentStep);
}, [currentStep, furthestStep, completedSteps]);
```

## 🔐 Data Persistence Strategy

### Local Storage Structure
```
localStorage:
├── 'aduffy-onboarding-completed': boolean
├── 'aduffy-user-profile': OnboardingData
└── 'aduffy-activity-progress': ActivityProgress
```

### Data Persistence Patterns

#### 1. Onboarding Completion
```typescript
localStorage.setItem('aduffy-onboarding-completed', 'true');
localStorage.setItem('aduffy-user-profile', JSON.stringify(data));
```

#### 2. Activity Progress Auto-Save
```typescript
const updateProgress = useCallback(() => {
  if (!onProgressUpdate || dailyWords.length === 0) return;
  
  const progressKey = JSON.stringify(currentProgress);
  if (progressKey === lastProgressUpdateRef.current) return;
  
  lastProgressUpdateRef.current = progressKey;
  onProgressUpdate(currentProgress);
}, [onProgressUpdate, currentProgress, dailyWords.length]);
```

#### 3. Settings Persistence
```typescript
const handleSettingsUpdate = (newSettings: Settings) => {
  localStorage.setItem('aduffy-settings', JSON.stringify(newSettings));
  setSettings(newSettings);
};
```

## ⚡ Performance Considerations

### Optimization Strategies

#### 1. Component Memoization
```typescript
const currentProgress = useMemo(() => ({
  currentStep: STEP_ORDER.indexOf(currentStep) + 1,
  selectedField,
  vocabularyWords: dailyWords,
  quizAnswers: questionResults,
  userStory: userStory,
  isCompleted: currentStep === 'results'
}), [currentStep, selectedField, dailyWords, questionResults, userStory]);
```

#### 2. Callback Optimization
```typescript
const updateProgress = useCallback(() => {
  // Debounced progress updates to prevent excessive localStorage writes
}, [onProgressUpdate, currentProgress, dailyWords.length]);
```

#### 3. Voice API Resource Management
```typescript
useEffect(() => {
  return () => {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  };
}, []);
```

## 🛡️ Error Handling Strategy

### Voice API Error Handling
```typescript
const safeSpeak = useCallback((text: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech error: ${event.error}`));
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
}, []);
```

### Storage Error Handling
```typescript
const safeLocalStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('Local storage error:', error);
    // Fallback to memory storage or user notification
  }
};
```

## 📋 API Specifications

### Future API Integration Points
```typescript
// Placeholder for future backend integration
interface APIEndpoints {
  '/api/vocabulary/generate': {
    method: 'POST';
    body: { field: string; level: string; count: number };
    response: DailyWord[];
  };
  
  '/api/story/analyze': {
    method: 'POST';
    body: { story: string; vocabulary: string[] };
    response: StoryAnalysis;
  };
  
  '/api/conversation/generate': {
    method: 'POST';
    body: { context: string; previousMessages: Message[] };
    response: AIResponse;
  };
}
```

## 🧪 Testing Strategy

### Component Testing Approach
- Unit tests for individual components
- Integration tests for activity flows
- Voice API mocking for consistent testing
- Local storage mocking for state persistence tests

### Performance Testing
- Bundle size analysis
- Component render performance
- Voice API response time measurement
- Local storage performance impact

---

*Technical Specification Version: 1.0.0*
*Last Updated: December 2024*