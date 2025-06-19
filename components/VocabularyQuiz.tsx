import React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface VocabularyQuizProps {
  onBack: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  context: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  word: string;
}

export function VocabularyQuiz({ onBack }: VocabularyQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "In a management meeting, Sarah needed to _______ the complex project requirements to ensure everyone understood the deliverables.",
      context: "Professional Communication",
      options: ["articulate", "complicate", "summarize", "delegate"],
      correctAnswer: 0,
      explanation: "'Articulate' means to express thoughts clearly and effectively, which is essential in professional communication.",
      word: "articulate"
    },
    {
      id: 2,
      question: "The project manager decided to _______ the team's efforts across different departments to achieve the quarterly goals.",
      context: "Team Management",
      options: ["separate", "coordinate", "eliminate", "postpone"],
      correctAnswer: 1,
      explanation: "'Coordinate' means to organize different elements to work together effectively, crucial for successful project management.",
      word: "coordinate"
    },
    {
      id: 3,
      question: "During the strategic planning session, the CEO aimed to _______ various market insights into a coherent business strategy.",
      context: "Strategic Planning",
      options: ["divide", "ignore", "synthesize", "complicate"],
      correctAnswer: 2,
      explanation: "'Synthesize' means to combine different elements to create a unified whole, essential for strategic thinking.",
      word: "synthesize"
    },
    {
      id: 4,
      question: "The consultant was brought in to _______ the implementation of the new software system across all departments.",
      context: "Change Management",
      options: ["prevent", "facilitate", "delay", "criticize"],
      correctAnswer: 1,
      explanation: "'Facilitate' means to make a process easier or more achievable, a key skill in change management.",
      word: "facilitate"
    },
    {
      id: 5,
      question: "The marketing director needed to _______ with the sales team to ensure campaign alignment with revenue targets.",
      context: "Cross-functional Collaboration",
      options: ["compete", "collaborate", "argue", "separate"],
      correctAnswer: 1,
      explanation: "'Collaborate' means to work jointly with others, essential for successful cross-functional initiatives.",
      word: "collaborate"
    }
  ];

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      alert(`Quiz completed! Your score: ${score}/${questions.length}`);
      onBack();
    }
  };

  const isAnswerCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1>Professional Vocabulary Quiz</h1>
          <p className="text-muted-foreground">Test your knowledge with contextual scenarios</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Quiz Progress</span>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Score: {score}/{answers.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Question {currentQuestion + 1}
            </CardTitle>
            <Badge variant="secondary">{currentQ.context}</Badge>
          </div>
          <CardDescription className="text-base leading-relaxed">
            {currentQ.question}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className="w-full justify-start h-auto p-4 text-left"
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
              </Button>
            ))}
          </div>

          {!showResult && selectedAnswer !== null && (
            <div className="mt-4">
              <Button onClick={handleSubmitAnswer} className="w-full">
                Submit Answer
              </Button>
            </div>
          )}

          {showResult && (
            <div className="mt-4 space-y-4">
              <div className={`p-4 rounded-lg border-l-4 ${
                isAnswerCorrect 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {isAnswerCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    isAnswerCorrect ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {isAnswerCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className={`text-sm ${
                  isAnswerCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {currentQ.explanation}
                </p>
                {!isAnswerCorrect && (
                  <p className="text-sm text-red-800 mt-2">
                    The correct answer is: {currentQ.options[currentQ.correctAnswer]}
                  </p>
                )}
              </div>

              <Button onClick={handleNextQuestion} className="w-full">
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vocabulary Highlight */}
      <Card>
        <CardHeader>
          <CardTitle>Word Focus: {currentQ.word}</CardTitle>
          <CardDescription>Professional usage tip</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            In professional settings, "{currentQ.word}" is commonly used in contexts involving {currentQ.context.toLowerCase()}. 
            Mastering this word will help you communicate more effectively in similar workplace scenarios.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}