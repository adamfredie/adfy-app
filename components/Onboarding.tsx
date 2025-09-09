import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";


import { Label } from "./ui/label";
import { 
  Presentation, Users, Mail, 
  Settings, Phone, Video, FileText, AlertTriangle ,
  Star, Brain, MessageSquare, TrendingUp, Award, 
  Sparkles, Target
} from "lucide-react";


// Keep the original interface for backward compatibility
export interface OnboardingData {
  name?: string;
  gender?: string;
  avatarUrl?: string;
  email: string;
  jobTitle: string;
  company: string;
  industry?: string;
  experience?: string;
  // This is  for Professional field 
  fieldOfInterest?: string;

  vocabularyLevel: string;
  learningGoals: string;
  
  // New communication assessment properties
  field?: string;
  experienceLevel?: string;
  // Communication confidence properties
  communicationConfidence?: {
    presentations?: number;
    meetings?: number;
    emails?: number;
    networking?: number;
    teamCollaboration?: number;
  };
  communicationChallenges?: string[];
  improvementGoals?: string[];
  currentSkillLevel?: string;
}

interface OnboardingProps {
  // Remove onComplete prop - we'll use navigation instead
}


type Step = 'personal' | 'professional' | 'assessment' | 'goals' | 'goals-part2';
// Array of objects
const communicationChallenges = [
  { id: 'public-speaking', label: 'Public speaking +  presentations', icon:<Presentation/> },
  { id: 'meeting-participation', label: 'Active participation in meetings', icon:<Users/> },
  { id: 'email-clarity', label: 'Writing professional emails', icon: <Mail /> },
  { id: 'difficult-conversations', label: 'Having difficult conversations', icon:<MessageSquare/> },
  { id: 'networking', label: 'Professional networking', icon: <TrendingUp/> },
  { id: 'cross-team-collaboration', label: 'Cross-team collaboration', icon: <Settings/>  },
  { id: 'client-communication', label: 'Client communication', icon: <Phone /> },
  { id: 'virtual-meetings', label: 'Virtual meeting facilitation', icon: <Video />},
  { id: 'persuasive-writing', label: 'Persuasive writing + proposals', icon: <FileText/> },
  { id: 'conflict-resolution', label: 'Conflict resolution', icon: <AlertTriangle/> }
]
// Array of objects
const improvementGoals = [
  { id: 'confidence', label: 'Build confidence in speaking', icon: <Star /> },
  { id: 'vocabulary', label: 'Expand professional vocabulary', icon: <Brain /> },
  { id: 'clarity', label: 'Improve message clarity', icon: <MessageSquare /> },
  { id: 'persuasion', label: 'Enhance persuasive communication', icon: <TrendingUp /> },
  { id: 'leadership', label: 'Develop leadership communication', icon: <Award /> },
  { id: 'storytelling', label: 'Master storytelling techniques', icon: <Sparkles /> },
  { id: 'active-listening', label: 'Improve active listening skills', icon: <Users /> },
  { id: 'emotional-intelligence', label: 'Enhance emotional intelligence', icon: <Target /> }
];
// Onboarding function starts from here
export function Onboarding() {
  const navigate = useNavigate();
  // Add useAuth hook at the top level of the component
  const { user, updateUserProfile, isAuthenticated, loading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    gender: '',
    avatarUrl: '',
    email: user?.email || '', // Add the required email property
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
    currentSkillLevel: '',
    
  });

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="onboarding-wrapper">
        <div className="onboarding-mobile-container">
          <div className="onboarding-header">
            <h1 className="onboarding-title">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  // Ensure user is authenticated
  if (!isAuthenticated || !user) {
    console.log('Onboarding: User not authenticated, redirecting to welcome');
    navigate('/welcome');
    return null;
  }

  // Update email in form data when user is available
  React.useEffect(() => {
    if (user?.email && user.email !== formData.email) {
      updateFormData({ email: user.email });
    }
  }, [user?.email, formData.email]);

  // Debug logging
  React.useEffect(() => {
    console.log('🔍 Onboarding component mounted:', {
      isAuthenticated,
      user: user?.email,
      loading,
      currentStep
    });
  }, [isAuthenticated, user?.email, loading, currentStep]);

  const steps: { key: Step; title: string; description: string }[] = [
    { key: 'personal', title: 'Personal Info', description: 'Tell us about yourself' },
    { key: 'professional', title: 'Professional Background', description: 'Your work context' },
    { key: 'assessment', title: 'Communication Assessment', description: 'Rate your current skills' },
    { key: 'goals', title: 'Goals & Challenges', description: 'What you want to improve' },
    { key: 'goals-part2', title: 'Improvement Goals', description: 'What you want to improve' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;// calculates the progress percentage based on the current step index and the total number of steps

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };
// Function used for creating the default onboarding data
  const createDefaultOnboardingData = (): OnboardingData => {
    return {
      ...formData,
      email: user?.email || '', // Add the required email property
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
      
      // Learning goals summary
      learningGoals: 'Improve professional communication confidence and expand vocabulary'
    };
  };




  const handleCompleteSetup = async () => {

  console.log("handleCompleteSetup function started");
  
  try {
    if (!isAuthenticated || !user) {
      throw new Error("No authenticated user found");
    }

    // Prepare the final onboarding data
    const finalData: OnboardingData = {
      ...formData,
      email: user?.email || '', // Add the required email property
      fieldOfInterest: formData.field || formData.fieldOfInterest || '',
      vocabularyLevel: mapSkillLevelToVocabularyLevel(formData.currentSkillLevel || ''),
      learningGoals: (formData.improvementGoals && formData.improvementGoals.length > 0)
        ? `Focus on: ${formData.improvementGoals.map(goal => 
            improvementGoals.find(ig => ig.id === goal)?.label || goal
          ).join(', ')}`
        : formData.learningGoals || ''
    };

    // If no avatar yet, generate based on gender once and persist
    if (!finalData.avatarUrl) {
      finalData.avatarUrl = generateAvatarUrl(finalData.gender, user?.id);
    }
    
    console.log("Fetching the data");
    console.log("Final data prepared:", finalData);
    console.log("About to call updateUserProfile...");
    
    try {
      // Use the centralized profile update method
      await updateUserProfile(finalData);
      console.log("updateUserProfile completed successfully");
    } catch (updateError: any) {
      console.error("❌ updateUserProfile failed:", updateError);
      console.error("❌ Error details:", {
        message: updateError.message,
        stack: updateError.stack,
        name: updateError.name
      });
      throw updateError; // Re-throw timage.pngo be caught by outer catch
    }
    
    console.log("The data was stored in the user profile", finalData);
    
    // Store locally as backup (optional)
    localStorage.setItem('aduffy-onboarding-completed', 'true');
    localStorage.setItem('aduffy-user-profile', JSON.stringify(finalData));
    console.log("Local storage updated");
    
    // Proceed to dashboard
    console.log("Onboarding completed successfully, navigating to dashboard...");
    navigate('/app/dashboard');
    
  } catch (error: any) {
    console.error('Error during setup:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    alert(`Setup failed: ${error.message}`);
  }
};




// ... existing code ...

  const handleSkipToEnd = () => {
    const defaultData = createDefaultOnboardingData();
    // Navigate to main app instead of calling onComplete
    navigate('/app/dashboard');
  };

  const handleNext = () => {
    const stepOrder: Step[] = ['personal', 'professional', 'assessment', 'goals', 'goals-part2'];
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
      
      // Navigate to main app instead of calling onComplete
      navigate('/app/dashboard');
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ['personal', 'professional', 'assessment', 'goals', 'goals-part2'];
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

  const generateAvatarUrl = (genderValue?: string, seedBase?: string): string => {
    const seed = (seedBase || formData.name || user?.id || 'adfy-user') + '-' + Math.floor(Math.random() * 100000);
    // Choose a dicebear style roughly aligned with gender
    const style = genderValue === 'male'
      ? 'adventurer'
      : genderValue === 'female'
      ? 'avataaars'
      : 'identicon';
    // Use PNG for broader rendering support
    return `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(seed)}&radius=50`;
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 'personal':
        return !!(formData.name);
      case 'professional':
        return !!(formData.jobTitle && formData.field && formData.experienceLevel);
      case 'assessment':
        return formData.currentSkillLevel !== '';
      case 'goals':
        return formData.communicationChallenges!.length > 0 && formData.improvementGoals!.length > 0;
        case 'goals-part2':
      return formData.improvementGoals!.length > 0;
      default:
        return false;
    }
  };

const renderPersonalStep = () => (
  <div className="onboarding-mobile-container">
    {/* Header */}
    <div className="onboarding-header">

      <div className="divIconContainer">
        <img src='/aduffy-logo.png' alt="aduffy logo" decoding="async" fetchPriority="high" height={30} width={80}/>
      <h1 className="onboarding-title">
        Let's get to know you better to personalize your learning experience
      </h1>
      </div>
    </div>

    {/* Form Fields */}
    <form 
      className="onboarding-form" 
      onSubmit={(e) => {
        e.preventDefault(); // prevent page reload
        setCurrentStep('professional'); // move to next step
      }}
    >
      <div className="form-field">
        <Label htmlFor="name" className="field-label mt-2">What's your name?</Label>
        <Input
          id="name"
          type="text"
          autoComplete="off"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="Enter your name"
          className="mobile-input"
          required
        />
      </div>

      <div className="form-field">
        <Label htmlFor="gender" className="field-label mt-2">Gender</Label>
        <div className="select-wrapper">
          <select
            id="gender"
            value={formData.gender || ''}
            onChange={(e) => updateFormData({ gender: e.target.value })}
            className="mobile-select"
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
            <option value="other">Other</option>
          </select>
          <svg className="select-arrow" width="12" height="12" viewBox="6 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Continue Button */}
      <div className="onboarding-actions ">
        <Button
          type="submit"
          disabled={!formData.name}
          className="continue-button"
        >
          Continue
        </Button>

      </div>
     <div className="centerDiv flex items-center justify-center">

                  <button 
                 onClick={()=> {navigate("/welcome")}}
                 className="back-button-signup"
               >
                 <svg width="24" height="24" viewBox="6 0 24 24" fill="none">
                   <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </button>
      </div>
    </form>
  </div>
);


  const renderProfessionalStep = () => (
    <div className="onboarding-mobile-container">
      {/* Header */}
      <div className="onboarding-header">
        <div className="divIconContainer">

          <img src='/aduffy-logo.png' alt="aduffy logo" decoding="async" fetchPriority="high" height={30} width={80} />
    

        <h1 className="onboarding-title">Professional Background</h1>
        <p className="onboarding-subtitle">
          Help us understand your professional context for better personalization
        </p>
        </div>
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
            <svg className="select-arrow" width="12" height="12" viewBox="6 0 24 24" fill="none">
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
            <svg className="select-arrow" width="12" height="12" viewBox="6 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
       <div className="onboarding-actions ">
        <Button
          onClick={() => setCurrentStep('assessment')}
          disabled={!formData.jobTitle || !formData.field || !formData.experienceLevel}
          className="continue-button"
        >
      Continue
        </Button>
      </div>

      <div className="centerDiv flex items-center justify-center">

                  <button 
                 onClick={() => setCurrentStep('personal')}
                 className="back-button-signup"
               >
                 <svg width="24" height="24" viewBox="6 0 24 24" fill="none">
                   <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </button>
      </div>
      </div>
       {/* Continue Button */}
    </div>
  );

  const renderAssessmentStep = () => (
    <div className="onboarding-mobile-container">
      {/* Header */}
      <div className="onboarding-header">
        <div className="divIconContainer">
          <img src='/aduffy-logo.png' alt="aduffy logo" decoding="async" fetchPriority="high" height={30} width={80} />
      


        <h1 className="onboarding-title">Communication Skills Assessment</h1>
        <p className="onboarding-subtitle">
          Rate your current confidence level in these communication areas (1 = Not confident, 5 = Very confident)
        </p>
        </div>
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
              <div className="skill-level-options">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="skill-level-option">
                    <input
                      type="radio"
                      name={`communicationConfidence-${key}`}
                      value={rating}
                      checked={value === rating}
                      onChange={() => updateFormData({
                        communicationConfidence: {
                          ...formData.communicationConfidence!,
                          [key]: rating
                        }
                      })}
                    />
                    <span className="radio-custom"></span>
                    <span className="option-label">{rating}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        <div className="assessment-question">
          <Label className="question-label">
            Overall, how would you rate your current professional communication skills?
          </Label>
          <div className="skill-level-options-level">
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
       <div className="onboarding-actions ">
         <Button
           onClick={() => setCurrentStep('goals')}
           disabled={!formData.currentSkillLevel}
           className="continue-button"
         >
           Continue
         </Button>
       </div>

       <div className="centerDiv flex items-center justify-center">

                  <button 
                   onClick={() => setCurrentStep('professional')}
                 className="back-button-signup"
               >
                 <svg width="24" height="24" viewBox="6 0 24 24" fill="none">
                   <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </button>
      </div>
       </div>
 
       {/* Continue Button */}
     </div>
   );


   const renderGoalsStep = () => (
    <div className="onboarding-mobile-container">
      {/* Header */}
      <div className="onboarding-header">
        <div className="divIconContainer">

          <img src='/aduffy-logo.png' alt="aduffy logo" decoding="async" fetchPriority="high" height={30} width={80} />
        

        <h1 className="onboarding-title">Challenges You Currently Face</h1>
        <p className="onboarding-subtitle">
          Help us understand what you want to improve and what challenges you face
        </p>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="onboarding-form">
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
      <div className="onboarding-form-challenge ">
        <Button
          onClick={() => setCurrentStep('goals-part2')}
          disabled={formData.communicationChallenges!.length === 0}
          className="continue-button"
        >
          Continue
        </Button>

      </div>


      <div className="centerDiv flex items-center justify-center">

                  <button 
                   onClick={() => setCurrentStep('assessment')}
                 className="back-button-signup"
               >
                 <svg width="24" height="24" viewBox="6 0 24 24" fill="none">
                   <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </button>
      </div>
        </div>

        
       

      {/* Continue Button */}
    </div>
  );
   const renderGoalsStepPart2 = () => (
    <div className="onboarding-mobile-container">
      {/* Header */}
      <div className="onboarding-header">
        <div className="divIconContainer">
          <img src='/aduffy-logo.png' alt="aduffy logo" decoding="async" fetchPriority="high" height={30} width={80} />
    


        <h1 className="onboarding-title">What Do You Want to Improve?</h1>
        <p className="onboarding-subtitle">
          Help us understand what you want to improve and what challenges you face
        </p>
        </div>
        
      </div>

      {/* Challenges Section */}
      <div className="onboarding-form">
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
      <div className="onboarding-actions onboarding-form-challenge ">
         <Button
          onClick={handleCompleteSetup}
          // disabled={formData.communicationChallenges!.length === 0 || formData.improvementGoals!.length === 0}
          disabled={formData.improvementGoals!.length === 0}
          className="complete-setup-button"
        >
          Complete Setup
        </Button>
      </div>

      <div className="centerDiv flex items-center justify-center">

                  <button 
                   onClick={() => setCurrentStep('goals')}
                 className="back-button-signup"
               >
                 <svg width="24" height="24" viewBox="6 0 24 24" fill="none">
                   <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </button>
      </div>
      </div>

      
    </div>
  );
  // Redering each step of the onboarding process by using switch case
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
