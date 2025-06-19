import React from "react";
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert } from "./ui/alert";
import { OnboardingData } from "./Onboarding";

interface SettingsProps {
  onBack: () => void;
  userProfile: OnboardingData | null;
  onProfileUpdate: (profile: OnboardingData) => void;
}

export function Settings({ onBack, userProfile, onProfileUpdate }: SettingsProps) {
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string | null>(
    localStorage.getItem('aduffy-profile-picture')
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state - initialize with current user profile
  const [formData, setFormData] = useState<OnboardingData>({
    vocabularyLevel: userProfile?.vocabularyLevel || 'intermediate',
    fieldOfInterest: userProfile?.fieldOfInterest || '',
    jobTitle: userProfile?.jobTitle || '',
    company: userProfile?.company || '',
    industry: userProfile?.industry || '',
    experience: userProfile?.experience || '',
    learningGoals: userProfile?.learningGoals || ''
  });

  // Save status
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const fields = [
    { id: "marketing", name: "Marketing & Advertising", icon: TrendingUp, description: "Brand strategy, campaigns, digital marketing" },
    { id: "it", name: "Information Technology", icon: Zap, description: "Software development, systems, cybersecurity" },
    { id: "sales", name: "Sales & Business Development", icon: Target, description: "Client relations, negotiations, revenue growth" },
    { id: "product", name: "Product Management", icon: Brain, description: "Product strategy, development, user experience" },
    { id: "finance", name: "Finance & Accounting", icon: TrendingUp, description: "Financial analysis, budgeting, investments" },
    { id: "hr", name: "Human Resources", icon: Users, description: "Talent management, recruitment, culture" },
    { id: "operations", name: "Operations & Logistics", icon: Building, description: "Supply chain, process improvement, efficiency" },
    { id: "consulting", name: "Consulting & Strategy", icon: Award, description: "Business strategy, problem-solving, analysis" }
  ];

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Manufacturing", 
    "Retail", "Consulting", "Real Estate", "Media & Entertainment", 
    "Non-profit", "Government", "Automotive", "Energy", "Other"
  ];

  const experienceLevels = [
    "Entry Level (0-2 years)", "Mid Level (3-5 years)", "Senior Level (6-10 years)", 
    "Executive Level (10+ years)", "C-Suite/Leadership"
  ];

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicture(result);
        localStorage.setItem('aduffy-profile-picture', result);
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    localStorage.removeItem('aduffy-profile-picture');
    setHasUnsavedChanges(true);
  };

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile
      onProfileUpdate(formData);
      
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const getUserInitials = () => {
    if (formData.jobTitle) {
      const parts = formData.jobTitle.split(' ');
      return parts.length > 1 
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    }
    return 'AL';
  };

  const getVocabularyLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'aduffy-badge-info';
      case 'intermediate': return 'aduffy-badge-warning';
      case 'advanced': return 'aduffy-badge-success';
      default: return 'aduffy-badge-primary';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            className="aduffy-button-icon hover:bg-aduffy-yellow/10"
          >
            {ArrowLeft}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-aduffy-navy">Settings</h1>
            <p className="text-muted-foreground">Manage your profile and learning preferences</p>
          </div>
        </div>

        {hasUnsavedChanges && (
          <Button
            onClick={handleSaveChanges}
            disabled={saveStatus === 'saving'}
            className="aduffy-button"
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save />
                Save Changes
              </>
            )}
          </Button>
        )}
      </div>

      {/* Save Status Alert */}
      {saveStatus === 'saved' && (
        <Alert className="border-success bg-success/10">
          <CheckCircle />
          <div className="text-success text-sm mt-2">
            Your settings have been saved successfully!
          </div>
        </Alert>
      )}

      {saveStatus === 'error' && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle />
          <div className="text-destructive text-sm mt-2">
            There was an error saving your settings. Please try again.
          </div>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-12">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-aduffy-yellow data-[state=active]:text-aduffy-navy font-medium"
          >
            <User />
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="data-[state=active]:bg-aduffy-yellow data-[state=active]:text-aduffy-navy font-medium"
          >
            <Target />
            Learning Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-8">
          <Card className="aduffy-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-aduffy-navy">
                <div className="w-10 h-10 bg-aduffy-yellow/20 rounded-full flex items-center justify-center">
                  <Camera />
                </div>
                Profile Picture
              </CardTitle>
              <CardDescription>
                Upload a profile picture to personalize your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                {/* Current Profile Picture */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24 border-2 border-border">
                    {profilePicture ? (
                      <AvatarImage src={profilePicture} alt="Profile picture" />
                    ) : null}
                    <AvatarFallback className="bg-aduffy-teal text-white text-xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {profilePicture && (
                    <Button
                      onClick={handleRemoveProfilePicture}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 />
                      Remove
                    </Button>
                  )}
                </div>

                {/* Upload Area */}
                <div className="flex-1">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging 
                        ? 'border-aduffy-yellow bg-aduffy-yellow/10' 
                        : 'border-border hover:border-aduffy-yellow/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-aduffy-navy mb-2">
                      {isDragging ? 'Drop your image here' : 'Upload Profile Picture'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop an image here, or click to select
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="mb-2"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Supports: JPG, PNG, GIF (max 5MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Information */}
          <Card className="aduffy-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-aduffy-navy">
                <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                  <Briefcase />
                </div>
                Professional Information
              </CardTitle>
              <CardDescription>
                Update your job title, company, and professional details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="e.g., Marketing Manager"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Your current company"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    options={industries.map(industry => ({ label: industry, value: industry.toLowerCase() }))}
                    value={formData.industry}
                    onChange={e => handleInputChange('industry', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select
                    options={experienceLevels.map(level => ({ label: level, value: level }))}
                    value={formData.experience}
                    onChange={e => handleInputChange('experience', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningGoals">Learning Goals</Label>
                <Textarea
                  id="learningGoals"
                  value={formData.learningGoals}
                  onChange={(e) => handleInputChange('learningGoals', e.target.value)}
                  placeholder="What specific vocabulary skills would you like to develop?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-8">
          {/* Vocabulary Level */}
          <Card className="aduffy-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-aduffy-navy">
                <div className="w-10 h-10 bg-aduffy-teal/20 rounded-full flex items-center justify-center">
                  <Brain />
                </div>
                Vocabulary Level
                <Badge className={getVocabularyLevelColor(formData.vocabularyLevel)}>
                  Current: {formData.vocabularyLevel.charAt(0).toUpperCase() + formData.vocabularyLevel.slice(1)}
                </Badge>
              </CardTitle>
              <CardDescription>
                Your vocabulary level affects the difficulty of words and exercises you receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <Card 
                    key={level}
                    className={`cursor-pointer transition-all duration-200 ${
                      formData.vocabularyLevel === level 
                        ? 'border-aduffy-yellow bg-aduffy-yellow/5 shadow-md' 
                        : 'hover:border-aduffy-yellow/50 hover:shadow-md'
                    }`}
                    onClick={() => handleInputChange('vocabularyLevel', level)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        formData.vocabularyLevel === level ? 'bg-aduffy-yellow text-white' : 'bg-muted'
                      }`}>
                        <BookOpen />
                      </div>
                      <h3 className="font-semibold text-aduffy-navy mb-2 capitalize">{level}</h3>
                      <p className="text-sm text-muted-foreground">
                        {level === 'beginner' && 'Basic professional vocabulary and simple business terms'}
                        {level === 'intermediate' && 'Moderate complexity with industry-specific terms'}
                        {level === 'advanced' && 'Complex vocabulary and sophisticated business language'}
                      </p>
                      {formData.vocabularyLevel === level && (
                        <CheckCircle />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Field of Interest */}
          <Card className="aduffy-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-aduffy-navy">
                <div className="w-10 h-10 bg-aduffy-orange/20 rounded-full flex items-center justify-center">
                  <Target />
                </div>
                Field of Interest
                {formData.fieldOfInterest && (
                  <Badge className="aduffy-badge-info">
                    {fields.find(f => f.id === formData.fieldOfInterest)?.name}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Choose your professional field to receive relevant vocabulary and examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => {
                  const IconComponent = field.icon;
                  const isSelected = formData.fieldOfInterest === field.id;
                  
                  return (
                    <Card 
                      key={field.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-aduffy-yellow bg-aduffy-yellow/5 shadow-md' 
                          : 'hover:border-aduffy-yellow/50 hover:shadow-md'
                      }`}
                      onClick={() => handleInputChange('fieldOfInterest', field.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-aduffy-yellow text-white' : 'bg-muted'
                          }`}>
                            <IconComponent />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-aduffy-navy mb-1">{field.name}</h3>
                            <p className="text-sm text-muted-foreground">{field.description}</p>
                          </div>
                          {isSelected && (
                            <CheckCircle />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}