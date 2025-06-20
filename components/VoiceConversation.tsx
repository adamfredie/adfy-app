import React from "react";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";
import { useVoiceInteraction } from "../hooks/useVoiceInteraction";

interface VoiceConversationProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  vocabularyWords?: string[];
}

interface ConversationTopic {
  title: string;
  description: string;
  targetWords: string[];
  prompts: string[];
}

export function VoiceConversation({ onBack }: VoiceConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [usedVocabulary, setUsedVocabulary] = useState<string[]>([]);
  const [conversationScore, setConversationScore] = useState(0);
  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const conversationTopics: ConversationTopic[] = [
    {
      title: "Professional Networking",
      description: "Practice introducing yourself and discussing your career goals",
      targetWords: ["networking", "collaborate", "expertise", "synergy", "leverage", "opportunity", "initiative"],
      prompts: [
        "Tell me about your professional background and what you're looking to achieve in your career.",
        "How do you typically approach networking events?",
        "What strategies do you use to build professional relationships?"
      ]
    },
    {
      title: "Project Management",
      description: "Discuss project challenges and management strategies",
      targetWords: ["coordinate", "streamline", "optimize", "prioritize", "delegate", "facilitate", "implement"],
      prompts: [
        "Describe a challenging project you've worked on recently.",
        "How do you handle competing priorities in your projects?",
        "What's your approach to team coordination and communication?"
      ]
    },
    {
      title: "Leadership & Innovation",
      description: "Explore leadership styles and innovative thinking",
      targetWords: ["spearhead", "innovate", "cultivate", "mentorship", "visionary", "strategic", "transformative"],
      prompts: [
        "What does effective leadership mean to you?",
        "How do you foster innovation in your team?",
        "Describe a time when you had to lead through change."
      ]
    }
  ];

  const currentTopicData = conversationTopics[currentTopic];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle transcript changes
  useEffect(() => {
    if (transcript.trim() && !isListening) {
      handleUserMessage(transcript.trim());
      clearTranscript();
    }
  }, [transcript, isListening]);

  // Initialize conversation
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Welcome to voice conversation practice! Today we're focusing on "${currentTopicData.title}". ${currentTopicData.description}. I'll help you practice using professional vocabulary naturally. Let's start: ${currentTopicData.prompts[0]}`,
      timestamp: new Date(),
      vocabularyWords: currentTopicData.targetWords
    };
    
    setMessages([welcomeMessage]);
    
    if (isAutoSpeakEnabled && isSupported) {
      setTimeout(() => {
        speak(welcomeMessage.content);
      }, 1000);
    }
  }, [currentTopic]);

  const handleUserMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Check for vocabulary usage
    const wordsUsed = currentTopicData.targetWords.filter(word => 
      content.toLowerCase().includes(word.toLowerCase())
    );
    
    if (wordsUsed.length > 0) {
      const newUsedWords = [...new Set([...usedVocabulary, ...wordsUsed])];
      setUsedVocabulary(newUsedWords);
      setConversationScore(prev => prev + wordsUsed.length * 10);
    }

    // Generate AI response
    setTimeout(() => {
      generateAIResponse(content, wordsUsed);
    }, 1000);
  };

  const generateAIResponse = (userContent: string, wordsUsed: string[]) => {
    // Mock AI response generation
    let aiResponse = "";
    
    if (wordsUsed.length > 0) {
      aiResponse = `Excellent! I noticed you used the word${wordsUsed.length > 1 ? 's' : ''} "${wordsUsed.join('", "')}". That's very professional language. `;
    }

    const responseTemplates = [
      "That's a great perspective. Can you elaborate on how you would approach that situation?",
      "I appreciate that insight. What challenges have you encountered in similar situations?",
      "That sounds like a valuable experience. How did that impact your professional development?",
      "Interesting approach. What strategies would you recommend to others facing similar challenges?",
      "Thank you for sharing that. Can you walk me through your decision-making process?"
    ];

    aiResponse += responseTemplates[Math.floor(Math.random() * responseTemplates.length)];

    // Suggest vocabulary if not used much
    if (usedVocabulary.length < 3) {
      const unusedWords = currentTopicData.targetWords.filter(word => !usedVocabulary.includes(word));
      if (unusedWords.length > 0) {
        const suggestedWord = unusedWords[0];
        aiResponse += ` Try incorporating the word "${suggestedWord}" in your response - it's commonly used in professional settings.`;
      }
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);

    if (isAutoSpeakEnabled && isSupported) {
      setTimeout(() => {
        speak(aiResponse);
      }, 500);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      if (isSpeaking) {
        stopSpeaking();
      }
      startListening();
    }
  };

  const handleTopicChange = (newTopic: number) => {
    setCurrentTopic(newTopic);
    setMessages([]);
    setUsedVocabulary([]);
    setConversationScore(0);
  };

  const progress = (usedVocabulary.length / currentTopicData.targetWords.length) * 100;

  if (!isSupported) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <span role="img" aria-label="back">←</span>
          </Button>
          <div>
            <h1>Voice Conversation</h1>
            <p className="text-muted-foreground">Practice vocabulary through AI conversations</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <span role="img" aria-label="mic-off">🎤</span>
              </div>
              <div>
                <h3>Voice Features Not Available</h3>
                <p className="text-muted-foreground">
                  Your browser doesn't support speech recognition or text-to-speech. 
                  Please try using Chrome, Safari, or Edge for the best experience.
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
        <div className="flex-1">
          <h1>AI Voice Conversation</h1>
          <p className="text-muted-foreground">Practice vocabulary through natural conversation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoSpeakEnabled(!isAutoSpeakEnabled)}
            className="flex items-center gap-2"
          >
            <span role="img" aria-label="volume">
              {isAutoSpeakEnabled ? "🔊" : "🔇"}
            </span>
            Auto-speak
          </Button>
        </div>
      </div>

      {/* Topic Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {conversationTopics.map((topic, index) => (
          <Button
            key={index}
            variant={currentTopic === index ? "default" : "outline"}
            size="sm"
            onClick={() => handleTopicChange(index)}
            className="whitespace-nowrap"
          >
            {topic.title}
          </Button>
        ))}
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Vocabulary Progress</span>
              <span className="text-sm text-muted-foreground">
                {usedVocabulary.length}/{currentTopicData.targetWords.length} words used
              </span>
            </div>
            <Progress value={progress} />
            
            <div className="flex flex-wrap gap-2">
              {currentTopicData.targetWords.map((word) => (
                <Badge
                  key={word}
                  variant={usedVocabulary.includes(word) ? "default" : "secondary"}
                  className="text-xs"
                >
                  {word}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Conversation Score: {conversationScore} points</span>
              <span>Confidence: {confidence > 0 ? `${Math.round(confidence * 100)}%` : 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation */}
      <Card className="flex flex-col h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span role="img" aria-label="message">��</span>
            Conversation: {currentTopicData.title}
          </CardTitle>
          <CardDescription>{currentTopicData.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.type === 'user' ? (
                        <span role="img" aria-label="user">🧑</span>
                      ) : (
                        <span role="img" aria-label="bot">🤖</span>
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isListening && (
                <div className="flex justify-end">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {transcript || "Listening..."}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Invisible div for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
            <Button
              size="lg"
              variant={isListening ? "destructive" : "default"}
              onClick={handleMicClick}
              className="rounded-full w-16 h-16"
              disabled={isSpeaking}
            >
              <span role="img" aria-label="mic">
                {isListening ? "🔇" : "🎤"}
              </span>
            </Button>
            
            {isSpeaking && (
              <Button variant="outline" onClick={stopSpeaking}>
                <span role="img" aria-label="stop">🔇</span>
                Stop AI
              </Button>
            )}
            
            <div className="text-center">
              <p className="text-sm font-medium">
                {isListening ? 'Listening...' : isSpeaking ? 'AI Speaking...' : 'Tap to speak'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isListening ? 'Release to send' : 'Hold and speak naturally'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}