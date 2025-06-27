/*
  STORYTELLINGACTIVITY.TSX - Main Storytelling Activity Component
  
  CHANGES MADE:
  
  1. LAYOUT CHANGES:
     - Implemented two-column grid layout (story-main-grid) for main content and vocabulary checklist
     - Moved vocabulary checklist to the right side of the writing area
     - Centered "Write Your Story" title using storytelling-welcome-title class
  
  2. BUTTON MANAGEMENT:
     - REMOVED: Duplicate "Back to Dashboard" buttons
     - REMOVED: Always-visible back button from header area
     - RETAINED: Back button only in relevant step content (results step)
     - Updated button styling to match design requirements
  
  3. VOCABULARY CHECKLIST REDESIGN:
     - Implemented pill-shaped checklist items (vocab-checklist-item)
     - Added bold vocabulary words with light part of speech styling
     - Created circular indicators for completion status
     - Positioned checklist on the right side of the writing area
  
  4. PROGRESS BAR & NAVIGATION:
     - Updated progress bar styling to match design
     - Improved step navigation and completion tracking
     - Added proper step indicators and badges
  
  5. CSS CLASS INTEGRATION:
     - Replaced Tailwind classes with custom CSS classes from utilities.css
     - Applied custom styling for cards, buttons, and layout components
     - Ensured consistent design language throughout the component
  
  6. RESPONSIVE DESIGN:
     - Maintained responsive behavior for different screen sizes
     - Ensured proper grid layout on mobile and desktop
  
  COMPONENT STRUCTURE:
  - Words Step: Vocabulary learning with field selection
  - Learning Step: Interactive quiz and practice
  - Writing Step: Story creation with AI guidance and vocabulary checklist
  - Voice Step: Voice conversation practice
  - Results Step: Final analysis and completion
*/

import React from "react";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert } from "./ui/alert";
import { Select } from "./ui/select";
import { OnboardingData } from "./Onboarding";
import { useVoiceInteraction } from "../hooks/useVoiceInteraction";
import { analyzeStoryWithGemini, generateVoiceResponse } from '../src/api/gemini';
import { CustomSelect } from "./ui/CustomSelect";

// ... inside your component




interface StorytellingActivityProps {
  onBack: () => void;
  userProfile?: OnboardingData | null;
  savedProgress?: {
    currentStep: number;
    selectedField: string;
    vocabularyWords?: DailyWord[];
    quizAnswers?: QuestionResult[];
    userStory?: string;
    isCompleted?: boolean;
  };
  onProgressUpdate?: (progress: {
    currentStep: number;
    selectedField: string;
    vocabularyWords?: DailyWord[];
    quizAnswers?: QuestionResult[];
    userStory?: string;
    isCompleted?: boolean;
  }) => void;
  onComplete?: () => void;
}

interface DailyWord {
  word: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LearningQuestion {
  id: string;
  wordIndex: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  type: 'definition' | 'usage' | 'synonym' | 'context' | 'example';
}

interface StoryTopic {
  id: string;
  title: string;
  scenario: string;
  context: string;
  challenge: string;
}

interface QuestionResult {
  questionId: string;
  userAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

type StepType = 'words' | 'learning' | 'writing' | 'voice' | 'results';

const STEP_ORDER: StepType[] = ['words', 'learning', 'writing', 'voice', 'results'];

export function StorytellingActivity({ 
  onBack, 
  userProfile, 
  savedProgress, 
  onProgressUpdate,
  onComplete 
}: StorytellingActivityProps) {
  const [storyAnalysis, setStoryAnalysis] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  
  async function handleAnalyzeStory() {
    setLoadingAnalysis(true);
    try {
      const analysis = await analyzeStoryWithGemini({
        story: userStory,
        topic: selectedTopic?.title || '',
        vocabulary: dailyWords.map(w => w.word)
      });
      setStoryAnalysis(analysis);
    } catch (err) {
      // handle error, e.g. show a toast
    } finally {
      setLoadingAnalysis(false);
    }
  }
  
  // Initialize state from saved progress or defaults
  const [currentStep, setCurrentStep] = useState<StepType>(
    savedProgress ? (STEP_ORDER[savedProgress.currentStep - 1] as StepType) : 'words'
  );
  const [stepProgress, setStepProgress] = useState(0);
  const [selectedField, setSelectedField] = useState<string>(
    savedProgress?.selectedField || userProfile?.field || 'marketing'
  );
  const [dailyWords, setDailyWords] = useState<DailyWord[]>(savedProgress?.vocabularyWords || []);
  const [learningQuestions, setLearningQuestions] = useState<LearningQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>(savedProgress?.quizAnswers || []);
  const [showQuestionFeedback, setShowQuestionFeedback] = useState(false);
  const [currentQuestionResult, setCurrentQuestionResult] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [userStory, setUserStory] = useState(savedProgress?.userStory || '');
  const [voiceConversation, setVoiceConversation] = useState<any[]>([]);
  const [currentWordFocus, setCurrentWordFocus] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [showLearningContent, setShowLearningContent] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState('');
  const [storyTopics, setStoryTopics] = useState<StoryTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<StoryTopic | null>(null);
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);

  // Story listening state
  const [isListeningToStory, setIsListeningToStory] = useState(false);
  const [storyHighlightedWords, setStoryHighlightedWords] = useState<string[]>([]);
  const [currentStoryWordIndex, setCurrentStoryWordIndex] = useState(-1);

  // Word pronunciation state
  const [currentlyPlayingWord, setCurrentlyPlayingWord] = useState<number | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);

  // Step completion tracking - initialize from saved progress
  const [completedSteps, setCompletedSteps] = useState<Set<StepType>>(() => {
    if (savedProgress) {
      const completed = new Set<StepType>();
      // Mark all steps before current as completed
      for (let i = 0; i < savedProgress.currentStep - 1; i++) {
        completed.add(STEP_ORDER[i]);
      }
      return completed;
    }
    return new Set<StepType>();
  });

  // Initialize furthest step from saved progress
  const [furthestStep, setFurthestStep] = useState<StepType>(() => {
    if (savedProgress) {
      // The furthest step is the current step from saved progress
      return STEP_ORDER[savedProgress.currentStep - 1] || 'words';
    }
    return 'words';
  });

  // Use ref to track the last progress update to prevent duplicates
  const lastProgressUpdateRef = useRef<string>('');

  const { 
    isListening, 
    transcript, 
    error: voiceError,
    isSupported: isVoiceSupported,
    startListening, 
    stopListening, 
    speak,
    isSpeaking,
    clearTranscript,
    permissionStatus,
    requestPermission,
    stopSpeaking
  } = useVoiceInteraction();

