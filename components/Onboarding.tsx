import React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Brain } from "lucide-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Keep the original interface for backward compatibility
export interface OnboardingData {
  // Original properties for backward compatibility
  name?: string;
  email?: string;
  jobTitle: string;
  company: string;
  industry?: string;
  experience?: string;
  fieldOfInterest?: string;
  vocabularyLevel: string;
  learningGoals: string;
  
  // New communication assessment properties
  field?: string;
  experienceLevel?: string;
  communicationConfidence?: {
    presentations: number;
    meetings: number;
    emails: number;
    networking: number;
    teamCollaboration: number;
  };
  communicationChallenges?: string[];
  improvementGoals?: string[];
  learningPreferences?: string[];
  currentSkillLevel?: string;
  primaryPainPoints?: string[];
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

type Step = 'personal' | 'professional' | 'assessment' | 'goals' | 'preferences';

const communicationChallenges = [
  { id: 'public-speaking', label: 'Public speaking and presentations' },
  { id: 'meeting-participation', label: 'Active participation in meetings' },
  { id: 'email-clarity', label: 'Writing clear and professional emails' },
  { id: 'difficult-conversations', label: 'Having difficult conversations' },
  { id: 'networking', label: 'Professional networking' },
  { id: 'cross-team-collaboration', label: 'Cross-team collaboration' },
  { id: 'client-communication', label: 'Client communication' },
  { id: 'virtual-meetings', label: 'Virtual meeting facilitation' },
  { id: 'persuasive-writing', label: 'Persuasive writing and proposals' },
  { id: 'conflict-resolution', label: 'Conflict resolution' }
];

const improvementGoals = [
  { id: 'confidence', label: 'Build confidence in speaking' },
  { id: 'vocabulary', label: 'Expand professional vocabulary' },
  { id: 'clarity', label: 'Improve message clarity' },
  { id: 'persuasion', label: 'Enhance persuasive communication' },
  { id: 'leadership', label: 'Develop leadership communication' },
  { id: 'storytelling', label: 'Master storytelling techniques' },
  { id: 'active-listening', label: 'Improve active listening skills' },
  { id: 'emotional-intelligence', label: 'Enhance emotional intelligence' }
];

const learningPreferences = [
  { id: 'interactive', label: 'Interactive exercises and quizzes' },
  { id: 'real-scenarios', label: 'Real workplace scenarios' },
  { id: 'voice-practice', label: 'Voice and speaking practice' },
  { id: 'writing-exercises', label: 'Writing and composition exercises' },
  { id: 'peer-feedback', label: 'Peer feedback and collaboration' },
  { id: 'gamification', label: 'Gamified learning experience' },
  { id: 'bite-sized', label: 'Short, bite-sized lessons' },
  { id: 'comprehensive', label: 'Comprehensive deep-dive sessions' }
];

const primaryPainPoints = [
  { id: 'fear-judgment', label: 'Fear of being judged when speaking' },
  { id: 'vocabulary-gaps', label: 'Limited professional vocabulary' },
  { id: 'unclear-messaging', label: 'Messages often misunderstood' },
  { id: 'low-engagement', label: 'Difficulty engaging audience' },
  { id: 'speaking-anxiety', label: 'Speaking anxiety in groups' },
  { id: 'cultural-barriers', label: 'Cultural communication barriers' },
  { id: 'technical-translation', label: 'Translating technical concepts for non-experts' },
  { id: 'time-constraints', label: 'Not enough time to practice communication skills' }
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    email: '',
    jobTitle: '',
    company: '',
    field: '',
    fieldOfInterest: '',
    experienceLevel: '',
    vocabularyLevel: 'intermediate',
    learningGoals: '',
    communicationConfidence: {
      presentations: 3,
      meetings: 3,
      emails: 3,
      networking: 3,
      teamCollaboration: 3
    },
    communicationChallenges: [],
    improvementGoals: [],
    learningPreferences: [],
    currentSkillLevel: '',
    primaryPainPoints: []
  });

  const steps: { key: Step; title: string; description: string }[] = [
    { key: 'personal', title: 'Personal Info', description: 'Tell us about yourself' },
    { key: 'professional', title: 'Professional Background', description: 'Your work context' },
    { key: 'assessment', title: 'Communication Assessment', description: 'Rate your current skills' },
    { key: 'goals', title: 'Goals & Challenges', description: 'What you want to improve' },
    { key: 'preferences', title: 'Learning Preferences', description: 'How you like to learn' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const createDefaultOnboardingData = (): OnboardingData => {
    return {
      ...formData,
      // Professional defaults
      jobTitle: formData.jobTitle || 'Professional',
      company: formData.company || '',
      field: 'marketing',
      fieldOfInterest: 'marketing',
      experienceLevel: 'mid',
      vocabularyLevel: 'intermediate',
      currentSkillLevel: 'intermediate',
      
      // Default communication confidence (moderate level)
      communicationConfidence: {
        presentations: 3,
        meetings: 3,
        emails: 4,
        networking: 3,
        teamCollaboration: 4
      },
      
      // Common challenges and goals
      communicationChallenges: ['public-speaking', 'vocabulary-gaps'],
      improvementGoals: ['confidence', 'vocabulary'],
      learningPreferences: ['interactive', 'real-scenarios'],
      primaryPainPoints: ['vocabulary-gaps'],
      
      // Learning goals summary
      learningGoals: 'Improve professional communication confidence and expand vocabulary'
    };
  };

  const handleSkipToEnd = () => {
    const defaultData = createDefaultOnboardingData();
    onComplete(defaultData);
  };

  const handleNext = () => {
    const stepOrder: Step[] = ['personal', 'professional', 'assessment', 'goals', 'preferences'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      // Map the new structure to the old structure for backward compatibility
      const mappedData: OnboardingData = {
        ...formData,
        // Map field to fieldOfInterest for backward compatibility
        fieldOfInterest: formData.field || formData.fieldOfInterest || '',
        // Map currentSkillLevel to vocabularyLevel for backward compatibility
        vocabularyLevel: mapSkillLevelToVocabularyLevel(formData.currentSkillLevel || ''),
        // Create a learning goals summary from improvement goals
        learningGoals: (formData.improvementGoals && formData.improvementGoals.length > 0)
          ? `Focus on: ${formData.improvementGoals.map(goal => 
              improvementGoals.find(ig => ig.id === goal)?.label || goal
            ).join(', ')}`
          : formData.learningGoals || ''
      };
      
      onComplete(mappedData);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ['personal', 'professional', 'assessment', 'goals', 'preferences'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const mapSkillLevelToVocabularyLevel = (skillLevel: string): string => {
    switch (skillLevel) {
      case 'beginner':
        return 'beginner';
      case 'intermediate':
        return 'intermediate';
      case 'advanced':
      case 'expert':
        return 'advanced';
      default:
        return 'intermediate';
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 'personal':
        return !!(formData.name && formData.email);
      case 'professional':
        return !!(formData.jobTitle && formData.field && formData.experienceLevel);
      case 'assessment':
        return formData.currentSkillLevel !== '';
      case 'goals':
        return formData.communicationChallenges!.length > 0 && formData.improvementGoals!.length > 0;
      case 'preferences':
        return formData.learningPreferences!.length > 0 && formData.primaryPainPoints!.length > 0;
      default:
        return false;
    }
  };

  const renderPersonalStep = () => (
    <Card className="aduffy-card max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-aduffy-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          👤
        </div>
        <CardTitle className="text-aduffy-navy">Welcome to ADuffy Learning!</CardTitle>
        <CardDescription className="text-lg">
          Let's get to know you better to personalize your learning experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="your.email@company.com"
            />
          </div>
        </div>
        
        <div className="bg-aduffy-yellow/5 p-6 rounded-lg border border-aduffy-yellow/20">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 text-aduffy-yellow mt-1 flex-shrink-0">✨</span>
            <div>
              <h3 className="font-semibold text-aduffy-navy mb-2">What makes ADuffy Learning special?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 text-aduffy-teal">✅</span>
                  AI-powered personalized learning paths
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 text-aduffy-teal">✅</span>
                  Real workplace scenarios and practice
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 text-aduffy-teal">✅</span>
                  Voice interaction and pronunciation coaching
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 text-aduffy-teal">✅</span>
                  Progress tracking and skill analytics
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick start option after filling basic info */}
        {isStepValid() && (
          <div className="bg-aduffy-teal/5 p-6 rounded-lg border border-aduffy-teal/20">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 text-aduffy-teal mt-1 flex-shrink-0">⚡</span>
              <div className="flex-1">
                <h3 className="font-semibold text-aduffy-navy mb-2">Want to get started quickly?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You can skip the detailed setup and start learning right away. We'll use smart defaults and you can always customize your preferences later in Settings.
                </p>
                <Button
                  onClick={handleSkipToEnd}
                  className="border-aduffy-teal/30 text-aduffy-teal hover:bg-aduffy-teal/10"
                >
                  <span className="w-4 h-4 mr-2">⚡</span>
                  Skip to Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderProfessionalStep = () => (
    <Card className="aduffy-card max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-aduffy-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          💼
        </div>
        <CardTitle className="text-aduffy-navy">Professional Background</CardTitle>
        <CardDescription>
          Help us understand your professional context for better personalization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => updateFormData({ jobTitle: e.target.value })}
              placeholder="e.g., Senior Marketing Manager"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => updateFormData({ company: e.target.value })}
              placeholder="Your company name"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Professional Field *</Label>
          <RadioGroup className="grid grid-cols-2 gap-4">
            {[
              { value: "marketing", label: "📊 Marketing" },
              { value: "technology", label: "💻 Technology" },
              { value: "sales", label: "💼 Sales" },
              { value: "product", label: "🚀 Product Management" },
              { value: "finance", label: "💰 Finance" },
              { value: "operations", label: "⚙️ Operations" },
              { value: "consulting", label: "🎯 Consulting" },
              { value: "other", label: "🌟 Other" },
            ].map(opt => (
              <div className="flex items-center space-x-2" key={opt.value}>
                <RadioGroupItem
                  checked={formData.field === opt.value}
                  onChange={() => updateFormData({ field: opt.value, fieldOfInterest: opt.value })}
                  id={opt.value}
                />
                <Label htmlFor={opt.value}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Experience Level *</Label>
          <RadioGroup>
            {[
              { value: "entry", label: "Entry Level (0-2 years)" },
              { value: "mid", label: "Mid-Level (3-7 years)" },
              { value: "senior", label: "Senior Level (8-12 years)" },
              { value: "executive", label: "Executive Level (13+ years)" },
            ].map(opt => (
              <div className="flex items-center space-x-2" key={opt.value}>
                <RadioGroupItem
                  checked={formData.experienceLevel === opt.value}
                  onChange={() => updateFormData({ experienceLevel: opt.value })}
                  id={opt.value}
                />
                <Label htmlFor={opt.value}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );

  const renderAssessmentStep = () => (
    <Card className="aduffy-card max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-aduffy-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          📊
        </div>
        <CardTitle className="text-aduffy-navy">Communication Skills Assessment</CardTitle>
        <CardDescription>
          Rate your current confidence level in these communication areas (1 = Not confident, 5 = Very confident)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          {Object.entries(formData.communicationConfidence || {}).map(([key, value]) => {
            const labelMap: Record<string, string> = {
              presentations: 'Giving presentations',
              meetings: 'Leading/participating in meetings',
              emails: 'Writing professional emails',
              networking: 'Professional networking',
              teamCollaboration: 'Team collaboration',
            };
            return (
              <div key={key} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 text-aduffy-teal">🧠</span>
                  <Label className="font-medium">{labelMap[key] || key}</Label>
                </div>
                <RadioGroup className="flex items-center gap-6">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex flex-col items-center gap-2">
                      <RadioGroupItem
                        checked={value === rating}
                        onChange={() => updateFormData({
                          communicationConfidence: {
                            ...formData.communicationConfidence!,
                            [key]: rating
                          }
                        })}
                        id={`${key}-${rating}`}
                      />
                      <Label htmlFor={`${key}-${rating}`} className="text-xs text-center">
                        {rating === 1 ? 'Not confident' : rating === 5 ? 'Very confident' : rating.toString()}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            );
          })}
        </div>

        <Separator />

        <div className="space-y-3">
          <Label>Overall, how would you rate your current professional communication skills? *</Label>
          <RadioGroup>
            {[
              { value: "beginner", label: "Beginner - I need significant improvement" },
              { value: "intermediate", label: "Intermediate - I'm comfortable but want to improve" },
              { value: "advanced", label: "Advanced - I'm confident but want to refine specific areas" },
              { value: "expert", label: "Expert - I want to master advanced techniques" },
            ].map(opt => (
              <div className="flex items-center space-x-2" key={opt.value}>
                <RadioGroupItem
                  checked={formData.currentSkillLevel === opt.value}
                  onChange={() => updateFormData({ currentSkillLevel: opt.value })}
                  id={opt.value}
                />
                <Label htmlFor={opt.value}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );

  const renderGoalsStep = () => (
    <Card className="aduffy-card max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          🎯
        </div>
        <CardTitle className="text-aduffy-navy">Goals &amp; Challenges</CardTitle>
        <CardDescription>
          Help us understand what you want to improve and what challenges you face
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 text-aduffy-orange">⚠️</span>
            <Label className="text-base font-medium">What communication challenges do you currently face? *</Label>
          </div>
          <p className="text-sm text-muted-foreground">Select all that apply</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {communicationChallenges.map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <input
                  type="checkbox"
                  id={id}
                  checked={formData.communicationChallenges!.includes(id)}
                  onChange={e => {
                    if (e.target.checked) {
                      updateFormData({
                        communicationChallenges: [...(formData.communicationChallenges || []), id]
                      });
                    } else {
                      updateFormData({
                        communicationChallenges: (formData.communicationChallenges || []).filter(c => c !== id)
                      });
                    }
                  }}
                  className="aduffy-checkbox"
                />
                <Label htmlFor={id} className="text-sm cursor-pointer flex-1">{label}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 text-aduffy-yellow">🌟</span>
            <Label className="text-base font-medium">What are your primary improvement goals? *</Label>
          </div>
          <p className="text-sm text-muted-foreground">Select all that apply</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {improvementGoals.map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <input
                  type="checkbox"
                  id={id}
                  checked={formData.improvementGoals!.includes(id)}
                  onChange={e => {
                    if (e.target.checked) {
                      updateFormData({
                        improvementGoals: [...(formData.improvementGoals || []), id]
                      });
                    } else {
                      updateFormData({
                        improvementGoals: (formData.improvementGoals || []).filter(g => g !== id)
                      });
                    }
                  }}
                  className="aduffy-checkbox"
                />
                <Label htmlFor={id} className="text-sm cursor-pointer flex-1">{label}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPreferencesStep = () => (
    <Card className="aduffy-card max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          ⚙️
        </div>
        <CardTitle className="text-aduffy-navy">Learning Preferences</CardTitle>
        <CardDescription>
          Tell us how you prefer to learn so we can customize your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 text-aduffy-teal">🧠</span>
            <Label className="text-base font-medium">How do you prefer to learn? *</Label>
          </div>
          <p className="text-sm text-muted-foreground">Select all that apply</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {learningPreferences.map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <input
                  type="checkbox"
                  id={id}
                  checked={formData.learningPreferences!.includes(id)}
                  onChange={e => {
                    if (e.target.checked) {
                      updateFormData({
                        learningPreferences: [...(formData.learningPreferences || []), id]
                      });
                    } else {
                      updateFormData({
                        learningPreferences: (formData.learningPreferences || []).filter(p => p !== id)
                      });
                    }
                  }}
                  className="aduffy-checkbox"
                />
                <Label htmlFor={id} className="text-sm cursor-pointer flex-1">{label}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 text-aduffy-orange">⚠️</span>
            <Label className="text-base font-medium">What are your biggest pain points when it comes to communication? *</Label>
          </div>
          <p className="text-sm text-muted-foreground">Select all that apply</p>
          <div className="grid grid-cols-1 gap-3">
            {primaryPainPoints.map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <input
                  type="checkbox"
                  id={id}
                  checked={formData.primaryPainPoints!.includes(id)}
                  onChange={e => {
                    if (e.target.checked) {
                      updateFormData({
                        primaryPainPoints: [...(formData.primaryPainPoints || []), id]
                      });
                    } else {
                      updateFormData({
                        primaryPainPoints: (formData.primaryPainPoints || []).filter(p => p !== id)
                      });
                    }
                  }}
                  className="aduffy-checkbox"
                />
                <Label htmlFor={id} className="text-sm cursor-pointer flex-1">{label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-aduffy-yellow/5 p-6 rounded-lg border border-aduffy-yellow/20">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 text-aduffy-yellow mt-1 flex-shrink-0">🏆</span>
            <div>
              <h3 className="font-semibold text-aduffy-navy mb-2">You're almost ready!</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Based on your responses, we'll create a personalized learning path that focuses on your specific challenges and goals.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 text-aduffy-teal">✅</span>
                  Customized vocabulary for your field
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 text-aduffy-teal">✅</span>
                  Scenarios matching your experience level
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 text-aduffy-teal">✅</span>
                  Activities aligned with your learning style
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return renderPersonalStep();
      case 'professional':
        return renderProfessionalStep();
      case 'assessment':
        return renderAssessmentStep();
      case 'goals':
        return renderGoalsStep();
      case 'preferences':
        return renderPreferencesStep();
      default:
        return renderPersonalStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-aduffy-yellow/5 via-background to-aduffy-teal/5 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-learning rounded-xl flex items-center justify-center shadow-lg text-4xl">
              🧠
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-aduffy-navy">ADuffy Learning</h1>
              <p className="text-lg text-muted-foreground">Professional Communication Excellence</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-aduffy-navy">
              {steps.find(s => s.key === currentStep)?.title}
            </h2>
            <Badge className="aduffy-badge-primary">
              Step {currentStepIndex + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {steps.find(s => s.key === currentStep)?.description}
          </p>
        </div>

        {/* Step Content */}
        <div className="mb-12">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button
            onClick={handleBack}
            disabled={currentStep === 'personal'}
            className="border-aduffy-yellow/30 text-aduffy-navy hover:bg-aduffy-yellow/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="aduffy-button"
          >
            {currentStep === 'preferences' ? (
              <>
                Complete Setup
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStepIndex
                    ? 'bg-aduffy-yellow'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}