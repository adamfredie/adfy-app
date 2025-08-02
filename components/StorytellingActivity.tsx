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
// import { Select } from "./ui/select";
import { OnboardingData } from "./Onboarding";
import { useVoiceInteraction } from "../hooks/useVoiceInteraction";
import { analyzeStoryWithGemini, generateVoiceResponse, generateVoiceResponseFromAudio } from '../src/api/gemini';
// import { CustomSelect } from "./ui/CustomSelect";
import ReactMarkdown from 'react-markdown';
// import { getGeminiExample } from '../src/api/gemini';
//Elevens Lab 
import { getElevenLabsAudio } from '../src/api/elevenlabs';
//RANDOM WORDS FROM GEMINI IMPORTS
import { getRandomWordsFromGemini, getGeminiExample } from '../src/api/gemini';
// IMORTING GEMINI FUNCTION FOR GENERATING RANDOM TOPIC
import { getRandomStoryTopics } from '../src/api/gemini';
// ... inside your component
// AUTO SCROLl
import { ScrollToTop } from "./ScrollToTop";




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

// Utility to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate learning questions dynamically from dailyWords
function generateLearningQuestions(words: DailyWord[]): LearningQuestion[] {
  return words.map((word, idx) => {
    // Get other words for incorrect options
    const otherWords = words.filter((_, i) => i !== idx);
    // Definition question
    const defOptions = shuffleArray([
      word.definition,
      ...otherWords.slice(0, 3).map(w => w.definition)
    ]);
    const defCorrect = defOptions.indexOf(word.definition);
    // Usage question
    const usageOptions = shuffleArray([
      word.example,
      ...otherWords.slice(0, 3).map(w => w.example)
    ]);
    const usageCorrect = usageOptions.indexOf(word.example);
    // Context question
    const contextOptions = shuffleArray([
      'Professional/business context',
      'At a party',
      'While cooking',
      'During sports'
    ]);
    const contextCorrect = contextOptions.indexOf('Professional/business context');
    // Example fill-in-the-blank
    const exampleSentence = word.example.replace(new RegExp(word.word, 'gi'), '_____');
    const exampleOptions = shuffleArray([
      word.word,
      ...otherWords.slice(0, 3).map(w => w.word)
    ]);
    const exampleCorrect = exampleOptions.indexOf(word.word);
    // Cycle through types for variety
    const types: LearningQuestion['type'][] = ['definition', 'usage', 'context', 'example'];
    const type = types[idx % types.length];
    switch (type) {
      case 'definition':
        return {
          id: `q${idx + 1}`,
          wordIndex: idx,
          question: `What does "${word.word}" mean?`,
          options: defOptions,
          correctAnswer: defCorrect,
          explanation: `The correct definition of "${word.word}" is: ${word.definition}`,
          type
        };
      case 'usage':
        return {
          id: `q${idx + 1}`,
          wordIndex: idx,
          question: `Which is a correct professional usage of "${word.word}"?`,
          options: usageOptions,
          correctAnswer: usageCorrect,
          explanation: `Example usage: ${word.example}`,
          type
        };
      case 'context':
        return {
          id: `q${idx + 1}`,
          wordIndex: idx,
          question: `In which context would you most likely use "${word.word}"?`,
          options: contextOptions,
          correctAnswer: contextCorrect,
          explanation: `"${word.word}" is typically used in professional contexts.`,
          type
        };
      case 'example':
        return {
          id: `q${idx + 1}`,
          wordIndex: idx,
          question: `Complete the sentence: ${exampleSentence}`,
          options: exampleOptions,
          correctAnswer: exampleCorrect,
          explanation: `The correct word is "${word.word}".`,
          type
        };
      default:
        return {
          id: `q${idx + 1}`,
          wordIndex: idx,
          question: `What does "${word.word}" mean?`,
          options: defOptions,
          correctAnswer: defCorrect,
          explanation: `The correct definition of "${word.word}" is: ${word.definition}`,
          type: 'definition'
        };
    }
  });
}
// MODAL FUNCTION
function AnalysisModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

export function StorytellingActivity({ 
  onBack, 
  userProfile, 
  savedProgress, 
  onProgressUpdate,
  onComplete 
}: StorytellingActivityProps) {
  const [storyAnalysis, setStoryAnalysis] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingRandomWords, setLoadingRandomWords] = useState(false);
  //GEMINI AUDIO USESTATE
  const [audioLoading, setAudioLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioSupported, setAudioSupported] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // AUTO SCROLL FOR VOICE CONVERSATION
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [transcript, setTranscript] = useState('');
// MODAL USE STATE VARIABLE
const [showAnalysisModal, setShowAnalysisModal] = useState(false);
 
//  FUNCTION FOR TURNING START WRITING INTO COMPLETE PRACTICE AND NEXT QUESTION
function getStepButtonProps() {
  if (currentStep === 'learning') {
    if (currentQuestionIndex < learningQuestions.length - 1) {
      return {
        label: 'Next Question',
        icon: '→',
        onClick: handleNextQuestion,
        disabled: showQuestionFeedback === false // Only enable after answering
      };
    } else {
      return {
        label: 'Complete Practice',
        icon: '✔',
        onClick: () => {
          setStepProgress(100);
          handleNextStep();
        },
        disabled: showQuestionFeedback === false // Only enable after answering
      };
    }
  }
  if (currentStep === 'writing') {
    return {
      label: 'Start Writing',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="#222b3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      onClick: handleNextStep,
      disabled: stepProgress < 100 && showLearningContent
    };
  }
  return null;
}
  // P-1 STARTS
