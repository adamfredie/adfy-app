import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CiSettings,CiMail,CiPhone,CiStar  } from "react-icons/ci";
import { LuPresentation,LuBrain } from "react-icons/lu";
import { IoPeopleOutline,IoVideocamOutline  } from "react-icons/io5";
import { FiMessageSquare,FiTarget} from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { VscGraph } from "react-icons/vsc";
import { CgDanger } from "react-icons/cg";
import { BsStars } from "react-icons/bs";
import { PiMedalLight } from "react-icons/pi";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

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
    presentations?: number;
    meetings?: number;
    emails?: number;
    networking?: number;
    teamCollaboration?: number;
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

type Step = 'personal' | 'professional' | 'assessment' | 'goals' |'goals-part2' | 'preferences';

const communicationChallenges = [
  { id: 'public-speaking', label: 'Public speaking and presentations', icon:<LuPresentation/> },
  { id: 'meeting-participation', label: 'Active participation in meetings', icon: <IoPeopleOutline/> },
  { id: 'email-clarity', label: 'Writing clear and professional emails', icon: <CiMail /> },
  { id: 'difficult-conversations', label: 'Having difficult conversations', icon:<FiMessageSquare/> },
  { id: 'networking', label: 'Professional networking', icon: <FaArrowTrendUp/> },
  { id: 'cross-team-collaboration', label: 'Cross-team collaboration', icon: <CiSettings/>  },
  { id: 'client-communication', label: 'Client communication', icon: <CiPhone /> },
  { id: 'virtual-meetings', label: 'Virtual meeting facilitation', icon: <IoVideocamOutline />},
  { id: 'persuasive-writing', label: 'Persuasive writing and proposals', icon: <VscGraph/> },
  { id: 'conflict-resolution', label: 'Conflict resolution', icon: <CgDanger/> }
];

const improvementGoals = [
  { id: 'confidence', label: 'Build confidence in speaking',icon: <CiStar /> },
  { id: 'vocabulary', label: 'Expand professional vocabulary', icon: <LuBrain /> },
  { id: 'clarity', label: 'Improve message clarity', icon: <FiMessageSquare/> },
  { id: 'persuasion', label: 'Enhance persuasive communication' , icon: <FaArrowTrendUp/>},
  { id: 'leadership', label: 'Develop leadership communication' , icon: <PiMedalLight/> },
  { id: 'storytelling', label: 'Master storytelling techniques', icon: <BsStars/> },
  { id: 'active-listening', label: 'Improve active listening skills', icon: <IoPeopleOutline/> },
  { id: 'emotional-intelligence', label: 'Enhance emotional intelligence',icon:<FiTarget/> }
];

