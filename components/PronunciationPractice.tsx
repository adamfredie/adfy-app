import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useVoiceInteraction } from "../hooks/useVoiceInteraction";

interface PronunciationPracticeProps {
  onBack: () => void;
}

interface VocabularyWord {
  word: string;
  definition: string;
  phonetic: string;
  exampleSentence: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export function PronunciationPractice({ onBack }: PronunciationPracticeProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [completedWords, setCompletedWords] = useState<boolean[]>([]);

  const {
    isListening,
    isSpeaking,
    transcript,
    confidence,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript
  } = useVoiceInteraction();

  const vocabularyWords: VocabularyWord[] = [
    {
      word: "articulate",
      definition: "Having or showing the ability to speak fluently and coherently",
      phonetic: "/ɑːˈtɪkjʊlət/",
      exampleSentence: "She was very articulate in presenting her ideas during the meeting.",
      difficulty: 'medium',
      category: 'Communication'
    },
    {
      word: "collaborate",
      definition: "Work jointly on an activity, especially to produce something",
      phonetic: "/kəˈlæbəreɪt/",
      exampleSentence: "We need to collaborate with other departments to achieve our goals.",
      difficulty: 'easy',
      category: 'Teamwork'
    },
    {
      word: "synthesize",
      definition: "Combine different elements in order to create something new",
      phonetic: "/ˈsɪnθəsaɪz/",
      exampleSentence: "The manager was able to synthesize various reports into a comprehensive strategy.",
      difficulty: 'hard',
      category: 'Analysis'
    },
    {
      word: "facilitate",
      definition: "Make an action or process easier or more achievable",
      phonetic: "/fəˈsɪlɪteɪt/",
      exampleSentence: "The new software will facilitate better communication between teams.",
      difficulty: 'medium',
      category: 'Process'
    },
    {
      word: "optimize",
      definition: "Make the best or most effective use of something",
      phonetic: "/ˈɒptɪmaɪz/",
      exampleSentence: "We need to optimize our workflow to increase productivity.",
      difficulty: 'medium',
      category: 'Efficiency'
    }
  ];

  const currentWord = vocabularyWords[currentWordIndex];
  const progress = (completedWords.filter(Boolean).length / vocabularyWords.length) * 100;

  useEffect(() => {
    setAttempts(new Array(vocabularyWords.length).fill(0));
    setCompletedWords(new Array(vocabularyWords.length).fill(false));
  }, []);

  useEffect(() => {
    if (transcript.trim() && !isListening) {
      handlePronunciationAttempt(transcript.trim());
      clearTranscript();
    }
  }, [transcript, isListening]);

  const handlePronunciationAttempt = (userPronunciation: string) => {
    const normalizedUser = userPronunciation.toLowerCase().trim();
    const normalizedTarget = currentWord.word.toLowerCase();
    
    // Simple pronunciation matching (in a real app, you'd use more sophisticated matching)
    const similarity = calculateSimilarity(normalizedUser, normalizedTarget);
    const isCorrect = similarity > 0.7 || normalizedUser.includes(normalizedTarget);
    
    const newAttempts = currentAttempts + 1;
    setCurrentAttempts(newAttempts);
    
    const newAttemptsList = [...attempts];
    newAttemptsList[currentWordIndex] = newAttempts;
    setAttempts(newAttemptsList);

    if (isCorrect) {
      const points = Math.max(100 - (newAttempts - 1) * 20, 20);
      setScore(prev => prev + points);
      
      const newCompleted = [...completedWords];
      newCompleted[currentWordIndex] = true;
      setCompletedWords(newCompleted);
      
      // Provide positive feedback
      const feedback = `Excellent! You pronounced "${currentWord.word}" correctly. You earned ${points} points!`;
      speak(feedback);
      
      // Auto-advance after a moment
      setTimeout(() => {
        if (currentWordIndex < vocabularyWords.length - 1) {
          handleNextWord();
        }
      }, 3000);
    } else {
      // Provide corrective feedback
      const feedback = newAttempts < 3 
        ? `Not quite right. Let me say it again: ${currentWord.word}. Try again!`
        : `The correct pronunciation is: ${currentWord.word}. Let's try the next word.`;
      
      speak(feedback);
      
      if (newAttempts >= 3) {
        setTimeout(() => {
          if (currentWordIndex < vocabularyWords.length - 1) {
            handleNextWord();
          }
        }, 4000);
      }
    }
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const handlePlayPronunciation = () => {
    speak(currentWord.word, { rate: 0.7 });
  };

  const handlePlayExample = () => {
    speak(currentWord.exampleSentence, { rate: 0.8 });
  };

  const handleNextWord = () => {
    if (currentWordIndex < vocabularyWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentAttempts(0);
    }
  };

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setCurrentAttempts(attempts[currentWordIndex - 1] || 0);
    }
  };