// THIS PIECE OF CODE IS USED FOR RECORDING THE USER"S VOICE AND SENDING IT TO GEMINI IN AUDIO BLOB FORM AND THEN GETTING REPSONSE FROM GEMINI
  // Check audio recording support on mount
  useEffect(() => {
    setAudioSupported(!!window.MediaRecorder && !!navigator.mediaDevices);
  }, []);
  
  //GEMINI AUDIO FUNCTIONS
  const startRecording = async () => {
    setAudioBlob(null);
    //Speech-to-text (real-time transcript)
    startListening();
    try {
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error('Audio recording is not supported in this browser');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.start();
      setRecording(true);

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || audioChunksRef.current[0]?.type || '';
        console.log("MediaRecorder mimeType:", mimeType); // Optional: for debugging
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setRecording(false);
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        // setTranscript(transcribedText); // <-- Remove this line, transcript is set after AI response
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecording(false);
      if (error instanceof Error) {
        alert(`Could not start recording: ${error.message}`);
      } else {
        alert('Could not access microphone. Please check permissions.');
      }
    }
  };
  
  const stopRecording = () => {
    stopListening();
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
  };
  
  const stopAndSendToGemini = async () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      // The onstop handler will set the audioBlob, then we can send it
    }
  };
  //GEMINI AUDIO FUNCTIONS END
  
  // Function to send audio to Gemini and get response
  const sendAudioToGemini = async (audioBlob: Blob) => {
    if (isViewOnly) return;
    
    setAudioLoading(true);
    try {
      // Add a placeholder message to show recording was received
      const newConversation = [...voiceConversation];
      newConversation.push({
        type: 'user',
        content: "",
        timestamp: new Date(),
        isAudio: true
      });
      setVoiceConversation(newConversation);
      
      // Send audio to Gemini
      const aiResponse = await generateVoiceResponseFromAudio({
        audioBlob,
        conversationHistory: voiceConversation,
        vocabulary: dailyWords.map(w => w.word),
        topic: selectedTopic?.title,
        approvedWords,
      });
      console.log(aiResponse);
      // P-2 ENDS
      // APPROVED WORDS FUNCTION
      const approvedWordsMatch = aiResponse.match(/APPROVED_WORDS:\s*(\[.*?\])/s);
      if (approvedWordsMatch) {
        try {
          setApprovedWords(JSON.parse(approvedWordsMatch[1]));
        } catch (e) { /* handle error */ }
      }

      // Parse the response to extract transcription and AI response
      const transcriptionMatch = aiResponse.match(/TRANSCRIPTION:\s*(.+?)(?=\nRESPONSE:|$)/s);
      const responseMatch = aiResponse.match(/RESPONSE:\s*(.+?)(?=\n|$)/s);
      
      const transcription = transcriptionMatch ? transcriptionMatch[1].trim() : '[Audio message]';
      setTranscript(transcription);
      const aiResponseText = responseMatch ? responseMatch[1].trim() : aiResponse;
      
      // Create a NEW conversation array with the updated user message
      const updatedConversation = [...newConversation];
      const lastMessageIndex = updatedConversation.length - 1;
      
      // Replace the last message with a new object (don't mutate)
      updatedConversation[lastMessageIndex] = {
        ...updatedConversation[lastMessageIndex],
        content: transcription,
        wordsUsed: dailyWords.filter(word => 
          transcription.toLowerCase().includes(word.word.toLowerCase())
        )
      };
      
      // Update the conversation state - this will trigger the auto-scroll
      setVoiceConversation(updatedConversation);
      
      // Wait a moment before speaking the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // USED ELEVENLABS AUDIO FOR THE AI RESPONSE
      try {
        const audioBlob = await getElevenLabsAudio(aiResponseText);
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);
        await audio.play();
      } catch (ttsError) {
        // Fallback to browser TTS if ElevenLabs fails
        await safeSpeak(aiResponseText);
      }
      
      // Add AI response
      const finalConversation = [...updatedConversation];
      finalConversation.push({
        type: 'ai',
        content: aiResponseText,
        timestamp: new Date()
      });
      
      setVoiceConversation(finalConversation);
      
    } catch (error) {
      console.warn('Audio response error:', error);
      // Fallback response if Gemini fails
      const fallbackResponse = "I couldn't process your audio. Please try speaking again.";
      
      try {
        await safeSpeak(fallbackResponse);
      } catch (speechError) {
        console.warn('Speech error:', speechError);
      }
      
      const newConversation = [...voiceConversation];
      newConversation.push({
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date()
      });
      setVoiceConversation(newConversation);
    } finally {
      setAudioLoading(false);
      setAudioBlob(null);
    }
  };
  
  // Effect to automatically send audio when it's ready
  // useEffect(() => {
  //   if (audioBlob && !audioLoading) {
  //     sendAudioToGemini(audioBlob);
  //   }
  // }, [audioBlob, audioLoading]);
  //Event Handler
  async function handleAnalyzeStory() {
    setIsAnalyzing(true);
    try {
      console.log('Starting story analysis...');
      console.log('Story:', userStory);
      console.log('Topic:', selectedTopic?.title);
      console.log('Vocabulary:', dailyWords.map(w => w.word));
      
      const analysisText = await analyzeStoryWithGemini({
        story: userStory,
        topic: selectedTopic?.title || '',
        vocabulary: dailyWords.map(w => w.word)
      });
      
      console.log('Analysis text received:', analysisText);
      
      // Parse the text response into structured data
      const analysis = parseAnalysisResponse(analysisText);
      console.log('Parsed analysis:', analysis);
      
      setStoryAnalysis(analysis);
      if (isMobile) {
        setShowAnalysisModal(true);
      }
    } catch (err) {
      console.error('Story analysis error:', err);
      // Show error to user
      alert(`Failed to analyze story: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  }
  
  // Helper function to parse the Gemini API text response
  const parseAnalysisResponse = (text: string) => {
    try {
      //Mapping function
      // function mapLevelToScore(level: string) {
      //   if (!level) return 0;
      //   if (level.toLowerCase() === "high") return Math.floor(Math.random() * 16) + 85; // 85-100%
      //   if (level.toLowerCase() === "moderate") return Math.floor(Math.random() * 15) + 70; // 70-84%
      //   return Math.floor(Math.random() * 71);//0-70%
      // }
      // Extract scores using regex (now matches [60%] format)
      //OLD BLOCK
      const creativityMatch = text.match(/Creativity:\s*\[(\d+)%\]/);
      const grammarMatch = text.match(/Grammar:\s*\[(\d+)%\]/);
      const coherenceMatch = text.match(/Coherence:\s*\[(\d+)%\]/);
      const topicMatch = text.match(/Topic Match:\s*\[(\d+)%\]/);
      //NEW BLOCK
//       const creativityLevel = text.match(/Creativity:\s*(High|Moderate|Low)/i)?.[1] || "Moderate";
//       const grammarLevel = text.match(/Grammar:\s*(High|Moderate|Low)/i)?.[1] || "Moderate";
// const coherenceLevel = text.match(/Coherence:\s*(High|Moderate|Low)/i)?.[1] || "Moderate";
// const topicLevel = text.match(/Topic Match:\s*(High|Moderate|Low)/i)?.[1] || "Moderate";

      
      // Extract feedback (everything between "Overall Impression:" and the next section)
      const feedbackMatch = text.match(/\*\*Overall Impression:\*\*\s*([^*\n]+)/);
      
      // Extract suggestions (look for bullet points or numbered lists)
      const suggestionsMatch = text.match(/Suggestions for Improvement:[\s\S]*?([•\-\*]\s*[^\n]+(?:\n[•\-\*]\s*[^\n]+)*)/);
      
      // Extract the detailed feedback section (from #### 1. Creativity onward)
      const detailedFeedbackMatch = text.match(/(#+\s*1\. Creativity[\s\S]*)/);
      const detailedFeedback = detailedFeedbackMatch ? detailedFeedbackMatch[1].trim() : '';
      //OLD BLOCK
      const creativity = creativityMatch ? parseInt(creativityMatch[1]) : 75;
      const grammar = grammarMatch ? parseInt(grammarMatch[1]) : 80;
      const coherence = coherenceMatch ? parseInt(coherenceMatch[1]) : 75;
      const topicAdherence = topicMatch ? parseInt(topicMatch[1]) : 70;
      const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Good work on your story!';
      //NEW BLOCK
//       const creativity = mapLevelToScore(creativityLevel);
// const grammar = mapLevelToScore(grammarLevel);
// const coherence = mapLevelToScore(coherenceLevel);
// const topicAdherence = mapLevelToScore(topicLevel);
// const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Good work on your story!';
      // Parse suggestions
      let suggestions: string[] = [];
      if (suggestionsMatch) {
        suggestions = suggestionsMatch[1]
          .split('\n')
          .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
          .filter(line => line.length > 0);
      }
      
      // If no suggestions found, provide default ones
      if (suggestions.length === 0) {
        suggestions = [
          "Try to use all vocabulary words in your story for maximum learning benefit",
          "Consider adding more specific details about the challenges presented in the scenario",
          "Practice using the words in different sentence structures to enhance versatility"
        ];
      }
      
      return {
        creativity,
        grammar,
        coherence,
        topicAdherence,
        feedback,
        suggestions,
        detailedFeedback
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      // Return default structure if parsing fails
      return {
        creativity: 75,
        grammar: 80,
        coherence: 75,
        topicAdherence: 70,
        feedback: 'Good work on your story! Keep practicing to improve your vocabulary usage.',
        suggestions: [
          "Try to use all vocabulary words in your story for maximum learning benefit",
          "Consider adding more specific details about the challenges presented in the scenario",
          "Practice using the words in different sentence structures to enhance versatility"
        ],
        detailedFeedback: ''
      };
    }
  };
  
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
  // AUTO SCROLL
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // AUTO_SCROLL VOICE CONVERSATION PAGE
  const conversationCardRef = useRef<HTMLDivElement | null>(null);
  // FOR STORING WORDS GENERATED RANDOMLY BY GEMINI
  const [previousWords,setPreviousWords]=useState<string[]>([])
  // APPROVED WORDS
  const [approvedWords, setApprovedWords] = useState<string[]>([]);
  // VOICE CONVERSATION AUTO SCROLL FUNCTION
  const scrollToConversationCard = () => {
    if (conversationCardRef.current) {
      // conversationCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // conversationCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      conversationCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  

    // AUTO SCROLL FOR VOICE CONVERSATION TEXT BOX ENDS
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
    transcript: voiceTranscript, 
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
  // AUTO SCROLL FOR VOICE CONVERSATION TEXT BOX
  useEffect(() => {
    if (chatContainerRef.current) {
      // Scroll immediately when conversation updates
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [voiceConversation]);

  useEffect(() => {
    if (chatContainerRef.current && voiceTranscript) {
      // Scroll immediately when transcript updates
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [voiceTranscript]);

  // Add a more robust auto-scroll function
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [voiceConversation, scrollToBottom]); 


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

 
 //This is the old block for safeSpeak 
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
        utterance.rate = 0.9;
        utterance.pitch = 1.05;
        utterance.volume = 0.95;
              // Get available voices
      // const voices = window.speechSynthesis.getVoices();
       // Try to find a high-quality English voice
      //  utterance.voice =
      //  voices.find(v => v.name.includes("Google") && v.lang === "en-US") ||
      //  voices.find(v => v.name.includes("Microsoft") && v.lang === "en-US") ||
      //  voices.find(v => v.lang === "en-US") ||
      //  voices[0];


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
           // Sometimes voices are not loaded immediately, so ensure they're loaded
      // if (voices.length === 0) {
      //   window.speechSynthesis.onvoiceschanged = () => {
      //     const loadedVoices = window.speechSynthesis.getVoices();
      //     utterance.voice =
      //       loadedVoices.find(v => v.name.includes("Google") && v.lang === "en-US") ||
      //       loadedVoices.find(v => v.name.includes("Microsoft") && v.lang === "en-US") ||
      //       loadedVoices.find(v => v.lang === "en-US") ||
      //       loadedVoices[0];
      //     window.speechSynthesis.speak(utterance);
      //   };
      // } else {
      //   setTimeout(() => {
      //     window.speechSynthesis.speak(utterance);
      //   }, 100);
      // }

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
    // Always generate words if we don't have any or if the field changed
    if (!dailyWords || dailyWords.length === 0) {
      const words = generateVocabularyWords(selectedField);
      setDailyWords(words);
    }
  }, [selectedField, savedProgress]);

  // Generate learning questions and story topics
  useEffect(() => {
    if (dailyWords && dailyWords.length > 0) {
      setLearningQuestions(generateLearningQuestions(dailyWords));
    }
  }, [dailyWords]);

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
    const baseProgress = ((currentStepNum ) / 5) * 100;
    
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
//Event Handler
  const handleStepNavigation = (step: StepType) => {
    const status = getStepStatus(step);
    
    // Only allow navigation to completed steps or current step
    if (status === 'completed' || status === 'current') {
      setCurrentStep(step);
    }
  };
//Event Handler
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
//Event Handler
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
//Event Handler
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
//Event Handler
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
// OLD GENERATING RANDOM TOPIC 
  // const regenerateTopic = () => {
  //   // Don't allow regeneration in view-only mode
  //   if (isViewOnly) return;
    
  //   setIsGeneratingTopic(true);
  //   setSelectedTopic(null);
    
  //   setTimeout(() => {
  //     // Filter out the currently selected topic to ensure we get a different one
  //     const availableTopics = storyTopics.filter(topic => topic.id !== selectedTopic?.id);
  //     const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
  //     setSelectedTopic(randomTopic);
  //     setIsGeneratingTopic(false);
  //   }, 1500);
  // };
  // NEW GENERATING RANDOM TOPIC FUNCTION
  const regenerateTopic = async () => {
    if (isViewOnly) return;
    setIsGeneratingTopic(true);
    setSelectedTopic(null);
  
    try {
      // Fetch 1 random topic from Gemini
      const topics = await getRandomStoryTopics(1);
      if (topics && topics.length > 0) {
        setSelectedTopic(topics[0]);
      }
    } catch (error) {
      alert('Could not fetch a new topic from Gemini.');
    }
    setIsGeneratingTopic(false);
  };

//Event Handler
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
//Event Handler
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
      // const initialPrompt = selectedTopic 
      //   ? `Hello ${userProfile?.name} Let's have a conversation about your approach to this scenario I'll ask you questions and you should try to use each of our vocabulary words in your responses Here is the first question:How did you decide on your approach to handling this professional challenge?`
      //   : `Hello ${userProfile?.name} Let's have a conversation about your approach to this scenario I'll ask you questions and you should try to use each of our vocabulary words in your responses Here is the first question:How did you decide on your approach to handling this professional challenge?`;
      const intro = `Hello ${userProfile?.name}! Let's have a conversation about your approach to this scenario. I'll ask you questions and you should try to use each of our vocabulary words in your responses.`;
const firstQuestion = `Here is the first question: How did you decide on your approach to handling this professional challenge?`;
      // console.log('Speaking initial prompt:', initialPrompt);
      console.log('Speaking initial prompt:', intro,firstQuestion);
      
      // First set the conversation state
      // setVoiceConversation([
      //   { type: 'ai', content: initialPrompt, timestamp: new Date() }
      // ]);
      setVoiceConversation([
        { type: 'ai', content: intro, timestamp: new Date() },
        // { type: 'ai', content: firstQuestion, timestamp: new Date() }
      ]);
      
      // Then speak the prompt with error handling
      // await safeSpeak(initialPrompt);
      // USED ELEVENLABS FOR INITIAL PROMPT
      try {
        // const audioBlob = await getElevenLabsAudio(initialPrompt);

        // const url = URL.createObjectURL(audioBlob);
        // const audio = new Audio(url);
        // await audio.play();
        // NEW BLOCK
         // Play intro
  const audioBlob1 = await getElevenLabsAudio(intro);
  const url1 = URL.createObjectURL(audioBlob1);
  const audio1 = new Audio(url1);
  await audio1.play();
// OLD BLOCK
  // 3. After intro is spoken, add the first question to the conversation
  // setVoiceConversation(prev => [
  //   ...prev,
  //   { type: 'ai', content: firstQuestion, timestamp: new Date() }
  // ]);

  // Play first question after intro finishes
  // const audioBlob2 = await getElevenLabsAudio(firstQuestion);
  // const url2 = URL.createObjectURL(audioBlob2);
  // const audio2 = new Audio(url2);
  // await audio2.play();
  // OLD BLOCK ENDED
  audio1.onended = async () => {
    // 3. After intro finishes, add first question to chat
    setVoiceConversation(prev => [
      ...prev,
      { type: "ai", content: firstQuestion, timestamp: new Date() }
      
    ]);
   const audioBlob2 = await getElevenLabsAudio(firstQuestion);
  const url2 = URL.createObjectURL(audioBlob2);
  const audio2 = new Audio(url2);
  await audio2.play();
}
      } catch (ttsError) {
        // Fallback to browser TTS if ElevenLabs fails
        // await safeSpeak(initialPrompt);
        await safeSpeak(intro);
        // await safeSpeak(firstQuestion);
        setVoiceConversation(prev => [
          ...prev,
          { type: 'ai', content: firstQuestion, timestamp: new Date() }
        ]);
        await safeSpeak(firstQuestion);
      }
      
    } catch (error) {
      console.warn('Voice conversation start error:', error);
      // Continue even if speech fails - user can still see the text
    }
  };
//Event Handler
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
    //This is for calculating the learning score upto 25 points
    const learningScore = (correctAnswers / learningQuestions.length) * 25;
    //The is for calculating the story score upto 35 points
    const storyScore = storyAnalysis ? 
      ((storyAnalysis?.creativity || 0) + (storyAnalysis?.grammar || 0) + (storyAnalysis?.coherence || 0) + (storyAnalysis?.topicAdherence || 0)) / 4 * 0.35 : 0;
    // This is for calculating the voice score upto 40
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
    if (!audioSupported) {
      return (
        <Alert className="mb-6">
          <div className="text-muted-foreground text-sm mt-2">
            Audio recording is not supported in this browser. Please use Chrome, Safari, or Edge for the best experience with voice conversations.
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
            <span>Microphone access is required for audio recording and voice conversations.</span>
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
                // <Badge className="aduffy-badge-info ml-2">
                <Badge className="view-only-badge">
                  <div className="w-3 h-3 mr-1 text-muted-foreground" />
                  View Only
                </Badge>
              )}
            </div>
          </div>
        </div>
        {/* <p className="text-lg text-muted-foreground max-w-2xl mx-auto"> */}
        <p>
          Master these 5 carefully selected vocabulary words to enhance your professional communication skills.
        </p>
      </div>
       <div className="generate-random-words-container">
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <button
             
            // Event handler for generating random words
            onClick={async () => {
              if (isViewOnly) return;
              setLoadingRandomWords(true);
              try {
                // Get random words from Gemini
                const geminiWords = await getRandomWordsFromGemini(5,previousWords);
                
                // Optionally, get example sentences for each word
                const wordsWithExamples = await Promise.all(
                  geminiWords.map(async (w: any) => ({
                    ...w,
                    example: await getGeminiExample(w.word, w.definition),
                    difficulty: 'beginner' // or set based on your logic
                  }))
                );
                // NEW BLOCK
                const newWordStrings = wordsWithExamples.map(w => w.word.toLowerCase());
setPreviousWords(prev => [...prev, ...newWordStrings]);
// NEW BLOCK ENDED
                setDailyWords(wordsWithExamples);
              } catch (err) {
                alert('Could not fetch random words from Gemini.');
              }
              setLoadingRandomWords(false);
            }}
              
              disabled={isViewOnly || loadingRandomWords}
              className={`btn-outline-teal${isViewOnly ? ' opacity-60' : ''}`}
              
            >
              {loadingRandomWords ? 'Loading...' : 'Generate Random Words'}
            </button>
          </div>
          </div>
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
          // Return Button View Only
          <Button onClick={handleReturnToFurthest} className="return-btn">
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
                {/*INTERACTIVE BADGE IN THE LEARNING PAGE */}
              <span className="info-badge">
                <span className="info-badge-icon" aria-hidden="true">
                  {/* SVG icon for target/interactive */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#14b8a6" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="5" stroke="#14b8a6" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="1.5" fill="#14b8a6"/>
                  </svg>
                </span>
                Interactive Learning
              </span>
              </Badge>
              {isViewOnly && (
                // <Badge className="aduffy-badge-info ml-2">
                <Badge className="view-only-badge">
                  <div className="w-3 h-3 mr-1 text-muted-foreground" />
                  View Only
                </Badge>
              )}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
        {/* <p className="text-lg text-muted-foreground max-w-2xl mx-auto"> */}
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
            Questions ({learningQuestions.length})
          </TabsTrigger>
          <TabsTrigger tabValue="story" className="tabs-trigger">
            <div className="w-4 h-4 mr-2 text-aduffy-yellow" />
            Example Story
          </TabsTrigger>
        </TabsList>
        
        <TabsContent tabValue="questions" className="space-y-6 mt-8">
          {showLearningContent && learningQuestions.length > 0 && (
            <Card className="aduffy-card quiz-question-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-aduffy-navy quiz-question-card-title">
                      Question {currentQuestionIndex + 1} of {learningQuestions.length}
                      {isViewOnly && <div className="w-4 h-4 ml-2 inline text-muted-foreground" />}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {dailyWords[learningQuestions[currentQuestionIndex]?.wordIndex]?.word} - {learningQuestions[currentQuestionIndex]?.type}
                    </CardDescription>
                  </div>
                  {/* PRACTICE BADGE IN LEARNING PAGE */}
                  <div className="badges-column">
                  {/* NO>OF CORRECT QUESTIONS BADGE */}
                  <div className="badges-row">
                  {questionResults.length>0 &&(
                  <Badge className="correct-answers-badge-soft">
                  {/* <span>Correct Answers: </span> */}
                  <span>Scores: &nbsp;</span>
                  <span>
                  {/* <span className="font-medium text-success"> */}
                    {questionResults.filter(r => r.isCorrect).length} / {questionResults.length}
                  </span>
                  </Badge>)} 
                  {/* ACCURACY BADGE */}
                  {/* {questionResults.length>0 &&(
                  <Badge className="accuracy-badge-soft">
                  <span>Accuracy: </span>
                  <span>
                    {Math.round((questionResults.filter(r => r.isCorrect).length / questionResults.length) * 100)}%
                  </span>
                  </Badge>
                  )} */}
                  </div>
                  </div>
                </div>
                {/* PROGRESS BAR FOR THE QUIZ */}
                <Progress value={(currentQuestionIndex / learningQuestions.length) * 100} className="mt-4 quiz-progress-bar" />
              </CardHeader>
              {/* THIS IS THE QUIZ QUESTION CARD*/}
              <CardContent className="space-y-6">
                <div className="text-lg font-medium text-aduffy-navy">
                  {/* This line displays the text of the current learning question in your quiz */}
                  {learningQuestions[currentQuestionIndex]?.question}
                </div>
                
                <div className="grid ">
                {/* <div className="grid grid-cols-1 gap-3"> */}
                  {learningQuestions[currentQuestionIndex]?.options.map((option, index) => {
                    // HIGHLIGHTING THE OPTION THAT IS BEING SELECTED
                    const lastResult = questionResults[questionResults.length - 1];
                    const isCurrentQuestionAnswered = lastResult && lastResult.questionId === learningQuestions[currentQuestionIndex]?.id;
                    const isSelected = isCurrentQuestionAnswered && lastResult.userAnswer === index;
                    
                    const isCorrect = index === learningQuestions[currentQuestionIndex].correctAnswer;
                    return (
                      <div
                        key={index}
                        // FOR STYLING TEH CORRECT AND INCORRECT OPTION
                        className={`quiz-option
                          ${isSelected ? ' selected' : ''}
                          ${isCorrect && (showQuestionFeedback || isViewOnly) ? ' correct' : ''}
                          ${isSelected && !isCorrect && showQuestionFeedback ? ' incorrect' : ''}
                          ${isViewOnly ? ' cursor-default' : ''}
                        `}
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
                  <div className={`quiz-feedback ${currentQuestionResult.isCorrect ? 'correct' : 'quiz-feedback-incorrect'}`}>
                    <div className="quiz-feedback-header">
                      {currentQuestionResult.isCorrect ? (
                        <>
                          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#22b573" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Correct!
                        </>
                      ) : (
                        <>
                          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span className="text-error" style={{marginLeft: 6}}>Incorrect</span>
                        </>
                      )}
                    </div>
                    <div className="quiz-feedback-explanation">
                      {currentQuestionResult.explanation}
                    </div>
                    {/* CURRENT INDEX LESS THAN 4 NEXT QUESTION BUTTON IS DISPLAY WHEN IT REACHES 5 COMPLETE PRACTICE IS SHOWN WHICH TAKES THE USER TO THE NEXT STEP */}
                    {/* {!isViewOnly && (
                    currentQuestionIndex < learningQuestions.length - 1 ? (
                      <button className="quiz-feedback-btn" onClick={handleNextQuestion}>
                        Next Question
                        <span style={{ display: 'inline-block', transform: 'translateY(1px)' }}>→</span>
                      </button>
                    ) : (
                      <button
                        className="quiz-feedback-btn"
                        onClick={() => {
                          setStepProgress(100);
                          handleNextStep(); // or your function to move to the next step
                        }}
                      >
                        Complete Practice
                        <span style={{ display: 'inline-block', transform: 'translateY(1px)' }}>✔</span>
                      </button>
                    )
                  )} */}
                  </div>
                )}
              
              </CardContent>
            </Card>
          )}
          {/* FEEDBACK SECTION */}
          {/* {questionResults.length > 0 && (
            <Card className="aduffy-card progress-summary-card">
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
          )} */}
        </TabsContent>
{/* This is the example story tab */}
        <TabsContent tabValue="story" className="space-y-6 mt-8">
          {showLearningContent && (
            <Card className="example-story-card progress-summary-card">
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
                  {/* <Button className="listen-story-btn" >
                    <span className="mr-2">🔊</span> Listen to Story
                  </Button> */}
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
            {/* <button
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
            </button> */}
            {/* NEW START WRITING COMPLETE PRACTICE BUTTON */}
             {stepButton && (
      <button
        className="start-writing-btn"
        onClick={stepButton.onClick}
        disabled={stepButton.disabled}
        type="button"
      >
        <span className="start-writing-icon" style={{ marginRight: 8 }}>
          {typeof stepButton.icon === 'string'
            ? <span style={{ display: 'inline-block', transform: 'translateY(1px)' }}>{stepButton.icon}</span>
            : stepButton.icon}
        </span>
        {stepButton.label}
      </button>
    )}
          </>
        ) : (
          <div className="flex w-full justify-center">
            {/* Return Button View Only */}
            <Button onClick={handleReturnToFurthest} className="return-btn">
            {/*Return Button View Only */}
              <div className="w-4 h-4 mr-2 text-aduffy-yellow" />
              Return to {furthestStep.charAt(0).toUpperCase() + furthestStep.slice(1)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
// Writing Step Starts here
  const renderWritingStep = () => (
    <div className="space-y-8">
      {/* It is a helper function that displays an alert message when the app is in "view-only" mode */}
      {renderViewOnlyAlert()}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-aduffy-orange/10 rounded-full flex items-center justify-center border-2 border-aduffy-orange/20">
            <div className="w-8 h-8 text-aduffy-orange" />
          </div>
          <div className="text-left">
            {/* <h2 className="storytelling-welcome-title">Write Your Story</h2> */}
            <h2 className="ai-guided-title">
            <span className="ai-guided-icon" aria-hidden="true">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M12 17.25L7.09 20l.93-5.43L4 10.97l5.46-.79L12 5.5l2.54 4.68 5.46.79-3.97 3.6.93 5.43z"
                  stroke="#222b3a" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              </svg>
            </span>
            AI-Guided Writing
          </h2>
            <div className="flex justify-center mt-1">
              {isViewOnly && (
                <Badge className="view-only-badge">
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
      <div className="story-main-grid gap-8">
        <div className="space-y-6">
          {/* AI-Generated Story Topic */}
          <Card className="aduffy-card ai-story-card-content">
            <CardHeader>
              <div className="ai-story-card-title ">
                <span role="img" aria-label="lightbulb">💡</span>
                Your Story Topic
                {selectedTopic && !isViewOnly && (
                  <button
                    onClick={regenerateTopic}
                    disabled={isGeneratingTopic}
                    className="ai-story-new-topic-btn "
                  >
                    {isGeneratingTopic ? 'Generating...' : 'Change Topic'}
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* CONTEXT AND TEH CHALLENGE GENERATED BY THE NEW TOPIC */}
              <div className="story-context-box">
              <div className="story-context-title">{selectedTopic?.title}</div>
              <div className="story-context-scenario">{selectedTopic?.scenario}</div>
              <div>
                <span className="story-context-label">Context:</span>
                <span className="story-context-value"> {selectedTopic?.context}</span>
              </div>
              <div>
                <span className="story-context-label">Your Challenge:</span>
                <span className="story-context-value"> {selectedTopic?.challenge}</span>
              </div>
            </div>

             
              {/* WRITING INSTRUCTION BLOCK*/}
              <div className="writing-instructions-box">
                <span className="writing-instructions-icon" aria-hidden="true">✨</span>
                <div className="writing-instructions-content">
                  <span className="writing-instructions-title">Writing Instructions:</span>
                  <span className="writing-instructions-desc">
                    {isViewOnly
                      ? `You successfully incorporated all 5 vocabulary words into this scenario: ${dailyWords.map(w => w.word).join(', ')}`
                      : `Create a compelling narrative that addresses this scenario while naturally incorporating all 5 vocabulary words: ${dailyWords.map(w => w.word).join(', ')}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Story Writing Area */}
          {/* <div className="story-card-writing"> */}
          <div className="professional-story-card">
            {/* <div className="story-card-writing-title">Your Professional Story</div>
             */}
               <div className="professional-story-title">Your Professional Story</div>
            {/* <div className="story-card-writing-desc"> */}
            <div className="professional-story-desc">
              {/* {selectedTopic
                ? `Write your story based on "${selectedTopic.title}" using all 5 vocabulary words`
                : 'Write your story using all 5 vocabulary words'} */}
                <p>Write a story and include all the vocabulary words</p>
            </div>
            <Textarea
              placeholder={selectedTopic
                ? (isViewOnly ? "Your story is displayed above..." : `Start your story about \"${selectedTopic.title}\" here... Remember to incorporate all vocabulary words naturally into your narrative while addressing the challenge presented.`)
                : 'Start your story here... Remember to incorporate all vocabulary words naturally into your narrative while addressing the challenge presented.'}
              value={userStory}
              onChange={(e) => !isViewOnly && setUserStory(e.target.value)}
              // className={`story-textarea${isViewOnly ? ' opacity-60' : ''}`}
              className="professional-story-textarea"
              readOnly={isViewOnly}
              // TO PREVENT PASTING
              onPaste={e => e.preventDefault()} 
            />

            {/* FOR MOBILE VOCAB WORDS */}
        {/* Mobile-only vocab checklist row */}
          <div className="mobile-vocab-row">
            {dailyWords && dailyWords.length > 0 ? dailyWords.map((word, index) => {
              const isUsed = userStory.toLowerCase().includes(word.word.toLowerCase());
              return (
                <div key={index} className={`mobile-vocab-pill${isUsed ? ' used' : ''}`}>
                  <span className="mobile-vocab-word">{word.word}</span>
                  {isUsed && (
                    <span className="mobile-vocab-check">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </div>
              );
            }) : (
              <span>Loading...</span>
            )}
          </div>
            <div className="professional-story-footer">
            {/* <div className="flex items-center justify-between text-xs text-muted-foreground mt-2"> */}
              <span>Words: {userStory.split(' ').filter(word => word.trim()).length}</span>
              <span>Vocabulary used: {dailyWords.filter(word => userStory.toLowerCase().includes(word.word.toLowerCase())).length}/{dailyWords.length}</span>
            </div>
          </div>
          <div className="ai-analysis-desktop">
          {storyAnalysis && (
            <Card className="aduffy-card bg-gradient-to-br from-aduffy-yellow/5 to-transparent mobile-padding-feedback">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-aduffy-navy">
                  <div className="w-6 h-6 text-aduffy-yellow" />
                  AI Story Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="ai-analysis-card space-y-6">
                {/* <div className="ai-analysis-header">
                  <svg className="ai-analysis-trophy" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4V2h14v2h3v2c0 3.31-2.69 6-6 6h-2v2.09A7.001 7.001 0 0 1 12 22a7.001 7.001 0 0 1-2-13.91V10H8c-3.31 0-6-2.69-6-6V4h3zm2 0v2c0 2.21 1.79 4 4 4s4-1.79 4-4V4H7zm-3 2c0 2.21 1.79 4 4 4h2V4H4v2zm16-2h-6v4h2c2.21 0 4-1.79 4-4V4z"/></svg>
                  <span>AI Story Analysis</span>
                </div> */}
                <div className="ai-analysis-scores-row">
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-creativity">{storyAnalysis?.creativity || 0}%</div>
                    <div className="ai-analysis-label">Creativity</div>
                  </div>
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-grammar">{storyAnalysis?.grammar || 0}%</div>
                    <div className="ai-analysis-label">Grammar</div>
                  </div>
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-coherence">{storyAnalysis?.coherence || 0}%</div>
                    <div className="ai-analysis-label">Coherence</div>
                  </div>
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-topic">{storyAnalysis?.topicAdherence || 0}%</div>
                    <div className="ai-analysis-label">Topic Match</div>
                  </div>
                </div>
                <hr className="ai-analysis-divider" />
                <div>
                  <h4 className="font-medium text-aduffy-navy mb-2">Feedback</h4>
                  <p className="text-muted-foreground">{storyAnalysis?.feedback || 'No feedback available.'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-aduffy-navy mb-2">Suggestions for Improvement</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {storyAnalysis?.suggestions && storyAnalysis.suggestions.length > 0 ? storyAnalysis.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-aduffy-yellow rounded-full mt-2 flex-shrink-0"></div>
                        {suggestion}
                      </li>
                    )) : (
                      <li className="text-muted-foreground">No specific suggestions available.</li>
                    )}
                  </ul>
                </div>
                {/* Render detailed feedback as markdown */}
                {/* {storyAnalysis?.detailedFeedback && (
                  <div className="ai-analysis-detailed-feedback mt-6">
                    <ReactMarkdown>{storyAnalysis.detailedFeedback}</ReactMarkdown>
                  </div>
                )} */}
                {/* NEW SHORT FEEDBACK */}
                {/* <p className="text-muted-foreground">{storyAnalysis?.feedback || 'No feedback available.'}</p> */}
              </CardContent>
            </Card>
          )}
        </div>
        </div>
          {/* MODAL SHOW BUTTON */}
          {storyAnalysis && (
  <div className="ai-analysis-mobile">
    {/* <button className="ai-analysis-popup-btn" onClick={() => setShowAnalysisModal(true)}>
      View AI Feedback
    </button> */}
                <AnalysisModal open={showAnalysisModal} onClose={() => setShowAnalysisModal(false)}>
        <Card className="aduffy-card bg-gradient-to-br from-aduffy-yellow/5 to-transparent">
        <div className="w-6 h-6 text-aduffy-yellow" />
                <div className="ai-analysis-header">
                  <svg className="ai-analysis-trophy" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4V2h14v2h3v2c0 3.31-2.69 6-6 6h-2v2.09A7.001 7.001 0 0 1 12 22a7.001 7.001 0 0 1-2-13.91V10H8c-3.31 0-6-2.69-6-6V4h3zm2 0v2c0 2.21 1.79 4 4 4s4-1.79 4-4V4H7zm-3 2c0 2.21 1.79 4 4 4h2V4H4v2zm16-2h-6v4h2c2.21 0 4-1.79 4-4V4z"/></svg>
                  <span>AI Story Analysis</span>
                </div>
                <div className="ai-analysis-scores-row">
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-creativity">{storyAnalysis?.creativity || 0}%</div>
                    <div className="ai-analysis-label">Creativity</div>
                  </div>
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-grammar">{storyAnalysis?.grammar || 0}%</div>
                    <div className="ai-analysis-label">Grammar</div>
                  </div>
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-coherence">{storyAnalysis?.coherence || 0}%</div>
                    <div className="ai-analysis-label">Coherence</div>
                  </div>
                  <div className="text-center">
                    <div className="ai-analysis-score ai-analysis-score-topic">{storyAnalysis?.topicAdherence || 0}%</div>
                    <div className="ai-analysis-label">Topic Match</div>
                  </div>
                </div>
                <hr className="ai-analysis-divider" />
                <div>
                  <h4 className="font-medium text-aduffy-navy mb-2">Feedback</h4>
                  <p className="text-muted-foreground">{storyAnalysis?.feedback || 'No feedback available.'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-aduffy-navy mb-2">Suggestions for Improvement</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {storyAnalysis?.suggestions && storyAnalysis.suggestions.length > 0 ? storyAnalysis.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-aduffy-yellow rounded-full mt-2 flex-shrink-0"></div>
                        {suggestion}
                      </li>
                    )) : (
                      <li className="text-muted-foreground">No specific suggestions available.</li>
                    )}
                  </ul>
                </div>
                </Card>
              </AnalysisModal>
              </div>
          )}
              {/* AI ANALYSIS VOCABULARY WORD CHECKLIST STARTS */}
        <div className="space-y-6">
          <div className="vocab-checklist-card">
            <div className="vocab-checklist-title">Vocabulary Checklist</div>
            <div className="vocab-checklist-desc">
              {isViewOnly ? 'Words you used in your story' : "Track which words you've used in your story"}
            </div>
            <div className="vocab-checklist-list">
              {dailyWords && dailyWords.length > 0 ? dailyWords.map((word, index) => {

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
              }) : (
                <div className="text-center text-muted-foreground py-4">
                  <div className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-sm">Loading vocabulary words...</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {!isViewOnly ? (
              <>
                <Button
                  onClick={handleAnalyzeStory}
                  disabled={!userStory.trim() || isAnalyzing || !selectedTopic}
                  className="analyze-story-btn"
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

                {/* CONTINUE TO VOICE CHAT BUTTON */}
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
              // Return Button View Only
              <div className="flex w-full justify-center">
              <Button onClick={handleReturnToFurthest} className="return-btn">
                <div className="w-4 h-4 mr-2 text-aduffy-yellow" />
                Return to {furthestStep.charAt(0).toUpperCase() + furthestStep.slice(1)}
              </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

// Writing Step Starts here
  {/* VOICE VOCABULARY WORD CHECKLIST ENDS */}
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
            {isViewOnly && (
                // <Badge className="aduffy-badge-info ml-2">
                <Badge className="view-only-badge">
                  <div className="w-3 h-3 mr-1 text-muted-foreground" />
                  View Only
                </Badge>
              )}
            </div>
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isViewOnly 
            ? "Review your completed voice conversation with AI. All interactions are shown in view-only mode."
            : "Have a natural conversation with AI about your story using audio. Record your voice and try to use each vocabulary word in your responses."
          }
        </p>
      </div>

      {renderVoicePermissionAlert()}

      <div className="conversation-main-grid">
        {/* LEFT: VOICE CONVERSATION*/}
        <div className="conversation-panel" ref={conversationCardRef}>
          <Card className="aduffy-card">
            <CardHeader>
              <CardTitle className="text-aduffy-navy">Conversation</CardTitle>
            </CardHeader>
            {/* .CONVERSATION AREA */}
            <CardContent className="space-y-4">
              <div className="scrollable-fixed"  ref={chatContainerRef}>
                {voiceConversation.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <div className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>
                      {isViewOnly 
                        ? "No conversation data available to display"
                        : 'Click "Start Conversation" to begin the voice interaction'
                      }
                    </p>
                   
                  </div>
                ) : (
                  voiceConversation.map((message, index) => ( 
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* ADDED INDENTATION */}
                      <div className={`chat-bubble ${message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>

                        <p>
                          {/* OLD BLOCK */}
                          {message.isAudio ? (
                            <span className="flex items-center gap-2">
  
                              {message.content}
                            </span>
                          ) : (
                            message.content
                          )}
                
                        </p>
                        
                        {/* {message.wordsUsed && message.wordsUsed.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.wordsUsed.map((word: any, wordIndex: number) => (
                              <Badge key={wordIndex} className="aduffy-badge-success text-xs">
                                {word.word}
                              </Badge>
                            ))}
                          </div>
                        )} */}
                        {/* This is used for displaying the time in the chat */}
                        <div className="chat-timestamp">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {/* NEW BLOCK */}
                {!isViewOnly && voiceTranscript && (
                <div className="flex justify-end">
                  <div className="chat-bubble chat-bubble-user">
                    {/* <div className="p-2 bg-muted/50 rounded-lg"> */}
                      {/* <div className="text-xs text-muted-foreground mb-1">Your speech (live):</div> */}
                      <p className="text-sm">{voiceTranscript}</p>
                    </div>
                  {/* </div> */}
                </div>
                  )}
                  {/* new blcok neds */}
                  </div>
                  {/* CONVERSATION AREA ENDS */}
                  {/* MOBILE VERSION VOCABULARY CHECKLIST */}
                  {/* Mobile-only word usage checklist */}
                  <div className="mobile-word-usage-row">
                    {dailyWords.map((word, index) => {
                      // const isUsedInConversation = voiceConversation.some(msg => 
                      //   msg.type === 'user' && 
                      //   (msg.content.toLowerCase().includes(word.word.toLowerCase()) || 
                      //     (msg.wordsUsed && msg.wordsUsed.some((w) => w.word.toLowerCase() === word.word.toLowerCase())))
                      // );
    const isApproved = approvedWords.includes(word.word);

    return (
      <div key={index} className={`mobile-word-pill${isApproved ? ' used' : ''}`}>
        <span className="mobile-word-text">{word.word}</span>
        {isApproved && (
          <span className="mobile-word-check">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>
     
    );
  })}
</div>

              {/* Audio recording controls */}
              {!isViewOnly && (
                <div className="flex items-center gap-4 mt-4">
                  {voiceConversation.length === 0 ? (
                    <button
                      type="button"
                      className="orange-action-btn"
                      onClick={startVoiceConversation}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight: 8, display: 'inline-block', verticalAlign: 'middle'}}><path d="M8 5v14l11-7z" fill="#222"/></svg>
                      Start Conversation
                    </button>
                  ) : (
                    <>
                      {audioSupported ? (
                        <button
                          type="button"
                          onClick={recording ? stopRecording : startRecording}
                          className="orange-action-btn"
                          disabled={audioLoading}
                        >
                          {recording ? (
                            <>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight: 8, display: 'inline-block', verticalAlign: 'middle'}}>
                                <rect x="6" y="6" width="12" height="12" rx="2" fill="#222" />
                              </svg>
                              {/* Listening */}
                              {audioLoading ? 'Thinking' : 'Listening'}
                            </>
                          ) : (
                            <>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight: 8, display: 'inline-block', verticalAlign: 'middle'}}>
                                <path d="M8 5v14l11-7z" fill="#222"/>
                              </svg>
                              {/* {audioLoading ? 'Listening...' : 'Talk'} */}
                              {audioLoading ? 'Thinking...' : 'Talk'}
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Audio recording not supported in this browser
                        </div>
                      )}
                      
                      {/* {audioLoading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Sending to AI...
                        </div>
                      )} */}
                      {audioBlob && !audioLoading && (
                        <button
                          type="button"
                          className="orange-action-btn"
                          onClick={handleSubmitAudio}
                        >
                          Submit
                        </button>
                      )}
                      
                    </>
                  )}
                </div>
              )}
               {/* NEW BLOCKS VOICE TRANSCRIPT*/}
               {/* OLD BLOCK OF VOICE TRANSCRIPT */}
               {/* {!isViewOnly &&  voiceTranscript && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Your speech:</div>
                  <p className="text-sm">{voiceTranscript}</p>
                </div>
              )} */}
            </CardContent>
          </Card>
        </div>
        {/* COMPLETE AND GET RESULT BUTTON FOR MOBILE VERSION */}
<button
     type="button"
     onClick={handleNextStep}
     className="w-full soft-yellow-btn mobile-only-btn"
     disabled={voiceConversation.filter(msg => msg.type === 'user').length < 2}
   >
     <span className="soft-yellow-arrow">&#8594;</span>
     Complete &amp; Get Results
   </button>

        {/* Right: Word Usage Goal */}
        {/* CHECK LIST FOR VOICE CONVERSATION*/}
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
                // Checks if the word is used
                // const isUsedInConversation = voiceConversation.some(msg => 
                //   msg.type === 'user' && 
                //   (msg.content.toLowerCase().includes(word.word.toLowerCase()) || 
                //    (msg.wordsUsed && msg.wordsUsed.some((w: any) => w.word.toLowerCase() === word.word.toLowerCase())))
                // );
                const isApproved = approvedWords.includes(word.word);
                return (
                  <div key={index} className="word-usage-card">
                    {/* Displays the word and definition */}
                    <div className="word-usage-info">
                      <div className="word-usage-title">{word.word}</div>
                      <div className="word-usage-def">{word.definition}</div>
                    </div>
                    {/* Checkmark if the word is used */}
                    {/* <div className={`word-usage-indicator${isUsedInConversation ? ' checked' : ''}`}>
                      {isUsedInConversation && (
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div> */}
                    <div className={`word-usage-indicator${isApproved ? ' checked' : ''}`}>
                  {isApproved && (
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
              // Return Button View Only
              <button
                type="button"
                onClick={handleReturnToFurthest}
                className="return-btn"
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
            <h2 className="text-3xl font-bold text-aduffy-navy text-center">Learning Complete!</h2>
            {/* <div className="text-center">
              <div className="final-score-badge">
                <div className="final-score-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 4V2h14v2h3v2c0 3.31-2.69 6-6 6h-2v2.09A7.001 7.001 0 0 1 12 22a7.001 7.001 0 0 1-2-13.91V10H8c-3.31 0-6-2.69-6-6V4h3zm2 0v2c0 2.21 1.79 4 4 4s4-1.79 4-4V4H7zm-3 2c0 2.21 1.79 4 4 4h2V4H4v2zm16-2h-6v4h2c2.21 0 4-1.79 4-4V4z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="final-score-content">
                  <div className="final-score-label">Final Score</div>
                  <div className="final-score-value">{finalScore}/100</div>
                </div>
              </div>
            </div> */}
            {/* FINAL SCORE BADGE */}
            {/* <div className="text-center">
            <span className="final-score-pill">
            <span className="final-score-star" aria-hidden="true">
              {/* Star SVG icon */}
              {/* <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M12 17.25L7.09 20l.93-5.43L4 10.97l5.46-.79L12 5.5l2.54 4.68 5.46.79-3.97 3.6.93 5.43z"
                  stroke="#222b3a" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              </svg>
            </span>
            Final Score: <span>{finalScore}/100</span>
          </span>
          </div> */} 
            {/* FINAL SCORE BADGE END */}

          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Congratulations! You've completed today's vocabulary learning journey. Here's your comprehensive performance analysis.
        </p>
      </div>
      {/* NEW BLOCK OF ACHEIVEMENT */}
      <Card className="daily-achievement-card">
        {/* <div className="confetti-icon" aria-hidden="true">🎉</div> */}
        {/* <div className="achievement-title">Daily Learning Achievement Unlocked!</div> */}
        <div className={`achievement-title ${finalScore<50?"text-red":finalScore<80?"text-orange":"text-green"}`}>
          {finalScore<50?"Try Again":finalScore<80?"You can do better":"🎉 Good Job"}
          </div>
        {/* <div className="achievement-title">{finalScore<50?"Try Again":finalScore<80?"You can do better":"🎉 Good Job"}</div> */}
        
        <div className="score-section">
          <div className="score-number">{finalScore}/100</div>
          <div className="score-label">Overall Score</div>
          <div className="soft-progress-bar">
            <div
              className="soft-progress-bar-fill"
              style={{ width: `${finalScore}%` }}
            />
          </div>
        </div>
        <div className="achievement-grid">
          <div>
            <h4 className="font-medium text-aduffy-navy mb-3">Today's Achievements</h4>
            <ul className="achievement-list">
              <li><span className="checkmark">✔</span><span>Mastered 5 new vocabulary words</span></li>
              <li><span className="checkmark">✔</span><span>Completed {learningQuestions.length} practice questions</span></li>
              <li><span className="checkmark">✔</span><span>Created AI-guided story</span></li>
              <li><span className="checkmark">✔</span><span>Practiced speaking skills</span></li>
            </ul>
          </div>
          {/* <div>
            <h4 className="font-medium text-aduffy-navy mb-3">Story Topic Mastered</h4>
            <div className="topic-mastered">
              <p className="topic-title">{selectedTopic?.title || 'Professional Communication'}</p>
              <p className="topic-desc">
                Successfully addressed this professional scenario while incorporating vocabulary words
              </p>
            </div>
          </div> */}
          <div>
          <h4 className="font-medium text-aduffy-navy mb-3">Words You Learned</h4>
          {/* <div className="flex flex-wrap gap-2"> */}
          <div className="topic-mastered">
            {dailyWords.map((word, idx) => (
              <span key={idx} className="result-words-learned">
                <span className="checkmark">✔&nbsp;&nbsp;&nbsp;</span>
                {word.word}
              </span>
            ))}
          </div>
        </div>
        </div>
      </Card>
{/* NEW BLOCK OF ACHEIVEMENT ENDS */}
      {/* LEARNING< WRITING SPEAKING SCORE CARD */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {/* learning */}
          <Card className="aduffy-card text-center">
            <CardContent className="pt-6">
              <div className="card-icon-circle card-icon-learning">
                {/* brain icon */}
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M8.5 8.5a2 2 0 1 1 4 0m-4 0V10a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v1.5m-5-7A5.5 5.5 0 0 0 2 12v0a5.5 5.5 0 0 0 5.5 5.5h.5m7-11A5.5 5.5 0 0 1 22 12v0a5.5 5.5 0 0 1-5.5 5.5h-.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="card-title-learning">Learning</div>
              <div className="card-subtitle">{Math.round((questionResults.filter(r => r.isCorrect).length / learningQuestions.length) * 100)}% correct ({questionResults.filter(r => r.isCorrect).length}/{learningQuestions.length})</div>
            </CardContent>
          </Card>
          {/* writing */}
          <Card className="aduffy-card text-center ">
            <CardContent className="pt-6 pb-6">
              <div className="card-icon-circle card-icon-writing">
                {/* book icon */}
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 8.5h18" stroke="currentColor" strokeWidth="1.2"/><rect x="7.5" y="2.5" width="2" height="3" rx="1" fill="currentColor"/><rect x="14.5" y="2.5" width="2" height="3" rx="1" fill="currentColor"/></svg>
              </div>
              <div className="card-title-writing ">Writing</div>
              <div className="card-subtitle">{storyAnalysis ? Math.round(((storyAnalysis?.creativity || 0) + (storyAnalysis?.grammar || 0) + (storyAnalysis?.coherence || 0) + (storyAnalysis?.topicAdherence || 0)) / 4) : 0}% quality</div>
            </CardContent>
          </Card>
          {/* speaking */}
          <Card className="aduffy-card text-center">
            <CardContent className="pt-6">
              <div className="card-icon-circle card-icon-speaking">
                {/* speaker icon */}
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M3 10v4h4l5 5V5l-5 5H3z" fill="currentColor"/><path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v8.06A4.978 4.978 0 0 0 16.5 12z" fill="currentColor"/><path d="M19.5 12c0-3.04-1.64-5.64-4.5-6.32v2.06c1.77.77 3 2.53 3 4.26s-1.23 3.49-3 4.26v2.06c2.86-.68 4.5-3.28 4.5-6.32z" fill="currentColor"/></svg>
              </div>
              <div className="card-title-speaking">Speaking</div>
              <div className="card-subtitle">{voiceConversation.filter(msg => msg.type === 'user').length} interactions</div>
            </CardContent>
          </Card>
        </div>
      </div>
              {/* DAILY ACEIVEMENT CARD IN THE RESULT PAGE */}
      {/* <Card className="daily-achievement-card">
        <div className="confetti-icon" aria-hidden="true">🎉</div>
        <div className="achievement-title">Daily Learning Achievement Unlocked!</div>
        <div className="score-section">
          <div className="score-number">{finalScore}</div>
          <div className="score-label">Overall Score</div>
          <div className="soft-progress-bar">
            <div
              className="soft-progress-bar-fill"
              style={{ width: `${finalScore}%` }}
            />
          </div>
        </div>
        <div className="achievement-grid">
          <div>
            <h4 className="font-medium text-aduffy-navy mb-3">Today's Achievements</h4>
            <ul className="achievement-list">
              <li><span className="checkmark">✔</span><span>Mastered 5 new vocabulary words</span></li>
              <li><span className="checkmark">✔</span><span>Completed {learningQuestions.length} practice questions</span></li>
              <li><span className="checkmark">✔</span><span>Created AI-guided story</span></li>
              <li><span className="checkmark">✔</span><span>Practiced speaking skills</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-aduffy-navy mb-3">Story Topic Mastered</h4>
            <div className="topic-mastered">
              <p className="topic-title">{selectedTopic?.title || 'Professional Communication'}</p>
              <p className="topic-desc">
                Successfully addressed this professional scenario while incorporating vocabulary words
              </p>
            </div>
          </div>
        </div>
      </Card> */}

      <div className="flex justify-center gap-4">
        <button
          className="back-to-dashboard-btn-result"
          onClick={onBack}
        >
          <span className="arrow" aria-hidden="true">
            ←
          </span>
          Back to Dashboard
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("aduffy-activity-progress");
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
            setCompletedSteps(new Set());
            setFurthestStep('words');
            setApprovedWords([]);
            clearTranscript();
          }}
          className="try-again-btn"
        >
          <span className="try-again-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5V3m0 0C6.477 3 2 7.477 2 13s4.477 10 10 10 10-4.477 10-10c0-2.21-.896-4.21-2.343-5.657M12 3l-3 3m3-3l3 3" stroke="#222b3a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          Try Again
        </button>
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

  

//  FUNCTION FOR RENDERING STEP NAVIGATION
 const renderStepNavigation = () => {
  const steps: { key: StepType; label: string }[]=[
    { key: 'words', label: 'Words' },
    { key: 'learning', label: 'Quiz' },
    { key: 'writing', label: 'Write' },
    { key: 'voice', label: 'Speak' },
    { key: 'results', label: 'Results' }
  ];

  return (
    <div className="step-nav">
      {steps.map((step, idx) => {
        const status = getStepStatus(step.key); // 'completed', 'current', 'upcoming'
        return (
          <div
            key={step.key}
            className={`step-nav-item ${status}`}
            onClick={() => (status === 'completed' || status === 'current') && handleStepNavigation(step.key)}
            style={{ pointerEvents: status === 'upcoming' ? 'none' : 'auto' }}
          >
            <span className="step-nav-icon">
              {status === 'completed' && (
                // Checkmark icon
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M7 13l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {status === 'current' && (
                // Filled circle
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="7" fill="currentColor"/>
                </svg>
              )}
              {status === 'upcoming' && (
                // Empty circle
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
              )}
            </span>
            <span>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};
 // Add this useEffect to restore story topics
  useEffect(() => {
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
    setStoryTopics(mockTopics);
  }, []);
  // VOICE CONVERSATION AUTO SCROLL MOBILE VARIABLE
  const isMobile = window.innerWidth <= 768;
  const handleSubmitAudio = () => {
    if (isMobile) {
      scrollToConversationCard();
    }
    if (audioBlob && !audioLoading) {
      sendAudioToGemini(audioBlob);
      setAudioBlob(null); // Clear after submission
      clearTranscript();
    }
  };
  // START WRITING INTO COMPLETE PRACTICE
  const stepButton = getStepButtonProps();
  return (
    <div className="space-y-8">
      {/* AUTO SCROLL */}
      <ScrollToTop trigger={currentStep} />
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
          <div className="flex justify-between">
          <div className="progress-header-label ">Overall Progress</div>
          <div className="progress-percentage">{Math.round(calculateProgress())}%</div>
          </div>
          {/* OLD BLOCK */}
          {/* <div className="flex justify-end">
            <div className="progress-percentage">{Math.round(calculateProgress())}%</div>
          </div> */}
          {/* <div className="progress-percentage ">{Math.round(calculateProgress())}%</div> */}
          {/* OLD BLOCK END*/}
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
            {/* {isViewOnly && (
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
            )} */}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            {/* FUNCTION FOR RENDERING STEP NAVIGATION */}
            {renderStepNavigation()}
          </div>
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
}