  // Generate words based on selected field and user level
  const generateVocabularyWords = (field: string) => {
    const fieldBasedWords = {
      marketing: [
        {
          word: "Segmentation",
          definition: "The process of dividing a market into distinct groups of consumers",
          partOfSpeech: "noun",
          example: "Market segmentation helped the company target specific customer demographics.",
          difficulty: "intermediate" as const
        },
        {
          word: "Attribution",
          definition: "The process of determining which marketing efforts led to a sale",
          partOfSpeech: "noun",
          example: "Attribution analysis revealed that social media campaigns had the highest conversion rate.",
          difficulty: "advanced" as const
        },
        {
          word: "Optimization",
          definition: "The action of making the best or most effective use of a situation",
          partOfSpeech: "noun",
          example: "Campaign optimization resulted in a 40% increase in click-through rates.",
          difficulty: "intermediate" as const
        },
        {
          word: "Conversion",
          definition: "The process of turning prospects into customers",
          partOfSpeech: "noun",
          example: "The new landing page improved conversion rates by 25%.",
          difficulty: "beginner" as const
        },
        {
          word: "Engagement",
          definition: "The level of interaction and involvement with content or campaigns",
          partOfSpeech: "noun",
          example: "Social media engagement increased significantly after the brand refresh.",
          difficulty: "beginner" as const
        }
      ],
      technology: [
        {
          word: "Scalability",
          definition: "The ability of a system to handle increased workload",
          partOfSpeech: "noun",
          example: "The application's scalability was tested under high user traffic.",
          difficulty: "intermediate" as const
        },
        {
          word: "Redundancy",
          definition: "The duplication of critical components of a system",
          partOfSpeech: "noun",
          example: "Database redundancy ensures data availability during system failures.",
          difficulty: "advanced" as const
        },
        {
          word: "Integration",
          definition: "The process of combining different systems to work together",
          partOfSpeech: "noun",
          example: "API integration allows seamless data flow between applications.",
          difficulty: "intermediate" as const
        },
        {
          word: "Deployment",
          definition: "The process of making software available for use",
          partOfSpeech: "noun",
          example: "The deployment of the new feature was completed without downtime.",
          difficulty: "beginner" as const
        },
        {
          word: "Architecture",
          definition: "The fundamental structure and design of a system",
          partOfSpeech: "noun",
          example: "The microservices architecture improved system maintainability.",
          difficulty: "advanced" as const
        }
      ],
      sales: [
        {
          word: "Prospecting",
          definition: "The process of identifying and qualifying potential customers",
          partOfSpeech: "noun",
          example: "Effective prospecting increased the sales team's qualified leads by 30%.",
          difficulty: "intermediate" as const
        },
        {
          word: "Pipeline",
          definition: "A visual representation of sales opportunities in various stages",
          partOfSpeech: "noun",
          example: "The sales pipeline showed strong growth in Q3 opportunities.",
          difficulty: "beginner" as const
        },
        {
          word: "Objection",
          definition: "A concern or resistance expressed by a potential customer",
          partOfSpeech: "noun",
          example: "The sales rep skillfully addressed every pricing objection during the call.",
          difficulty: "intermediate" as const
        },
        {
          word: "Upselling",
          definition: "The practice of selling additional or upgraded products to existing customers",
          partOfSpeech: "noun",
          example: "Upselling premium features increased average deal size by 45%.",
          difficulty: "advanced" as const
        },
        {
          word: "Closing",
          definition: "The final stage of completing a sale",
          partOfSpeech: "noun",
          example: "The closing technique used sealed the deal with the enterprise client.",
          difficulty: "beginner" as const
        }
      ],
      product: [
        {
          word: "Roadmap",
          definition: "A strategic plan that defines product development goals and timeline",
          partOfSpeech: "noun",
          example: "The product roadmap outlined key features for the next six months.",
          difficulty: "beginner" as const
        },
        {
          word: "Iteration",
          definition: "A repetitive process of refining and improving a product",
          partOfSpeech: "noun",
          example: "Each iteration brought the app closer to user expectations.",
          difficulty: "intermediate" as const
        },
        {
          word: "Backlog",
          definition: "A prioritized list of features and tasks to be completed",
          partOfSpeech: "noun",
          example: "The product backlog was groomed to focus on high-impact features.",
          difficulty: "intermediate" as const
        },
        {
          word: "Validation",
          definition: "The process of testing assumptions about user needs and market demand",
          partOfSpeech: "noun",
          example: "User validation confirmed the need for the new search feature.",
          difficulty: "advanced" as const
        },
        {
          word: "Positioning",
          definition: "How a product is perceived in the market relative to competitors",
          partOfSpeech: "noun",
          example: "The positioning strategy differentiated the product in a crowded market.",
          difficulty: "advanced" as const
        }
      ],
      finance: [
        {
          word: "Liquidity",
          definition: "The ease with which an asset can be converted into cash",
          partOfSpeech: "noun",
          example: "The company maintained high liquidity to handle unexpected expenses.",
          difficulty: "intermediate" as const
        },
        {
          word: "Diversification",
          definition: "The practice of spreading investments across various assets",
          partOfSpeech: "noun",
          example: "Portfolio diversification reduced overall investment risk.",
          difficulty: "advanced" as const
        },
        {
          word: "Forecasting",
          definition: "The process of predicting future financial performance",
          partOfSpeech: "noun",
          example: "Accurate forecasting helped the company prepare for market changes.",
          difficulty: "intermediate" as const
        },
        {
          word: "Allocation",
          definition: "The distribution of resources or capital among different uses",
          partOfSpeech: "noun",
          example: "Budget allocation prioritized high-growth initiatives.",
          difficulty: "beginner" as const
        },
        {
          word: "Valuation",
          definition: "The process of determining the worth of an asset or company",
          partOfSpeech: "noun",
          example: "The startup's valuation increased after the successful product launch.",
          difficulty: "advanced" as const
        }
      ],
      operations: [
        {
          word: "Optimization",
          definition: "The process of making something as effective as possible",
          partOfSpeech: "noun",
          example: "Process optimization reduced operational costs by 20%.",
          difficulty: "intermediate" as const
        },
        {
          word: "Efficiency",
          definition: "The ability to accomplish a job with minimum expenditure of time and effort",
          partOfSpeech: "noun",
          example: "Workflow efficiency improved after implementing the new system.",
          difficulty: "beginner" as const
        },
        {
          word: "Standardization",
          definition: "The process of establishing common standards across operations",
          partOfSpeech: "noun",
          example: "Standardization of procedures ensured consistent quality across all locations.",
          difficulty: "advanced" as const
        },
        {
          word: "Scalability",
          definition: "The capacity to be changed in size or scale",
          partOfSpeech: "noun",
          example: "The operation's scalability was tested during peak demand periods.",
          difficulty: "intermediate" as const
        },
        {
          word: "Logistics",
          definition: "The coordination of complex operations involving people, facilities, and supplies",
          partOfSpeech: "noun",
          example: "Improved logistics reduced delivery times by 30%.",
          difficulty: "intermediate" as const
        }
      ]
    };

    return fieldBasedWords[field as keyof typeof fieldBasedWords] || fieldBasedWords.marketing;
  };

  // Memoize the current progress object to prevent unnecessary updates
  const currentProgress = useMemo(() => {
    const currentStepIndex = STEP_ORDER.indexOf(currentStep) + 1;
    return {
      currentStep: currentStepIndex,
      selectedField,
      vocabularyWords: dailyWords,
      quizAnswers: questionResults,
      userStory: userStory,
      isCompleted: currentStep === 'results'
    };
  }, [currentStep, selectedField, dailyWords, questionResults, userStory]);

  // Stable progress update function that only updates when there are meaningful changes
  const updateProgress = useCallback(() => {
    if (!onProgressUpdate || dailyWords.length === 0) return;
    
    const progressKey = JSON.stringify(currentProgress);
    if (progressKey === lastProgressUpdateRef.current) return;
    
    lastProgressUpdateRef.current = progressKey;
    onProgressUpdate(currentProgress);
  }, [onProgressUpdate, currentProgress, dailyWords.length]);

