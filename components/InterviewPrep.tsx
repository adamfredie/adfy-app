import React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { useVoiceInteraction } from "../hooks/useVoiceInteraction";

interface InterviewPrepProps {
  onBack: () => void;
}

interface InterviewScenario {
  id: number;
  title: string;
  question: string;
  context: string;
  keyVocabulary: string[];
  tips: string[];
  timeLimit: number;
}

export function InterviewPrep({ onBack }: InterviewPrepProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);
  const [usedVocabulary, setUsedVocabulary] = useState<string[]>([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

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

  const scenarios: InterviewScenario[] = [
    {
      id: 1,
      title: "Leadership Experience",
      question: "Tell me about a time when you had to lead a challenging project with tight deadlines and limited resources.",
      context: "Demonstrating leadership and project management skills",
      keyVocabulary: ["spearheaded", "orchestrated", "prioritized", "streamlined", "collaborated", "facilitated", "optimized"],
      tips: [
        "Use 'spearheaded' instead of 'led' to show initiative",
        "Say 'orchestrated' when describing complex coordination",
        "Use 'streamlined' to show process improvement"
      ],
      timeLimit: 180
    },
    {
      id: 2,
      title: "Problem Solving",
      question: "Describe a situation where you identified a significant problem in your department and how you addressed it.",
      context: "Analytical thinking and solution implementation",
      keyVocabulary: ["diagnosed", "analyzed", "synthesized", "implemented", "mitigated", "strategized", "executed"],
      tips: [
        "Use 'diagnosed' to show analytical skills",
        "Say 'synthesized' when combining multiple data points",
        "Use 'mitigated' to show risk management"
      ],
      timeLimit: 180
    },
    {
      id: 3,
      title: "Team Management",
      question: "How do you handle conflicts within your team while maintaining productivity and morale?",
      context: "People management and emotional intelligence",
      keyVocabulary: ["mediated", "facilitated", "empowered", "mentored", "cultivated", "aligned", "motivated"],
      tips: [
        "Use 'mediated' for conflict resolution",
        "Say 'cultivated' when building team culture",
        "Use 'aligned' to show strategic thinking"
      ],
      timeLimit: 180
    },
    {
      id: 4,
      title: "Strategic Thinking",
      question: "Walk me through how you would approach developing a long-term strategy for improving our market position.",
      context: "Strategic planning and business acumen",
      keyVocabulary: ["conceptualized", "leveraged", "diversified", "capitalized", "positioned", "differentiated", "sustained"],
      tips: [
        "Use 'conceptualized' for strategic vision",
        "Say 'leveraged' when utilizing resources",
        "Use 'differentiated' for competitive advantage"
      ],
      timeLimit: 240
    }
  ];

  const currentQ = scenarios[currentScenario];
  const progress = (completedScenarios.length / scenarios.length) * 100;

  const handleVocabularyClick = (word: string) => {
    if (!usedVocabulary.includes(word)) {
      setUsedVocabulary([...usedVocabulary, word]);
    }
  };

  const checkVocabularyUsage = (text: string) => {
    const used = currentQ.keyVocabulary.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
    setUsedVocabulary(used);
  };

  const handleResponseChange = (value: string) => {
    setUserResponse(value);
    checkVocabularyUsage(value);
  };

  const handleVoiceResponse = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        const combinedResponse = userResponse + (userResponse ? ' ' : '') + transcript;
        setUserResponse(combinedResponse);
        checkVocabularyUsage(combinedResponse);
        clearTranscript();
      }
    } else {
      startListening();
    }
  };

  const handlePlayQuestion = () => {
    speak(currentQ.question, { rate: 0.8 });
  };

  const handleSubmitResponse = () => {
    if (!completedScenarios.includes(currentScenario)) {
      setCompletedScenarios([...completedScenarios, currentScenario]);
    }
    
    // Simulate AI feedback
    const vocabularyScore = (usedVocabulary.length / currentQ.keyVocabulary.length) * 100;
    const feedback = `Great response! You used ${usedVocabulary.length}/${currentQ.keyVocabulary.length} key vocabulary words (${Math.round(vocabularyScore)}% coverage). Your professional language is improving!`;
    
    if (isSupported) {
      speak(feedback);
    } else {
      alert(feedback);
    }
    
    // Reset for next scenario
    setUserResponse("");
    setUsedVocabulary([]);
    clearTranscript();
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    }
  };

  const handlePrevScenario = () => {
    if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          Previous
        </Button>
        <div className="flex-1">
          <h1>Interview Preparation</h1>
          <p className="text-muted-foreground">Master professional vocabulary for promotion interviews</p>
        </div>
        {isSupported && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className="flex items-center gap-2"
            >
              {isVoiceMode ? 'Text Mode' : 'Voice Mode'}
            </Button>
          </div>
        )}
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Scenarios Completed</span>
            <span className="text-sm text-muted-foreground">
              {completedScenarios.length}/{scenarios.length}
            </span>
          </div>
          <Progress value={progress} />
        </CardContent>
      </Card>

      {/* Scenario Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {scenarios.map((scenario, index) => (
          <Button
            key={scenario.id}
            variant={currentScenario === index ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentScenario(index)}
            className="whitespace-nowrap"
          >
            {completedScenarios.includes(index) && '✅'}
            {scenario.title}
          </Button>
        ))}
      </div>

      {/* Interview Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {currentQ.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                {currentQ.timeLimit}s
              </Badge>
              {isSupported && (
                <Button variant="outline" size="sm" onClick={handlePlayQuestion}>
                  Hear Question
                </Button>
              )}
            </div>
          </div>
          <CardDescription>{currentQ.context}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-4">
            <p className="font-medium text-blue-900 mb-2">Interview Question:</p>
            <p className="text-blue-800">{currentQ.question}</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Vocabulary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Key Professional Vocabulary
          </CardTitle>
          <CardDescription>Use these words to enhance your response</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {currentQ.keyVocabulary.map((word) => (
                <Badge
                  key={word}
                  variant={usedVocabulary.includes(word) ? "default" : "secondary"}
                  className="cursor-pointer transition-colors"
                  onClick={() => handleVocabularyClick(word)}
                >
                  {usedVocabulary.includes(word) && '✅'}
                  {word}
                </Badge>
              ))}
            </div>
            
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="font-medium text-amber-900 text-sm mb-2">Professional Language Tips:</p>
              <ul className="text-amber-800 text-sm space-y-1">
                {currentQ.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Response Area */}
      <Card>
        <CardHeader>
          <CardTitle>Your Response</CardTitle>
          <CardDescription>
            {isVoiceMode 
              ? "Speak your answer or type it below. Voice input will be added to your text."
              : `Craft your answer using professional vocabulary. Aim for ${currentQ.timeLimit} seconds when spoken.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isVoiceMode && isSupported && (
              <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                <div className="text-center space-y-2">
                  <Button
                    size="lg"
                    variant={isListening ? "destructive" : "default"}
                    onClick={handleVoiceResponse}
                    className="rounded-full w-16 h-16"
                    disabled={isSpeaking}
                  >
                    {isListening ? (
                      'Stop'
                    ) : (
                      'Speak'
                    )}
                  </Button>
                  <div>
                    <p className="text-sm font-medium">
                      {isListening ? 'Listening... Speak your answer' : 'Click to add voice input'}
                    </p>
                    {isListening && transcript && (
                      <p className="text-xs text-muted-foreground mt-1">
                        "{transcript}"
                      </p>
                    )}
                    {confidence > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Confidence: {Math.round(confidence * 100)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <Textarea
              placeholder="Type your response here... Use the key vocabulary words to sound more professional and confident."
              value={userResponse}
              onChange={(e) => handleResponseChange(e.target.value)}
              className="min-h-[200px]"
            />
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Vocabulary used: {usedVocabulary.length}/{currentQ.keyVocabulary.length}
                {usedVocabulary.length > 0 && (
                  <span className="ml-2 text-green-600">
                    ({Math.round((usedVocabulary.length / currentQ.keyVocabulary.length) * 100)}%)
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmitResponse}
                  disabled={userResponse.length < 50}
                >
                  Submit Response
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevScenario}
          disabled={currentScenario === 0}
        >
          Previous Scenario
        </Button>
        <Button 
          onClick={handleNextScenario}
          disabled={currentScenario === scenarios.length - 1}
        >
          Next Scenario
        </Button>
      </div>
    </div>
  );
}