  const handleRetry = () => {
    setCurrentAttempts(0);
    const newCompleted = [...completedWords];
    newCompleted[currentWordIndex] = false;
    setCompletedWords(newCompleted);
  };

  if (!isSupported) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <span role="img" aria-label="back">←</span>
          </Button>
          <div>
            <h1>Pronunciation Practice</h1>
            <p className="text-muted-foreground">Perfect your vocabulary pronunciation</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <span role="img" aria-label="volume">🔊</span>
              </div>
              <div>
                <h3>Voice Features Not Available</h3>
                <p className="text-muted-foreground">
                  Your browser doesn't support speech recognition. Please try using Chrome, Safari, or Edge.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <span role="img" aria-label="back">←</span>
        </Button>
        <div>
          <h1>Pronunciation Practice</h1>
          <p className="text-muted-foreground">Perfect your vocabulary pronunciation with AI feedback</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedWords.filter(Boolean).length}/{vocabularyWords.length} completed
              </span>
            </div>
            <Progress value={progress} />
            
            <div className="flex items-center justify-between text-sm">
              <span>Score: {score} points</span>
              <span>Word {currentWordIndex + 1} of {vocabularyWords.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Word */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span role="img" aria-label="volume">🔊</span>
              {currentWord.word}
              {completedWords[currentWordIndex] && (
                <span role="img" aria-label="check">✅</span>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{currentWord.category}</Badge>
              <Badge 
                variant={currentWord.difficulty === 'easy' ? 'default' : 
                        currentWord.difficulty === 'medium' ? 'secondary' : 'destructive'}
              >
                {currentWord.difficulty}
              </Badge>
            </div>
          </div>
          <CardDescription>
            <span className="font-mono text-primary">{currentWord.phonetic}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Definition:</p>
              <p className="text-sm text-muted-foreground">{currentWord.definition}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Example:</p>
              <p className="text-sm text-muted-foreground italic">"{currentWord.exampleSentence}"</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePlayPronunciation}
                disabled={isSpeaking}
              >
                <span role="img" aria-label="volume">🔊</span>
                Hear Word
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePlayExample}
                disabled={isSpeaking}
              >
                <span role="img" aria-label="volume">🔊</span>
                Hear Example
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Area */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Pronunciation</CardTitle>
          <CardDescription>
            Listen to the word, then speak it clearly into your microphone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                onClick={isListening ? stopListening : startListening}
                className="rounded-full w-20 h-20"
                disabled={isSpeaking}
              >
                <span role="img" aria-label="microphone">🎤</span>
              </Button>
              
              <div className="mt-4">
                <p className="text-sm font-medium">
                  {isListening ? 'Listening... Speak now!' : 
                   isSpeaking ? 'AI is speaking...' : 
                   'Click and say the word'}
                </p>
                {isListening && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {transcript || 'Listening for your pronunciation...'}
                  </p>
                )}
              </div>
            </div>
            
            {/* Attempt Status */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Attempts: {currentAttempts}/3</p>
                  {confidence > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Confidence: {Math.round(confidence * 100)}%
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {completedWords[currentWordIndex] ? (
                    <Button variant="outline" size="sm" onClick={handleRetry}>
                      <span role="img" aria-label="reset">🔄</span>
                      Retry
                    </Button>
                  ) : (
                    currentAttempts >= 3 && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <span role="img" aria-label="x">❌</span>
                        <span className="text-sm">Max attempts reached</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevWord}
          disabled={currentWordIndex === 0}
        >
          Previous Word
        </Button>
        <Button 
          onClick={handleNextWord}
          disabled={currentWordIndex === vocabularyWords.length - 1}
        >
          Next Word
        </Button>
      </div>
    </div>
  );
}