const learningPreferences = [
  { id: 'interactive', label: 'Interactive exercises and quizzes', icon: '🧠' },
  { id: 'real-scenarios', label: 'Real workplace scenarios', icon: '🏢' },
  { id: 'voice-practice', label: 'Voice and speaking practice', icon: '🎤' },
  { id: 'writing-exercises', label: 'Writing and composition exercises', icon: '✍️' },
  { id: 'peer-feedback', label: 'Peer feedback and collaboration', icon: '🤝' },
  { id: 'gamification', label: 'Gamified learning experience', icon: '🎮' },
  { id: 'bite-sized', label: 'Short, bite-sized lessons', icon: '⏱️' },
  { id: 'comprehensive', label: 'Comprehensive deep-dive sessions', icon: '🔎' }
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
      presentations: undefined,
      meetings: undefined,
      emails: undefined,
      networking: undefined,
      teamCollaboration: undefined
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
    { key: 'goals-part2', title: 'Improvement Goals', description: 'What you want to improve' },
    { key: 'preferences', title: 'Learning Preferences', description: 'How you like to learn' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;// calculates the progress percentage based on the current step index and the total number of steps

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
        presentations: undefined,
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
   const handleCompleteSetup = () => {
    // Create the final onboarding data
    const finalData: OnboardingData = {
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
    
    // Call the onComplete callback to transition to dashboard
    onComplete(finalData);
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
        case 'goals-part2':
      return formData.improvementGoals!.length > 0;
      case 'preferences':
        return formData.learningPreferences!.length > 0 && formData.primaryPainPoints!.length > 0;
      default:
        return false;
    }
  };

  const renderPersonalStep = () => (
    <div className="onboarding-mobile-container">
      {/* Header */}
      <div className="onboarding-header">
        <button 
          onClick={() => setCurrentStep('personal')}
          className="back-button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="onboarding-title">
          Let's get to know you better to personalize your learning experience
        </h1>
      </div>

      {/* Form Fields */}
      <div className="onboarding-form">
        <div className="form-field">
          <Label htmlFor="name" className="field-label">What's your name?</Label>
          <Input
            id="name"
            type="text"
            autoComplete="off"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter your name"
            className="mobile-input"
          />
        </div>
        <div className="form-field">
          <Label htmlFor="email" className="field-label">What's your email?</Label>
          <Input
            id="email"
            type="email"
            autoComplete="off"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="Enter your email"
            className="mobile-input"
          />
        </div>
      </div>

      {/* Continue Button */}
      <div className="onboarding-actions">
        <Button
          onClick={() => setCurrentStep('professional')}
          disabled={!formData.name || !formData.email}
          className="continue-button"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderProfessionalStep = () => (
    <div className="onboarding-mobile-container">
      {/* Header */}
      <div className="onboarding-header">
        <button 
          onClick={() => setCurrentStep('personal')}
          className="back-button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="onboarding-title">Professional Background</h1>
        <p className="onboarding-subtitle">
          Help us understand your professional context for better personalization
        </p>
      </div>

      {/* Form Fields */}
      <div className="onboarding-form">
        <div className="form-field">
          <Label htmlFor="jobTitle" className="field-label">Job Title</Label>
          <Input
            id="jobTitle"
            type="text"
            autoComplete="off"
            value={formData.jobTitle}
            onChange={(e) => updateFormData({ jobTitle: e.target.value })}
            placeholder="Enter your job title"
            className="mobile-input"
          />
        </div>
        <div className="form-field">
          <Label htmlFor="company" className="field-label">Company</Label>
          <Input
            id="company"
            type="text"
            autoComplete="off"
            value={formData.company}
            onChange={(e) => updateFormData({ company: e.target.value })}
            placeholder="Enter your company name"
            className="mobile-input"
          />
        </div>

        <div className="form-field">
          <Label htmlFor="field" className="field-label">Professional Field</Label>
          <div className="select-wrapper">
            <select
              id="field"
              value={formData.field || ''}
              onChange={(e) => updateFormData({ field: e.target.value, fieldOfInterest: e.target.value })}
              className="mobile-select"
            >
              <option value="">Choose your professional field</option>
              <option value="marketing">Marketing</option>
              <option value="technology">Technology</option>
              <option value="sales">Sales</option>
              <option value="product">Product Management</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
            <svg className="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            </div>
        </div>

        <div className="form-field">
          <Label htmlFor="experienceLevel" className="field-label">Experience Level</Label>
          <div className="select-wrapper">
            <select
              id="experienceLevel"
              value={formData.experienceLevel || ''}
              onChange={(e) => updateFormData({ experienceLevel: e.target.value })}
              className="mobile-select"
            >
              <option value="">Choose your experience level</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-7 years)</option>
              <option value="senior">Senior Level (8-12 years)</option>
              <option value="executive">Executive Level (13+ years)</option>
            </select>
            <svg className="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
       {/* Continue Button */}
       <div className="onboarding-actions">
        <Button
          onClick={() => setCurrentStep('assessment')}
          disabled={!formData.jobTitle || !formData.field || !formData.experienceLevel}
          className="continue-button"
        >
      Continue
        </Button>
      </div>
    </div>
  );

  const renderAssessmentStep = () => (
    <div className="onboarding-mobile-container">
      {/* Header */}
      <div className="onboarding-header">
        <button 
          onClick={() => setCurrentStep('professional')}
          className="back-button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="onboarding-title">Communication Skills Assessment</h1>
        <p className="onboarding-subtitle">
          Rate your current confidence level in these communication areas (1 = Not confident, 5 = Very confident)
        </p>
      </div>

      {/* Assessment Questions */}
      <div className="onboarding-form">
        {Object.entries(formData.communicationConfidence || {}).map(([key, value]) => {
          const labelMap: Record<string, string> = {
            presentations: 'Giving Presentations',
            meetings: 'Leading/Participating in meetings',
            emails: 'Writing professional emails',
            networking: 'Professional Networking',
            teamCollaboration: 'Team Collaboration',
          };
          return (
            <div key={key} className="assessment-question">
              <Label className="question-label">{labelMap[key] || key}</Label>
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={`rating-btn ${value === rating ? 'selected' : ''}`}
                    onClick={() => updateFormData({
                      communicationConfidence: {
                        ...formData.communicationConfidence!,
                        [key]: rating
                      }
                    })}
                  >
                    <span>{rating}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="assessment-question">
          <Label className="question-label">
            Overall, how would you rate your current professional communication skills?
          </Label>
          <div className="skill-level-options">
            {[
               { value: "beginner", label: "Beginner" },
               { value: "intermediate", label: "Intermediate" },
               { value: "advanced", label: "Advanced" },
               { value: "expert", label: "Expert" },
             ].map(option => (
               <label key={option.value} className="skill-level-option">
                 <input
                   type="radio"
                   name="currentSkillLevel"
                   value={option.value}
                   checked={formData.currentSkillLevel === option.value}
                   onChange={() => updateFormData({ currentSkillLevel: option.value })}
                 />
                 <span className="radio-custom"></span>
                 <span className="option-label">{option.label}</span>
               </label>
             ))}
           </div>
         </div>
       </div>
 
       {/* Continue Button */}
       <div className="onboarding-actions">
         <Button
           onClick={() => setCurrentStep('goals')}
           disabled={!formData.currentSkillLevel}
           className="continue-button"
         >
           Continue
         </Button>
       </div>
     </div>
   );


   const renderGoalsStep = () => (
    <div className="onboarding-mobile-container">
      {/* Header */}
      <div className="onboarding-header">
        <button 
          onClick={() => setCurrentStep('assessment')}
          className="back-button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="onboarding-title">Goals & Challenges</h1>
        <p className="onboarding-subtitle">
          Help us understand what you want to improve and what challenges you face
        </p>
      </div>

      {/* Challenges Section */}
      <div className="onboarding-form">
        <div className="section-question">
          <Label className="question-label">What communication challenges do you currently face?</Label>
          <p className="question-hint">Select all that apply</p>
        </div>

        <div className="challenges-grid">
          {communicationChallenges.map(({ id, label, icon }) => (
            <label
              key={id}
              className={`challenge-option ${formData.communicationChallenges!.includes(id) ? 'selected' : ''}`}
            >
               <input
                type="checkbox"
                checked={formData.communicationChallenges!.includes(id)}
                onChange={(e) => {
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
              />
              <div className="challenge-icon">{icon}</div>
              <span className="challenge-label">{label}</span>
            </label>
          ))}
        </div>
        </div>

        
       

      {/* Continue Button */}
      <div className="onboarding-actions">
        <Button
          // onClick={() => setCurrentStep('preferences')}
          // disabled={formData.communicationChallenges!.length === 0 || formData.improvementGoals!.length === 0}
          onClick={() => setCurrentStep('goals-part2')}
          disabled={formData.communicationChallenges!.length === 0}
          className="continue-button"
        >
          Continue
        </Button>

      </div>
    </div>
  );
   const renderGoalsStepPart2 = () => (
    <div className="onboarding-mobile-container">
      {/* Header */}
      <div className="onboarding-header">
        <button 
          onClick={() => setCurrentStep('assessment')}
          className="back-button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="onboarding-title">Goals & Challenges</h1>
        <p className="onboarding-subtitle">
          Help us understand what you want to improve and what challenges you face
        </p>
      </div>

      {/* Challenges Section */}
      <div className="onboarding-form">
       

       

        <div className="section-question">
          <Label className="question-label">What are your primary improvement goals?</Label>
          <p className="question-hint">Select all that apply</p>
        </div>

        <div className="goals-grid">
          {improvementGoals.map(({ id, label, icon }) => (
            <label
              key={id}
              className={`goal-option ${formData.improvementGoals!.includes(id) ? 'selected' : ''}`}
            >
               <input
                type="checkbox"
                checked={formData.improvementGoals!.includes(id)}
                onChange={(e) => {
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
              />
              <div className="goal-icon">{icon}</div>
              <span className="goal-label">{label}</span>
            </label>
          ))}
        </div>
      </div>

      
      <div className="onboarding-actions">
         <Button
          onClick={handleCompleteSetup}
          // disabled={formData.communicationChallenges!.length === 0 || formData.improvementGoals!.length === 0}
          disabled={formData.improvementGoals!.length === 0}
          className="complete-setup-button"
        >
          Complete Setup
        </Button>
      </div>
    </div>
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
        case 'goals-part2':
          return renderGoalsStepPart2();
      // case 'preferences':
      //   return renderPreferencesStep();
      default:
        return renderPersonalStep();
    }
  };

  return (
    <div className="onboarding-wrapper">
      {renderStepContent()}
    </div>
  );
}