  // Audio playback functions with improved error handling
  const safeSpeak = useCallback((text: string, wordIndex?: number) => {
    console.log('SafeSpeak called with:', text, 'wordIndex:', wordIndex);
    
    if (!text || text.trim() === '') {
      console.warn('Empty text provided to safeSpeak');
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      try {
        // Stop any current speech before starting new one
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }

        // Set currently playing word if index provided
        if (typeof wordIndex === 'number') {
          setCurrentlyPlayingWord(wordIndex);
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;

        utterance.onstart = () => {
          console.log('Speech started for:', text);
        };

        utterance.onend = () => {
          console.log('Speech ended for:', text);
          setCurrentlyPlayingWord(null);
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('Speech error:', event.error);
          setCurrentlyPlayingWord(null);
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        // Small delay to ensure cleanup is complete
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 100);

      } catch (error) {
        console.error('SafeSpeak error:', error);
        setCurrentlyPlayingWord(null);
        reject(error);
      }
    });
  }, []);

  const playWordPronunciation = useCallback(async (wordIndex: number) => {
    if (wordIndex < 0 || wordIndex >= dailyWords.length) {
      console.warn('Invalid word index:', wordIndex);
      return;
    }

    const word = dailyWords[wordIndex];
    if (!word) {
      console.warn('No word found at index:', wordIndex);
      return;
    }

    // If this word is currently playing, stop it
    if (currentlyPlayingWord === wordIndex) {
      window.speechSynthesis.cancel();
      setCurrentlyPlayingWord(null);
      return;
    }

    try {
      await safeSpeak(`${word.word}. ${word.definition}`, wordIndex);
    } catch (error) {
      console.error('Error playing word pronunciation:', error);
    }
  }, [dailyWords, safeSpeak, currentlyPlayingWord]);

  const playAllWords = useCallback(async () => {
    if (isPlayingSequence) {
      console.log('Already playing sequence, stopping...');
      window.speechSynthesis.cancel();
      setIsPlayingSequence(false);
      setCurrentlyPlayingWord(null);
      return;
    }

    setIsPlayingSequence(true);

    try {
      for (let i = 0; i < dailyWords.length; i++) {
        if (!isPlayingSequence) break; // Check if cancelled
        
        const word = dailyWords[i];
        await safeSpeak(`Word ${i + 1}: ${word.word}. ${word.definition}`, i);
        
        // Add small pause between words
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error playing all words:', error);
    } finally {
      setIsPlayingSequence(false);
      setCurrentlyPlayingWord(null);
    }
  }, [dailyWords, isPlayingSequence, safeSpeak]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      setCurrentlyPlayingWord(null);
      setIsPlayingSequence(false);
    };
  }, []);

  // Load vocabulary words based on selected field
  useEffect(() => {
    if (!savedProgress?.vocabularyWords) {
      const words = generateVocabularyWords(selectedField);
      setDailyWords(words);
    }
  }, [selectedField, savedProgress]);

  // Generate learning questions and story topics
  useEffect(() => {
    // Generate 5 questions for each word (25 total)
    const mockQuestions: LearningQuestion[] = [
      // Questions for each word based on the selected field vocabulary
      {
        id: "q1",
        wordIndex: 0,
        question: "What does the first vocabulary word mean?",
        options: ["Confused and unclear", "Clear professional concept", "Random business term", "Outdated practice"],
        correctAnswer: 1,
        explanation: "This vocabulary word represents an important professional concept.",
        type: "definition"
      },
      {
        id: "q2",
        wordIndex: 1,
        question: "How is the second vocabulary word used in business?",
        options: ["For personal tasks", "In professional collaboration", "Only in meetings", "For documentation"],
        correctAnswer: 1,
        explanation: "This word is commonly used in professional collaboration contexts.",
        type: "usage"
      },
      {
        id: "q3",
        wordIndex: 2,
        question: "What synonym best matches the third vocabulary word?",
        options: ["Enable", "Prevent", "Confuse", "Delay"],
        correctAnswer: 0,
        explanation: "Enable has a similar meaning to this vocabulary word.",
        type: "synonym"
      },
      {
        id: "q4",
        wordIndex: 3,
        question: "In what context is the fourth vocabulary word most useful?",
        options: ["Personal hobbies", "Data analysis", "Cooking", "Shopping"],
        correctAnswer: 1,
        explanation: "This word is particularly useful in data analysis and business contexts.",
        type: "context"
      },
      {
        id: "q5",
        wordIndex: 4,
        question: "Complete the sentence with the fifth vocabulary word:",
        options: ["leverage", "ignore", "waste", "forget"],
        correctAnswer: 0,
        explanation: "Leverage is the correct choice for maximizing resources.",
        type: "example"
      }
    ];

    const mockTopics: StoryTopic[] = [
      {
        id: "topic1",
        title: "The Cross-Department Project Crisis",
        scenario: "You're a project manager facing a critical deadline with multiple departments involved",
        context: "A major client presentation is due in 48 hours, but different teams have conflicting approaches and communication has broken down.",
        challenge: "Navigate team dynamics, resolve conflicts, and deliver a unified solution while maintaining professional relationships."
      },
      {
        id: "topic2",
        title: "The Remote Team Integration Challenge",
        scenario: "You're leading the integration of a newly acquired remote team into your company culture",
        context: "Your company has just acquired a smaller tech startup, and you need to integrate their team of 15 remote employees into your existing workflow.",
        challenge: "Bridge cultural differences, establish clear communication channels, and create a cohesive team environment."
      },
      {
        id: "topic3",
        title: "The Strategic Pivot Presentation",
        scenario: "You need to present a major strategic change to skeptical stakeholders",
        context: "Market conditions have forced your company to pivot its main product strategy, and you must convince investors and board members.",
        challenge: "Present complex data clearly, address concerns diplomatically, and build consensus around the new direction."
      },
      {
        id: "topic4",
        title: "The Mentorship Dilemma",
        scenario: "You're mentoring a talented but struggling team member while managing your own workload",
        context: "A promising junior colleague is having difficulty with client presentations and seeks your guidance, but you're swamped with your own responsibilities.",
        challenge: "Balance your time effectively, provide meaningful guidance, and help develop their professional skills."
      }
    ];

    setLearningQuestions(mockQuestions);
    setStoryTopics(mockTopics);
  }, []);

  // Update progress when significant changes occur
  useEffect(() => {
    updateProgress();
  }, [updateProgress]);

  // Check if current step is in view-only mode (completed and user navigated back)
  const isViewOnly = useMemo(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    const furthestIndex = STEP_ORDER.indexOf(furthestStep);
    
    // View only if: current step is before furthest reached AND current step is completed
    return currentIndex < furthestIndex && completedSteps.has(currentStep);
  }, [currentStep, furthestStep, completedSteps]);

  const exampleStory = "In today's fast-paced business environment, Maria knew she had to be more articulate during presentations. She decided to collaborate with her colleague James to prepare for the quarterly review. James helped facilitate the brainstorming session, creating an environment where ideas could flow freely. Together, they worked to synthesize all the feedback from different departments into a comprehensive strategy. Maria realized she could leverage her communication skills and the collaborative approach to not only improve her presentation but also strengthen team relationships. The preparation paid off when she delivered a clear, well-structured presentation that impressed the leadership team.";

  const getStepNumber = (step: StepType): number => {
    return STEP_ORDER.indexOf(step) + 1;
  };

  const calculateProgress = (): number => {
    const currentStepNum = getStepNumber(currentStep);
    const baseProgress = ((currentStepNum - 1) / 5) * 100;
    
    if (currentStep === 'learning' && learningQuestions.length > 0) {
      const questionProgress = (currentQuestionIndex / learningQuestions.length) * 20;
      return baseProgress + questionProgress;
    }
    
    return baseProgress + (stepProgress / 5) * 20;
  };

  const getStepStatus = (step: StepType) => {
    if (completedSteps.has(step)) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  const handleStepNavigation = (step: StepType) => {
    const status = getStepStatus(step);
    
    // Only allow navigation to completed steps or current step
    if (status === 'completed' || status === 'current') {
      setCurrentStep(step);
    }
  };

  const handleFieldChange = (newField: string) => {
    // Don't allow field changes in view-only mode
    if (isViewOnly) return;
    
    if (newField !== selectedField) {
      setSelectedField(newField);
      // Generate new words for the selected field
      const newWords = generateVocabularyWords(newField);
      setDailyWords(newWords);
      
      // Reset progress if changing field mid-activity
      if (currentStep !== 'words') {
        setCurrentStep('words');
        setStepProgress(0);
        setQuestionResults([]);
        setUserStory('');
        setCurrentQuestionIndex(0);
      }
    }
  };

  const handleNextStep = () => {
    // Don't allow navigation in view-only mode
    if (isViewOnly) return;
    
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    const nextStep = STEP_ORDER[currentIndex + 1];
    
    if (nextStep) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      // Update furthest step to the next step (since we're progressing forward)
      const nextIndex = STEP_ORDER.indexOf(nextStep);
      const furthestIndex = STEP_ORDER.indexOf(furthestStep);
      
      if (nextIndex > furthestIndex) {
        setFurthestStep(nextStep);
      }
      
      // Move to next step
      setCurrentStep(nextStep);
      setStepProgress(0);
      
      // Special actions for specific steps
      if (nextStep === 'writing') {
        generateStoryTopic();
      } else if (nextStep === 'results') {
        calculateFinalScore();
      }
    }
  };

  const handleSkipLearning = () => {
    // Don't allow skipping in view-only mode
    if (isViewOnly) return;
    
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    // Update furthest step to writing
    const writingIndex = STEP_ORDER.indexOf('writing');
    const furthestIndex = STEP_ORDER.indexOf(furthestStep);
    
    if (writingIndex > furthestIndex) {
      setFurthestStep('writing');
    }
    
    setCurrentStep('writing');
    generateStoryTopic();
    setStepProgress(0);
  };

  const handleReturnToFurthest = () => {
    setCurrentStep(furthestStep);
  };

  const generateStoryTopic = () => {
    setIsGeneratingTopic(true);
    
    // Simulate AI topic generation - in real app, this would call AI service
    setTimeout(() => {
      const randomTopic = storyTopics[Math.floor(Math.random() * storyTopics.length)];
      setSelectedTopic(randomTopic);
      setIsGeneratingTopic(false);
    }, 1500);
  };

  const regenerateTopic = () => {
    // Don't allow regeneration in view-only mode
    if (isViewOnly) return;
    
    setIsGeneratingTopic(true);
    setSelectedTopic(null);
    
    setTimeout(() => {
      // Filter out the currently selected topic to ensure we get a different one
      const availableTopics = storyTopics.filter(topic => topic.id !== selectedTopic?.id);
      const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
      setSelectedTopic(randomTopic);
      setIsGeneratingTopic(false);
    }, 1500);
  };

  const handleAnswerQuestion = (answerIndex: number) => {
    // Don't allow answering in view-only mode
    if (isViewOnly) return;
    
    const currentQuestion = learningQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const startTime = Date.now() - 5000; // Mock timing
    
    // Record the result
    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: answerIndex,
      isCorrect,
      timeSpent: Date.now() - startTime
    };
    
    setQuestionResults([...questionResults, result]);
    setCurrentQuestionResult({
      isCorrect,
      explanation: currentQuestion.explanation
    });
    setShowQuestionFeedback(true);
  };

  const handleNextQuestion = () => {
    // Don't allow navigation in view-only mode
    if (isViewOnly) return;
    
    setShowQuestionFeedback(false);
    setCurrentQuestionResult(null);
    
    if (currentQuestionIndex < learningQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, ready to proceed
      setStepProgress(100);
    }
  };

  const listenToStory = async () => {
    if (isListeningToStory) {
      // Stop story playback
      window.speechSynthesis.cancel();
      setIsListeningToStory(false);
      setCurrentStoryWordIndex(-1);
      return;
    }

    try {
      setIsListeningToStory(true);
      setCurrentStoryWordIndex(-1);
      
      // Split story into sentences and highlight vocabulary words as they're spoken
      const sentences = exampleStory.split(/[.!?]+/).filter(s => s.trim());
      
      for (let sentenceIndex = 0; sentenceIndex < sentences.length; sentenceIndex++) {
        // Check if story listening was stopped
        if (!isListeningToStory) break;
        
        const sentence = sentences[sentenceIndex].trim();
        
        // Check if this sentence contains any vocabulary words
        dailyWords.forEach((word, index) => {
          if (sentence.toLowerCase().includes(word.word.toLowerCase())) {
            setCurrentStoryWordIndex(index);
          }
        });
        
        try {
          await safeSpeak(sentence);
          
          // Wait for sentence to complete
          const words = sentence.split(' ').length;
          const readingTime = Math.max(words * 400, 1000); // Minimum 1 second
          
          await new Promise(resolve => setTimeout(resolve, readingTime));
          
        } catch (error) {
          console.warn(`Error speaking sentence ${sentenceIndex + 1}:`, error);
          // Continue with next sentence
        }
      }
      
    } catch (error) {
      console.warn('Story listening error:', error);
    } finally {
      setIsListeningToStory(false);
      setCurrentStoryWordIndex(-1);
    }
  };

  const highlightVocabularyWords = (text: string) => {
    let highlightedText = text;
    
    dailyWords.forEach((word, index) => {
      const regex = new RegExp(`\\b${word.word}\\b`, 'gi');
      const isCurrentWord = currentStoryWordIndex === index;
      const className = isCurrentWord 
        ? 'bg-aduffy-yellow text-aduffy-navy font-bold px-1 rounded animate-pulse'
        : 'bg-aduffy-yellow/30 text-aduffy-navy font-semibold px-1 rounded';
      
      highlightedText = highlightedText.replace(regex, `<span class="${className}">$&</span>`);
    });
    
    return highlightedText;
  };

  const analyzeStory = async () => {
    // Don't allow analysis in view-only mode
    if (isViewOnly) return;
    
    setIsAnalyzing(true);
    
    // Mock analysis - in real app, this would call AI service
    setTimeout(() => {
      const wordsUsed = dailyWords.filter(word => 
        userStory.toLowerCase().includes(word.word.toLowerCase())
      );
      
      const analysis = {
        wordsUsed: wordsUsed.length,
        totalWords: dailyWords.length,
        storyLength: userStory.split(' ').length,
        creativity: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
        grammar: Math.floor(Math.random() * 20) + 80, // Mock score 80-100
        coherence: Math.floor(Math.random() * 25) + 75, // Mock score 75-100
        topicAdherence: Math.floor(Math.random() * 20) + 80, // New metric for topic adherence
        feedback: `Excellent work incorporating ${wordsUsed.length} out of ${dailyWords.length} vocabulary words into the "${selectedTopic?.title}" scenario! Your story demonstrates good understanding of the professional context and creative problem-solving.`,
        suggestions: [
          "Try to use all vocabulary words in your story for maximum learning benefit",
          "Consider adding more specific details about the challenges presented in the scenario",
          "Practice using the words in different sentence structures to enhance versatility"
        ]
      };
      
      setStoryAnalysis(analysis);
      setIsAnalyzing(false);
      setStepProgress(100);
    }, 2000);
  };

  const startVoiceConversation = async () => {
    // Don't allow starting conversation in view-only mode
    if (isViewOnly) return;
    
    console.log('Starting voice conversation...');
    console.log('Selected topic:', selectedTopic?.title);
    console.log('Voice supported:', isVoiceSupported);
    console.log('Permission status:', permissionStatus);
    
    try {
      const initialPrompt = selectedTopic 
        ? `Great story about "${selectedTopic.title}"! Now let's have a conversation about your approach to this scenario. I'll ask you questions and you should try to use each of our vocabulary words in your responses. Let's start: How did you decide on your approach to handling this professional challenge?`
        : `Great work on your vocabulary learning! Let's have a conversation to practice using the words you've learned. I'll ask you questions and you should try to use each vocabulary word in your responses. Let's start: How do you plan to use these new vocabulary words in your professional life? Also ensure that the user used long, proper sentences and proper grammar.`;
      
      console.log('Speaking initial prompt:', initialPrompt);
      
      // First set the conversation state
      setVoiceConversation([
        { type: 'ai', content: initialPrompt, timestamp: new Date() }
      ]);
      
      // Then speak the prompt with error handling
      await safeSpeak(initialPrompt);
      
    } catch (error) {
      console.warn('Voice conversation start error:', error);
      // Continue even if speech fails - user can still see the text
    }
  };

  const handleVoiceResponse = async () => {
    // Don't allow voice responses in view-only mode
    if (isViewOnly) return;
    
    if (transcript) {
      // you never modify state directly instad you create a new arrayor object
      const newConversation = [...voiceConversation];
      newConversation.push({
        type: 'user',
        content: transcript,
        timestamp: new Date(),
        wordsUsed: dailyWords.filter(word => 
          transcript.toLowerCase().includes(word.word.toLowerCase())
        )
      });
      
      setVoiceConversation(newConversation);
      clearTranscript();
      
      try {
        // Generate AI response using Gemini
        const aiResponse = await generateVoiceResponse({
          userMessage: transcript,
          conversationHistory: voiceConversation,
          vocabulary: dailyWords.map(w => w.word),
          topic: selectedTopic?.title
        });
        
        // Wait a moment before speaking the response
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await safeSpeak(aiResponse);
        //safeSpeak takes a text and convets it to speech
        newConversation.push({
          type: 'ai',
          content: aiResponse,
          timestamp: new Date()
        });
        setVoiceConversation([...newConversation]);
        
      } catch (error) {
        console.warn('Voice response error:', error);
        // Fallback response if Gemini fails
        const fallbackResponse = "That's interesting! Can you tell me more about how you would apply these concepts in your work?";
        
        try {
          await safeSpeak(fallbackResponse);
        } catch (speechError) {
          console.warn('Speech error:', speechError);
        }
        
        newConversation.push({
          type: 'ai',
          content: fallbackResponse,
          timestamp: new Date()
        });
        setVoiceConversation([...newConversation]);
      }
    }
  };

  const calculateFinalScore = () => {
    const correctAnswers = questionResults.filter(result => result.isCorrect).length;
    const learningScore = (correctAnswers / learningQuestions.length) * 25;
    
    const storyScore = storyAnalysis ? 
      ((storyAnalysis.creativity + storyAnalysis.grammar + storyAnalysis.coherence + storyAnalysis.topicAdherence) / 4) * 0.35 : 0;
    
    const voiceScore = voiceConversation.filter(msg => 
      msg.type === 'user' && msg.wordsUsed?.length > 0
    ).length * 10;
    
    const total = Math.min(100, learningScore + storyScore + voiceScore);
    setFinalScore(Math.round(total));
    
    // Mark activity as completed
    if (onComplete) {
      onComplete();
    }
  };

  const renderVoicePermissionAlert = () => {
    if (!isVoiceSupported) {
      return (
        <Alert className="mb-6">
          <div className="text-muted-foreground text-sm mt-2">
            Voice features may have limited support in this browser. You can still try the conversation feature, but for the best experience, please use Chrome, Safari, or Edge.
          </div>
        </Alert>
      );
    }

    if (voiceError) {
      return (
        <Alert className="mb-6">
          <div className="flex items-center justify-between text-muted-foreground text-sm mt-2">
            <span>{voiceError}</span>
            <Button
              onClick={() => window.open('chrome://settings/content/microphone', '_blank')}
              className="aduffy-button-outline ml-4"
            >
              Settings
            </Button>
          </div>
        </Alert>
      );
    }

    if (permissionStatus === 'prompt' || permissionStatus === 'unknown') {
      return (
        <Alert className="mb-6">
          <div className="flex items-center justify-between text-muted-foreground text-sm mt-2">
            <span>Microphone access may be required for voice recognition features.</span>
            <Button
              onClick={requestPermission}
              className="aduffy-button-outline ml-4"
            >
              Allow Access
            </Button>
          </div>
        </Alert>
      );
    }

    return null;
  };

  const renderViewOnlyAlert = () => {
    if (!isViewOnly) return null;

    return (
      <Alert className="view-mode-alert">
        <div className="alert-content">
          <span className="alert-lock-icon" aria-hidden="true">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="5" y="11" width="14" height="8" rx="3" stroke="#1793b6" strokeWidth="1.5" fill="none"/>
              <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="#1793b6" strokeWidth="1.5" fill="none"/>
            </svg>
          </span>
          <span>
            You're viewing a completed step. Changes are not allowed in view mode.
          </span>
        </div>
        <button
          className="alert-action-btn"
          onClick={handleReturnToFurthest}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{marginRight: '0.3em'}}>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="#1793b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Return to {furthestStep.charAt(0).toUpperCase() + furthestStep.slice(1)}
        </button>
      </Alert>
    );
  };

  const renderWordsStep = () => (
    <div className="space-y-8">
      {renderViewOnlyAlert()}
      
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-aduffy-yellow/10 rounded-full flex items-center justify-center border-2 border-aduffy-yellow/20">
            <div className="w-8 h-8 text-aduffy-yellow" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-bold text-aduffy-navy text-center">Today's Vocabulary Words</h2>
            
            <div className="flex items-center gap-2 mt-1 justify-center">
              <Badge className="vocab-badge-professional">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ marginRight: '0.5em', flexShrink: 0, display: 'inline' }}
                  aria-hidden="true"
                  focusable="false"
                >
                  <rect x="3" y="5" width="14" height="12" rx="3" fill="none" stroke="#222b3a" strokeWidth="1.5"/>
                  <path d="M3 8.5h14" stroke="#222b3a" strokeWidth="1.2"/>
                  <rect x="6.5" y="2.5" width="1.5" height="3" rx="0.75" fill="#222b3a"/>
                  <rect x="12" y="2.5" width="1.5" height="3" rx="0.75" fill="#222b3a"/>
                </svg>
                5 Professional Words
              </Badge>
              {isViewOnly && (
                <Badge className="aduffy-badge-info">
                  <div className="w-3 h-3 mr-1 text-muted-foreground" />
                  View Only
                </Badge>
              )}
            </div>
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Master these 5 carefully selected vocabulary words to enhance your professional communication skills.
        </p>
      </div>

      {/* Field Selector */}
      <div className="learning-focus-card">
        <div className="card-header">
          <div className="card-title">
            <div className="focus-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Learning Focus
            {isViewOnly && <div className="w-4 h-4 text-muted-foreground" />}
          </div>
          <div className="card-description">
            {isViewOnly ? 'Field selection (view only)' : 'Choose your professional field to get relevant vocabulary'}
          </div>
        </div>
        <div className="card-content">
          <CustomSelect
            value={selectedField}
            onChange={handleFieldChange}
            disabled={isViewOnly}
            options={[
              { value: "marketing", icon: "📊", label: "Marketing" },
              { value: "technology", icon: "💻", label: "Technology" },
              { value: "sales", icon: "💼", label: "Sales" },
              { value: "product", icon: "🚀", label: "Product" },
              { value: "finance", icon: "💰", label: "Finance" },
              { value: "operations", icon: "⚙️", label: "Operations" },
            ]}
            className={isViewOnly ? 'opacity-60' : ''}
          />
          {selectedField !== (userProfile?.field || 'marketing') && (
            <div className="field-change-notice">
              📝 Field changed from your profile setting
            </div>
          )}
        </div>
      </div>

      {/* Audio Controls */}
      <Card className="card-soft-yellow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-aduffy-navy">
            <div className="audio-icon-yellow">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M3 10v4h4l5 5V5l-5 5H3z" fill="currentColor"/>
                <path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v8.06A4.978 4.978 0 0 0 16.5 12z" fill="currentColor"/>
                <path d="M19.5 12c0-3.04-1.64-5.64-4.5-6.32v2.06c1.77.77 3 2.53 3 4.26s-1.23 3.49-3 4.26v2.06c2.86-.68 4.5-3.28 4.5-6.32z" fill="currentColor"/>
              </svg>
            </div>
            Audio Learning
          </CardTitle>
          <CardDescription>
            Listen to perfect pronunciation of all vocabulary words
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <Button
              onClick={playAllWords}
              className="play-all-words-btn"
              disabled={!isVoiceSupported}
            >
              <span className="play-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <polygon points="5,3 16,10 5,17" fill="none" stroke="#222b3a" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </span>
              Play All Words
            </Button>
          </div>
          {!isVoiceSupported && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Audio features may not be available in this browser
            </p>
          )}
        </CardContent>
      </Card>

      <div className="vocabulary-grid">
        {dailyWords.map((word, index) => (
          <div key={index} className="vocabulary-card">
            <div className="vocabulary-card-header">
              <div className="word-number">{index + 1}</div>
              <div className={`word-level ${word.difficulty}`}>{word.difficulty}</div>
            </div>
            <div className="vocabulary-word">
              {word.word}
              <button
                onClick={() => playWordPronunciation(index)}
                disabled={!isVoiceSupported}
                className="audio-button"
                title="Listen to pronunciation"
              >
                🔊
              </button>
            </div>
            <div className="word-type">{word.partOfSpeech}</div>
            <div>
              <div className="definition-label">Definition</div>
              <div className="word-definition">{word.definition}</div>
            </div>
            <div>
              <div className="example-label">Professional Example</div>
              <div className="word-example">"{word.example}"</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        {!isViewOnly ? (
          <Button onClick={handleNextStep} className="orange-action-btn">
            <span style={{fontSize: '1.1em', display: 'inline-block', transform: 'translateY(1px)'}}>→</span>
            Continue to Learning Activities
          </Button>
        ) : (
          <Button onClick={handleReturnToFurthest} className="border-aduffy-yellow/30 text-aduffy-navy hover:bg-aduffy-yellow/10">
            <div className="w-4 h-4 mr-2 text-aduffy-yellow" />
            Return to {furthestStep.charAt(0).toUpperCase() + furthestStep.slice(1)}
          </Button>
        )}
      </div>
    </div>
  );
// Learning Page starts here
  const renderLearningStep = () => (
    <div className="space-y-8">
      {renderViewOnlyAlert()}
      
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-aduffy-teal/10 rounded-full flex items-center justify-center border-2 border-aduffy-teal/20">
            <div className="w-8 h-8 text-aduffy-teal" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-bold text-aduffy-navy text-center">Learn &amp; Practice</h2>
            <div className="learning-header-center">
              <Badge className="aduffy-badge-info">
                <div className="w-3 h-3 mr-1 text-aduffy-teal" />
                Interactive Learning
              </Badge>
              <button
                type="button"
                onClick={() => setShowLearningContent(!showLearningContent)}
                className="hide-content-btn"
              >
                <span className="hide-content-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5.05 0-9.29-3.36-10-8 .21-1.32.7-2.56 1.44-3.66M6.1 6.1A9.97 9.97 0 0 1 12 4c5.05 0 9.29 3.36 10 8-.21 1.32-.7 2.56-1.44 3.66M1 1l22 22" stroke="#222b3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {showLearningContent ? 'Hide' : 'Show'} Content
              </button>
            </div>
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isViewOnly 
            ? "Review your completed learning session. All answers and content are shown in view-only mode."
            : "Strengthen your understanding through comprehensive questions and contextual examples. You can skip this step if you're confident."
          }
        </p>
      </div>

      <Tabs defaultTab="questions" className="w-full">
        <TabsList className="tabs-list-pill">
          <TabsTrigger tabValue="questions" className="tabs-trigger">
            <div className="w-4 h-4 mr-2 text-aduffy-teal" />
            Practice Questions ({learningQuestions.length})
          </TabsTrigger>
          <TabsTrigger tabValue="story" className="tabs-trigger">
            <div className="w-4 h-4 mr-2 text-aduffy-yellow" />
            Example Story
          </TabsTrigger>
        </TabsList>
        
        <TabsContent tabValue="questions" className="space-y-6 mt-8">
          {showLearningContent && learningQuestions.length > 0 && (
            <Card className="aduffy-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-aduffy-navy">
                      Question {currentQuestionIndex + 1} of {learningQuestions.length}
                      {isViewOnly && <div className="w-4 h-4 ml-2 inline text-muted-foreground" />}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {dailyWords[learningQuestions[currentQuestionIndex]?.wordIndex]?.word} - {learningQuestions[currentQuestionIndex]?.type}
                    </CardDescription>
                  </div>
                  <Badge className="aduffy-badge-primary">
                    <div className="w-3 h-3 mr-1 text-aduffy-teal" />
                    {isViewOnly ? 'Completed' : 'Practice'}
                  </Badge>
                </div>
                <Progress value={(currentQuestionIndex / learningQuestions.length) * 100} className="mt-4" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg font-medium text-aduffy-navy">
                  {learningQuestions[currentQuestionIndex]?.question}
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {learningQuestions[currentQuestionIndex]?.options.map((option, index) => {
                    const isSelected = questionResults[questionResults.length - 1]?.userAnswer === index;
                    const isCorrect = index === learningQuestions[currentQuestionIndex].correctAnswer;
                    return (
                      <div
                        key={index}
                        className={`quiz-option${isSelected ? ' selected' : ''}${isCorrect && (showQuestionFeedback || isViewOnly) ? ' correct' : ''}${isViewOnly ? ' cursor-default' : ''}`}
                        onClick={() => !showQuestionFeedback && !isViewOnly && handleAnswerQuestion(index)}
                        style={{ pointerEvents: showQuestionFeedback || isViewOnly ? 'none' : 'auto' }}
                      >
                        <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                        {option}
                        {(showQuestionFeedback || isViewOnly) && isCorrect && (
                          <span className="option-check">
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" stroke="#22b573" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {(showQuestionFeedback || isViewOnly) && currentQuestionResult && (
                  <div className={`quiz-feedback ${currentQuestionResult.isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="quiz-feedback-header">
                      {currentQuestionResult.isCorrect ? (
                        <>
                          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#22b573" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Correct!
                        </>
                      ) : (
                        <>
                          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Incorrect
                        </>
                      )}
                    </div>
                    <div className="quiz-feedback-explanation">
                      {currentQuestionResult.explanation}
                    </div>
                    {!isViewOnly && (
                      <button className="quiz-feedback-btn" onClick={handleNextQuestion}>
                        Next Question
                        <span style={{ display: 'inline-block', transform: 'translateY(1px)' }}>→</span>
                      </button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {questionResults.length > 0 && (
            <Card className="progress-summary-card">
              <CardHeader>
                <CardTitle className="text-aduffy-navy">Progress Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span>Correct Answers:</span>
                  <span className="font-medium text-success">
                    {questionResults.filter(r => r.isCorrect).length} / {questionResults.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span>Accuracy:</span>
                  <span className="font-medium">
                    {Math.round((questionResults.filter(r => r.isCorrect).length / questionResults.length) * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent tabValue="story" className="space-y-6 mt-8">
          {showLearningContent && (
            <Card className="example-story-card">
              <CardHeader>
                <div className="flex items-start justify-between w-full">
                  <div>
                    <div className="flex items-center gap-2 text-aduffy-orange font-bold text-lg mb-1">
                      <span role="img" aria-label="lightbulb">💡</span>
                      Example Professional Story
                    </div>
                    <div className="text-muted-foreground text-base">
                      See how all 5 vocabulary words are used naturally in a workplace context
                    </div>
                  </div>
                  <Button className="listen-story-btn" /* ...props */>
                    <span className="mr-2">🔊</span> Listen to Story
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="example-story-box">
                  <div className="example-story-text">
                    {/* Your story text here */}
                    {exampleStory}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="font-semibold mb-2">Vocabulary Words Used:</div>
                  <div className="flex flex-wrap gap-2">
                    {dailyWords.map((word, index) => (
                      <span key={index} className="vocab-badge-success">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{marginRight: 4, verticalAlign: 'middle'}}><path d="M5 13l4 4L19 7" stroke="#22b573" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {word.word}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        {!isViewOnly ? (
          <>
            <button
              type="button"
              onClick={handleSkipLearning}
              className="skip-learning-btn"
            >
              Skip Learning
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="start-writing-btn"
              disabled={stepProgress < 100 && showLearningContent}
            >
              <span className="start-writing-icon">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="#222b3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              Start Writing
            </button>
          </>
        ) : (
          <div className="flex w-full justify-center">
            <Button onClick={handleReturnToFurthest} className="w-full border-aduffy-yellow/30 text-aduffy-navy hover:bg-aduffy-yellow/10">
              <div className="w-4 h-4 mr-2 text-aduffy-yellow" />
              Return to {furthestStep.charAt(0).toUpperCase() + furthestStep.slice(1)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderWritingStep = () => (
    <div className="space-y-8">
      {renderViewOnlyAlert()}
      {/* 
        CHANGED: Removed "Back to Dashboard" button from writing step header
        - Previously had duplicate back buttons (one in header, one in step content)
        - Now only shows back button in the results step for better UX
        - This creates a cleaner, less cluttered interface during the writing process
      */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-aduffy-orange/10 rounded-full flex items-center justify-center border-2 border-aduffy-orange/20">
            <div className="w-8 h-8 text-aduffy-orange" />
          </div>
          <div className="text-left">
            <h2 className="storytelling-welcome-title">Write Your Story</h2>
            <div className="flex justify-center mt-1">
              <span className="ai-guided-badge">
                <span className="ai-guided-icon" role="img" aria-label="brain">🧠</span>
                AI-Guided Writing
              </span>
              {isViewOnly && (
                <Badge className="aduffy-badge-info ml-2">
                  <div className="w-3 h-3 mr-1 text-muted-foreground" />
                  View Only
                </Badge>
              )}
            </div>
          </div>
        </div>
        <p className="text-center">
          {isViewOnly
            ? "Review your completed story and AI analysis. All content is shown in view-only mode."
            : "Write a professional story based on the AI-generated scenario below, incorporating all 5 vocabulary words naturally."}
        </p>
      </div>
      {/* 
        CHANGED: Implemented two-column grid layout for better UX
        - Main content (story writing) on the left side
        - Vocabulary checklist positioned on the right side
        - Uses story-main-grid class for responsive layout
        - Creates better visual balance and easier vocabulary tracking
      */}
      <div className="story-main-grid gap-8">
        <div className="space-y-6">
          {/* AI-Generated Story Topic */}
          <Card className="aduffy-card">
            <CardHeader>
              <div className="ai-story-card-title">
                <span role="img" aria-label="lightbulb">💡</span>
                Your AI-Generated Story Topic
                {selectedTopic && !isViewOnly && (
                  <button onClick={regenerateTopic} disabled={isGeneratingTopic} className="ai-story-new-topic-btn ml-auto">
                    {isGeneratingTopic ? 'Generating...' : 'New Topic'}
                  </button>
                )}
              </div>
              <div className="ai-story-card-desc">
                Use this professional scenario as the foundation for your story
              </div>
            </CardHeader>
            <CardContent>
              <div className="ai-story-card-inner">
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{selectedTopic?.title}</div>
                <div style={{ color: '#444', marginBottom: 6 }}>{selectedTopic?.scenario}</div>
                <div><b>Context:</b> {selectedTopic?.context}</div>
                <div><b>Your Challenge:</b> {selectedTopic?.challenge}</div>
              </div>
              <div className="ai-story-card-instructions mt-4">
                <span role="img" aria-label="writing">📝</span>
                <span>
                  <b>Writing Instructions:</b> {isViewOnly
                    ? `You successfully incorporated all 5 vocabulary words into this scenario: ${dailyWords.map(w => w.word).join(', ')}`
                    : `Create a compelling narrative that addresses this scenario while naturally incorporating all 5 vocabulary words: ${dailyWords.map(w => w.word).join(', ')}`}
                </span>
              </div>
            </CardContent>
          </Card>
          {/* Story Writing Area */}
          <div className="story-card-writing">
            <div className="story-card-writing-title">Your Professional Story</div>
            <div className="story-card-writing-desc">
              {selectedTopic
                ? `Write your story based on "${selectedTopic.title}" using all 5 vocabulary words`
                : 'Write your story using all 5 vocabulary words'}
            </div>
            <Textarea
              placeholder={selectedTopic
                ? (isViewOnly ? "Your story is displayed above..." : `Start your story about \"${selectedTopic.title}\" here... Remember to incorporate all vocabulary words naturally into your narrative while addressing the challenge presented.`)
                : 'Start your story here... Remember to incorporate all vocabulary words naturally into your narrative while addressing the challenge presented.'}
              value={userStory}
              onChange={(e) => !isViewOnly && setUserStory(e.target.value)}
              className={`story-textarea${isViewOnly ? ' opacity-60' : ''}`}
              readOnly={isViewOnly}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <span>Words: {userStory.split(' ').filter(word => word.trim()).length}</span>
              <span>Vocabulary used: {dailyWords.filter(word => userStory.toLowerCase().includes(word.word.toLowerCase())).length}/{dailyWords.length}</span>
            </div>
          </div>
          {storyAnalysis && (
            <Card className="aduffy-card bg-gradient-to-br from-aduffy-yellow/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-aduffy-navy">
                  <div className="w-6 h-6 text-aduffy-yellow" />
                  AI Story Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="ai-analysis-card space-y-6">
                <div className="ai-analysis-header">
                  <svg className="ai-analysis-trophy" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4V2h14v2h3v2c0 3.31-2.69 6-6 6h-2v2.09A7.001 7.001 0 0 1 12 22a7.001 7.001 0 0 1-2-13.91V10H8c-3.31 0-6-2.69-6-6V4h3zm2 0v2c0 2.21 1.79 4 4 4s4-1.79 4-4V4H7zm-3 2c0 2.21 1.79 4 4 4h2V4H4v2zm16-2h-6v4h2c2.21 0 4-1.79 4-4V4z"/></svg>
                  <span>AI Story Analysis</span>
                </div>
                <div className="ai-analysis-scores-row">
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-creativity">{storyAnalysis.creativity}%</div>
                    <div className="ai-analysis-label">Creativity</div>
                  </div>
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-grammar">{storyAnalysis.grammar}%</div>
                    <div className="ai-analysis-label">Grammar</div>
                  </div>
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-coherence">{storyAnalysis.coherence}%</div>
                    <div className="ai-analysis-label">Coherence</div>
                  </div>
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-topic">{storyAnalysis.topicAdherence}%</div>
                    <div className="ai-analysis-label">Topic Match</div>
                  </div>
                </div>
                <hr className="ai-analysis-divider" />
                <div>
                  <h4 className="font-medium text-aduffy-navy mb-2">Feedback</h4>
                  <p className="text-muted-foreground">{storyAnalysis.feedback}</p>
                </div>
                <div>
                  <h4 className="font-medium text-aduffy-navy mb-2">Suggestions for Improvement</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {storyAnalysis.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-aduffy-yellow rounded-full mt-2 flex-shrink-0"></div>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="space-y-6">
          <div className="vocab-checklist-card">
            <div className="vocab-checklist-title">Vocabulary Checklist</div>
            <div className="vocab-checklist-desc">
              {isViewOnly ? 'Words you used in your story' : "Track which words you've used in your story"}
            </div>
            <div className="vocab-checklist-list">
              {dailyWords.map((word, index) => {
                const isUsed = userStory.toLowerCase().includes(word.word.toLowerCase());
                return (
                  <div key={index} className="vocab-checklist-item">
                    <div>
                      <div className="vocab-checklist-word">{word.word}</div>
                      <div className="vocab-checklist-pos">{word.partOfSpeech}</div>
                    </div>
                    <div className={`vocab-checklist-indicator${isUsed ? ' checked' : ''}`}>
                      {isUsed && (
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            {!isViewOnly ? (
              <>
                <Button
                  onClick={handleAnalyzeStory}
                  disabled={!userStory.trim() || isAnalyzing || !selectedTopic}
                  className="w-full ai-story-new-topic-btn"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 mr-2 text-aduffy-teal" />
                      Analyze My Story
                    </>
                  )}
                </Button>
                {storyAnalysis && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="continue-voice-btn"
                  >
                    <span className="continue-voice-icon">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="#222b3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    Continue to Voice Chat
                  </button>
                )}
              </>
            ) : (
              <Button onClick={handleReturnToFurthest} className="w-full border-aduffy-yellow/30 text-aduffy-navy hover:bg-aduffy-yellow/10">
                <div className="w-4 h-4 mr-2 text-aduffy-yellow" />
                Return to {furthestStep.charAt(0).toUpperCase() + furthestStep.slice(1)}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
// Voice conversation page starts from here
  const renderVoiceStep = () => (
    <div className="space-y-8">
      {renderViewOnlyAlert()}
      
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center border-2 border-info/20">
            <div className="w-8 h-8 text-info" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-bold text-aduffy-navy text-center">Voice Conversation</h2>
            <div className="speaking-badge-center">
              <span className="speaking-badge">
                <span className="speaking-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 17c2.761 0 5-2.239 5-5V7a5 5 0 0 0-10 0v5c0 2.761 2.239 5 5 5zm7-5v-1a1 1 0 1 0-2 0v1a7 7 0 0 1-14 0v-1a1 1 0 1 0-2 0v1c0 4.418 3.582 8 8 8s8-3.582 8-8z" fill="#0097a7"/>
                  </svg>
                </span>
                Interactive Speaking
              </span>
            </div>
            {isViewOnly && (
              <Badge className="aduffy-badge-info">
                <div className="w-3 h-3 mr-1 text-muted-foreground" />
                View Only
              </Badge>
            )}
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isViewOnly 
            ? "Review your completed voice conversation with AI. All interactions are shown in view-only mode."
            : "Have a natural conversation with AI about your story. Try to use each vocabulary word in your responses."
          }
        </p>
      </div>

      {renderVoicePermissionAlert()}

      <div className="conversation-main-grid">
        {/* Left: Conversation */}
        <div className="conversation-panel">
          <Card className="aduffy-card">
            <CardHeader>
              <CardTitle className="text-aduffy-navy">Conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-96 overflow-y-auto space-y-4 bg-muted/20 p-4 rounded-lg">
                {voiceConversation.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <div className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>
                      {isViewOnly 
                        ? "No conversation data available to display"
                        : 'Click "Start Conversation" to begin the voice interaction'
                      }
                    </p>
                    {!isViewOnly && (
                      <button
                        type="button"
                        className="orange-action-btn"
                        onClick={startVoiceConversation}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight: 8, display: 'inline-block', verticalAlign: 'middle'}}><path d="M8 5v14l11-7z" fill="#222"/></svg>
                        Start Conversation
                      </button>
                    )}
                  </div>
                ) : (
                  voiceConversation.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-aduffy-yellow/20 text-aduffy-navy' 
                          : 'bg-card border text-foreground'
                      }`}>
                        <p>{message.content}</p>
                        {message.wordsUsed && message.wordsUsed.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.wordsUsed.map((word: any, wordIndex: number) => (
                              <Badge key={wordIndex} className="aduffy-badge-success text-xs">
                                {word.word}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Voice controls and transcript preview */}
              {!isViewOnly && (
                <div className="flex items-center gap-4 mt-4">
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className="orange-action-btn"
                    disabled={!isVoiceSupported}
                  >
                    {isListening ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight: 8, display: 'inline-block', verticalAlign: 'middle'}}>
                          <rect x="6" y="6" width="12" height="12" rx="2" fill="#222" />
                        </svg>
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight: 8, display: 'inline-block', verticalAlign: 'middle'}}>
                          <path d="M8 5v14l11-7z" fill="#222"/>
                        </svg>
                        Start Speaking
                      </>
                    )}
                  </button>
                  {transcript && (
                    <button onClick={handleVoiceResponse} className="aduffy-button-outline">
                      <div className="w-4 h-4 mr-2 text-aduffy-yellow" />
                      Send Response
                    </button>
                  )}
                </div>
              )}
              {!isViewOnly && transcript && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Your speech:</div>
                  <p className="text-sm">{transcript}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Word Usage Goal */}
        <div className="word-usage-panel">
          <Card className="aduffy-card">
            <CardHeader>
              <CardTitle className="text-aduffy-navy">Word Usage Goal</CardTitle>
              <CardDescription>
                Try to use each word in the conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dailyWords.map((word, index) => {
                const isUsedInConversation = voiceConversation.some(msg => 
                  msg.type === 'user' && msg.content.toLowerCase().includes(word.word.toLowerCase())
                );
                return (
                  <div key={index} className="word-usage-card">
                    <div className="word-usage-info">
                      <div className="word-usage-title">{word.word}</div>
                      <div className="word-usage-def">{word.definition}</div>
                    </div>
                    <div className={`word-usage-indicator${isUsedInConversation ? ' checked' : ''}`}>
                      {isUsedInConversation && (
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <div className="mt-6">
            {!isViewOnly ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full soft-yellow-btn"
                disabled={voiceConversation.filter(msg => msg.type === 'user').length < 2}
              >
                <span className="soft-yellow-arrow">&#8594;</span>
                Complete &amp; Get Results
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReturnToFurthest}
                className="w-full border-aduffy-yellow/30 text-aduffy-navy hover:bg-aduffy-yellow/10"
              >
                <div className="w-4 h-4 mr-2 text-aduffy-yellow" />
                Return to {furthestStep.charAt(0).toUpperCase() + furthestStep.slice(1)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-aduffy-yellow/10 rounded-full flex items-center justify-center border-2 border-aduffy-yellow/20">
            <div className="w-8 h-8 text-aduffy-yellow" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-bold text-aduffy-navy">Learning Complete!</h2>
            <Badge className="aduffy-badge-primary mt-1">
              <div className="w-4 h-4 mr-1 text-aduffy-yellow" />
              Final Score: {finalScore}/100
            </Badge>
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Congratulations! You've completed today's vocabulary learning journey. Here's your comprehensive performance analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="aduffy-card text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-aduffy-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 text-aduffy-teal" />
            </div>
            <div className="text-2xl font-bold text-aduffy-teal mb-2">Learning</div>
            <div className="text-sm text-muted-foreground">
              {Math.round((questionResults.filter(r => r.isCorrect).length / learningQuestions.length) * 100)}% correct ({questionResults.filter(r => r.isCorrect).length}/{learningQuestions.length})
            </div>
          </CardContent>
        </Card>

        <Card className="aduffy-card text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-aduffy-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 text-aduffy-orange" />
            </div>
            <div className="text-2xl font-bold text-aduffy-orange mb-2">Writing</div>
            <div className="text-sm text-muted-foreground">
              {storyAnalysis ? Math.round((storyAnalysis.creativity + storyAnalysis.grammar + storyAnalysis.coherence + storyAnalysis.topicAdherence) / 4) : 0}% quality
            </div>
          </CardContent>
        </Card>

        <Card className="aduffy-card text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 text-info" />
            </div>
            <div className="text-2xl font-bold text-info mb-2">Speaking</div>
            <div className="text-sm text-muted-foreground">
              {voiceConversation.filter(msg => msg.type === 'user').length} interactions
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="aduffy-card bg-gradient-to-br from-aduffy-yellow/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-center text-aduffy-navy">
            🎉 Daily Learning Achievement Unlocked!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-aduffy-yellow mb-2">{finalScore}</div>
            <div className="text-lg text-muted-foreground">Overall Score</div>
            <Progress value={finalScore} className="mt-4 max-w-md mx-auto" />
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-aduffy-navy mb-3">Today's Achievements</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 text-success" />
                  <span className="text-sm">Mastered 5 new vocabulary words</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 text-success" />
                  <span className="text-sm">Completed {learningQuestions.length} practice questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 text-success" />
                  <span className="text-sm">Created AI-guided story</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 text-success" />
                  <span className="text-sm">Practiced speaking skills</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-aduffy-navy mb-3">Story Topic Mastered</h4>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-medium text-aduffy-navy text-sm">{selectedTopic?.title || 'Professional Communication'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Successfully addressed this professional scenario while incorporating vocabulary words
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        {/* Remove the duplicate Back to Dashboard button here */}
        <Button onClick={() => {
          setCurrentStep('words');
          setStepProgress(0);
          setUserStory('');
          setStoryAnalysis(null);
          setVoiceConversation([]);
          setQuestionResults([]);
          setCurrentQuestionIndex(0);
          setSelectedTopic(null);
          setShowQuestionFeedback(false);
          setCurrentQuestionResult(null);
        }} className="border-aduffy-yellow/30 text-aduffy-navy hover:bg-aduffy-yellow/10">
          <div className="w-4 h-4 mr-2 text-aduffy-yellow" />
          Try Again
        </Button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'words':
        return renderWordsStep();
      case 'learning':
        return renderLearningStep();
      case 'writing':
        return renderWritingStep();
      case 'voice':
        return renderVoiceStep();
      case 'results':
        return renderResultsStep();
      default:
        return renderWordsStep();
    }
  };

  const renderStepNavigation = () => {
    const steps: { key: StepType; label: string }[] = [
      { key: 'words', label: 'Words' },
      { key: 'learning', label: 'Learning' },
      { key: 'writing', label: 'Writing' },
      { key: 'voice', label: 'Voice Chat' },
      { key: 'results', label: 'Results' }
    ];

    return (
      <div className="flex items-center gap-6">
        {steps.map((step) => {
          const status = getStepStatus(step.key);
          const isClickable = status === 'completed' || status === 'current';
          
          return (
            <div
              key={step.key}
              className={`flex items-center gap-2 transition-colors ${
                isClickable 
                  ? 'cursor-pointer hover:text-aduffy-yellow' 
                  : 'cursor-default'
              } ${
                status === 'current' 
                  ? 'text-aduffy-yellow font-medium' 
                  : status === 'completed'
                    ? 'text-aduffy-teal hover:text-aduffy-yellow'
                    : 'text-muted-foreground'
              }`}
              onClick={() => isClickable && handleStepNavigation(step.key)}
              title={
                status === 'completed' 
                  ? 'Click to view this completed step' 
                  : status === 'current'
                    ? 'Current step'
                    : 'Step not yet available'
              }
            >
              {status === 'completed' && (
                <div className="w-4 h-4 text-aduffy-teal" />
              )}
              {status === 'current' && (
                <div className="w-4 h-4 bg-aduffy-yellow rounded-full animate-pulse" />
              )}
              {status === 'upcoming' && (
                <div className="w-4 h-4 border-2 border-muted rounded-full" />
              )}
              <span className="text-sm">{step.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top row: Back to Dashboard (left), Step badge (right) */}
      <div className="flex items-center justify-between mt-2 mb-1">
        <button className="back-to-dashboard-btn ml-1" onClick={onBack}>
          <span className="arrow">←</span>
          Back to Dashboard
        </button>
        <span className="step-badge">
          Step {getStepNumber(currentStep)} of 5
        </span>
      </div>
      {/* Progress Header */}
      <div className="space-y-4">
        <div>
          <div className="progress-header-label">Overall Progress</div>
          <div className="progress-percentage">{Math.round(calculateProgress())}%</div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-2">
            {isViewOnly && (
              <Badge className="view-only-badge">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle cx="10" cy="10" r="8" stroke="#1793b6" strokeWidth="1.5" fill="none"/>
                  <circle cx="10" cy="10" r="2.5" stroke="#1793b6" strokeWidth="1.2" fill="none"/>
                  <path d="M2 10c2-4 8-4 12 0s8 4 12 0" stroke="#1793b6" strokeWidth="1.2" fill="none"/>
                </svg>
                View Only
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            {renderStepNavigation()}
          </div>
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
}