import React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Accordion, AccordionItem } from "./ui/accordion";
import { Separator } from "./ui/separator";
import { OnboardingData } from "./Onboarding";

interface DashboardProps {
  onSelectActivity: (activity: string) => void;
  userProfile?: OnboardingData | null;
  activityProgress?: {
    storytelling?: {
      currentStep: number;
      selectedField: string;
      vocabularyWords?: any[];
      quizAnswers?: any[];
      userStory?: string;
      isCompleted?: boolean;
    };
  };
}

export function Dashboard({ onSelectActivity, userProfile, activityProgress }: DashboardProps) {
  const [activeSection, setActiveSection] = useState("main");

  // Get user's first name from the profile name or provide fallback
  const getUserName = () => {
    if (userProfile?.name) {
      // Extract first name from full name
      const nameParts = userProfile.name.trim().split(' ');
      return nameParts[0];
    }
    // Fallback to a generic name if no profile name is available
    return "Alex";
  };

  // Adjust stats based on vocabulary level
  const getStatsBasedOnLevel = () => {
    const baseStats = {
      beginner: { wordsLearned: 89, weeklyGoal: 25, currentStreak: 5, totalScore: 650 },
      intermediate: { wordsLearned: 234, weeklyGoal: 50, currentStreak: 12, totalScore: 1450 },
      advanced: { wordsLearned: 412, weeklyGoal: 75, currentStreak: 18, totalScore: 2890 }
    };

    const level = userProfile?.vocabularyLevel || 'intermediate';
    return baseStats[level as keyof typeof baseStats] || baseStats.intermediate;
  };

  const userStats = {
    ...getStatsBasedOnLevel(),
    level: userProfile?.vocabularyLevel || "Intermediate"
  };

  // Course and teacher information
  const courseInfo = {
    name: "Professional Communication Mastery",
    code: "PCM-2024",
    enrollmentDate: "January 15, 2025",
    status: "Active",
    progress: 68,
    nextMilestone: "Advanced Presentation Skills"
  };

  const teacherInfo = {
    name: "Neelu Sharma",
    designation: "Academic Head",
    credentials: "IELTS Certified, MA Applied Linguistics",
    experience: "8+ years",
    rating: 4.9,
    avatar: "/api/placeholder/64/64",
    email: "neelu.sharma@aduffylearning.com",
    specialization: "Business Communication & IELTS"
  };

  // Weekly schedule data
  const weeklySchedule = [
    {
      id: 1,
      day: "Monday",
      date: "Jan 20, 2025",
      time: "10:00 AM - 11:00 AM",
      topic: "Advanced Vocabulary in Business Context",
      type: "Live Session",
      status: "upcoming",
      joinLink: "https://meet.aduffy.com/vocab-session"
    },
    {
      id: 2,
      day: "Wednesday",
      date: "Jan 22, 2025",
      time: "2:00 PM - 3:00 PM",
      topic: "Presentation Skills & Public Speaking",
      type: "Interactive Workshop",
      status: "upcoming",
      joinLink: "https://meet.aduffy.com/presentation-workshop"
    },
    {
      id: 3,
      day: "Friday",
      date: "Jan 24, 2025",
      time: "11:00 AM - 12:00 PM",
      topic: "AI Storytelling & Creative Writing",
      type: "Practice Session",
      status: "upcoming",
      joinLink: "https://meet.aduffy.com/storytelling-practice"
    },
    {
      id: 4,
      day: "Saturday",
      date: "Jan 25, 2025",
      time: "3:00 PM - 4:00 PM",
      topic: "Mock Interview & Feedback",
      type: "One-on-One",
      status: "upcoming",
      joinLink: "https://meet.aduffy.com/mock-interview"
    }
  ];

  // Personalized recent words based on user's field
  const getPersonalizedWords = () => {
    const fieldBasedWords = {
      marketing: [
        { word: "Segmentation", definition: "Dividing a market into distinct groups of consumers", mastered: true },
        { word: "Conversion", definition: "The process of turning prospects into customers", mastered: true },
        { word: "Attribution", definition: "Determining which marketing efforts led to a sale", mastered: false },
        { word: "Optimization", definition: "Improving campaign performance for better results", mastered: false }
      ],
      it: [
        { word: "Scalability", definition: "A system's ability to handle increased workload", mastered: true },
        { word: "Redundancy", definition: "Duplication of critical system components", mastered: true },
        { word: "Latency", definition: "Delay in data transmission over a network", mastered: false },
        { word: "Integration", definition: "Combining different systems to work together", mastered: false }
      ],
      sales: [
        { word: "Prospecting", definition: "Identifying and qualifying potential customers", mastered: true },
        { word: "Objection", definition: "Customer concerns that prevent purchasing decisions", mastered: true },
        { word: "Pipeline", definition: "Visual representation of sales opportunities", mastered: false },
        { word: "Upselling", definition: "Selling additional or upgraded products to existing customers", mastered: false }
      ],
      default: [
        { word: "Articulate", definition: "Having or showing the ability to speak fluently", mastered: true },
        { word: "Collaborate", definition: "Work jointly on an activity or project", mastered: true },
        { word: "Facilitate", definition: "Make an action or process easier", mastered: false },
        { word: "Synthesize", definition: "Combine elements to form a coherent whole", mastered: false }
      ]
    };

    const field = userProfile?.fieldOfInterest || userProfile?.field || 'default';
    return fieldBasedWords[field as keyof typeof fieldBasedWords] || fieldBasedWords.default;
  };

  const recentWords = getPersonalizedWords();

  const mainActivities = [
    {
      id: 'storytelling',
      title: 'AI Storytelling',
      icon: 'BookOpen',
      description: 'Build vocabulary through interactive storytelling with AI guidance',
      buttonText: activityProgress?.storytelling && !activityProgress.storytelling.isCompleted 
        ? `Continue from Step ${activityProgress.storytelling.currentStep}` 
        : 'Start Story Challenge',
      color: 'text-aduffy-navy',
      hasProgress: activityProgress?.storytelling && !activityProgress.storytelling.isCompleted,
      progressStep: activityProgress?.storytelling?.currentStep || 1,
      progressField: activityProgress?.storytelling?.selectedField
    }
  ];

  const otherActivities = [
    {
      id: 'quiz',
      title: 'Vocabulary Quiz',
      icon: 'Target',
      description: 'Test your knowledge with contextual vocabulary questions',
      buttonText: 'Take Quiz',
      color: 'text-aduffy-teal'
    },
    {
      id: 'interview',
      title: 'Interview Prep',
      icon: 'Award',
      description: 'Master professional vocabulary for promotion interviews',
      buttonText: 'Practice Interview',
      color: 'text-aduffy-navy'
    },
    {
      id: 'voice-conversation',
      title: 'AI Voice Chat',
      icon: 'MessageSquare',
      description: 'Have natural conversations with AI to practice speaking and vocabulary',
      buttonText: 'Start Conversation',
      isNew: true,
      color: 'text-info'
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation',
      icon: 'Volume2',
      description: 'Perfect your pronunciation with AI-powered speech recognition',
      buttonText: 'Practice Speaking',
      isNew: true,
      color: 'text-success'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Live Session': return 'Video';
      case 'Interactive Workshop': return 'Users';
      case 'Practice Session': return 'Target';
      case 'One-on-One': return 'User';
      default: return 'Calendar';
    }
  };

  const renderActivityCard = (activity: any) => {
    const IconComponent = activity.icon;
    
    return (
      <Card 
        key={activity.id}
        className="aduffy-card cursor-pointer"
        onClick={() => onSelectActivity(activity.id)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-aduffy-navy">
            <span className="w-8 h-8 text-aduffy-yellow">👤</span>
            {activity.title}
            {activity.isNew && (
              <Badge className="aduffy-badge-success">
                <span className="w-3 h-3 mr-1">✨</span>
                New
              </Badge>
            )}
            {activity.hasProgress && (
              <Badge className="aduffy-badge-warning">
                <span className="w-3 h-3 mr-1">⏰</span>
                In Progress
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {activity.description}
            {activity.hasProgress && activity.progressField && (
              <span className="block mt-2 text-xs text-aduffy-teal">
                Current field: <span className="font-medium capitalize">{activity.progressField}</span>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {activity.hasProgress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-aduffy-navy">Step {activity.progressStep} of 5</span>
              </div>
              <Progress value={(activity.progressStep / 5) * 100} className="h-2" />
            </div>
          )}
          <Button className="w-full aduffy-button">
            {activity.buttonText}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative">
        <div className="absolute inset-0 gradient-aduffy opacity-5 rounded-2xl"></div>
        <div className="relative p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-aduffy-yellow/10 rounded-full flex items-center justify-center border-2 border-aduffy-yellow/20">
              <span className="w-8 h-8 text-aduffy-yellow">👤</span>
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-aduffy-navy">Welcome back, {getUserName()}!</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="aduffy-badge-primary">
                  <span className="w-4 h-4 mr-1">🏆</span>
                  {userStats.level} Level
                </Badge>
                {(userProfile?.fieldOfInterest || userProfile?.field) && (
                  <Badge className="aduffy-badge-info text-xs">
                    <span className="capitalize">{userProfile.fieldOfInterest || userProfile.field}</span> Focus
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {userProfile?.learningGoals 
              ? `Continuing your journey: ${userProfile.learningGoals}`
              : "Ready to transform your communication skills and advance your career with Aduffy Learning's professional vocabulary mastery program?"
            }
          </p>
        </div>
      </div>

      {/* Accordions for Collapsible Sections */}
      <Accordion className="space-y-6">
        {/* Course Enrollment & Teacher Information Accordion */}
        <AccordionItem title={
          <div className="aduffy-card hover:no-underline p-6 rounded-xl [&[data-state=open]]:rounded-b-none flex items-center gap-4 w-full">
            <div className="w-12 h-12 bg-aduffy-yellow/20 rounded-lg flex items-center justify-center">
              <span className="w-6 h-6 text-aduffy-yellow">📚</span>
            </div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-semibold text-aduffy-navy">Course & Instructor Information</h3>
              <p className="text-sm text-muted-foreground">Your enrollment details and assigned teacher</p>
            </div>
            <Badge className="aduffy-badge-success">
              <span className="w-3 h-3 mr-1">✅</span>
              Active
            </Badge>
          </div>
        } className="border-none">
          <div className="aduffy-card rounded-t-none border-t-0 p-6 pt-0">
            <div className="mt-6 space-y-6">
              {/* Enrolled Course Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 text-aduffy-teal">📚</span>
                  <h4 className="font-semibold text-aduffy-navy">Enrolled Course</h4>
                </div>
                <div>
                  <h5 className="font-semibold text-aduffy-navy mb-1">{courseInfo.name}</h5>
                  <p className="text-sm text-muted-foreground">Course Code: {courseInfo.code}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-aduffy-navy">{courseInfo.progress}% Complete</span>
                  </div>
                  <Progress value={courseInfo.progress} className="h-2" />
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enrolled:</span>
                    <span className="font-medium text-aduffy-navy">{courseInfo.enrollmentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Milestone:</span>
                    <span className="font-medium text-aduffy-navy text-xs">{courseInfo.nextMilestone}</span>
                  </div>
                </div>
              </div>
              {/* Divider between sections */}
              <div className="relative">
                <Separator className="my-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-card px-4 text-xs text-muted-foreground">
                    Instructor Details
                  </div>
                </div>
              </div>
              {/* Teacher Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 text-aduffy-teal">👤</span>
                  <h4 className="font-semibold text-aduffy-navy">Your Instructor</h4>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={teacherInfo.avatar} alt={teacherInfo.name} />
                    <AvatarFallback className="bg-aduffy-teal text-white">
                      {teacherInfo.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h5 className="font-semibold text-aduffy-navy">{teacherInfo.name}</h5>
                    <p className="text-sm text-aduffy-teal font-medium">{teacherInfo.designation}</p>
                    <p className="text-xs text-muted-foreground mt-1">{teacherInfo.credentials}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 text-aduffy-yellow fill-current">⭐</span>
                    <span className="font-medium text-aduffy-navy">{teacherInfo.rating}</span>
                    <span className="text-xs text-muted-foreground">({teacherInfo.experience})</span>
                  </div>
                  <Badge className="aduffy-badge-info text-xs">
                    {teacherInfo.specialization}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-3 h-3 text-aduffy-yellow">📧</span>
                    <span className="truncate">Contact via platform</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-3 h-3 text-aduffy-yellow">📞</span>
                    <span>Available 9 AM - 6 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionItem>
        {/* Weekly Class Schedule Accordion */}
        <AccordionItem title={
          <div className="aduffy-card hover:no-underline p-6 rounded-xl [&[data-state=open]]:rounded-b-none flex items-center gap-4 w-full">
            <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center">
              <span className="w-6 h-6 text-info">📅</span>
            </div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-semibold text-aduffy-navy">Weekly Class Schedule</h3>
              <p className="text-sm text-muted-foreground">Upcoming live sessions and workshops</p>
            </div>
            <Badge className="aduffy-badge-primary">
              <span className="w-3 h-3 mr-1">⏰</span>
              This Week
            </Badge>
          </div>
        } className="border-none">
          <div className="aduffy-card rounded-t-none border-t-0 p-6 pt-0">
            <div className="mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold text-aduffy-navy">Day & Date</TableHead>
                      <TableHead className="font-semibold text-aduffy-navy">Time</TableHead>
                      <TableHead className="font-semibold text-aduffy-navy">Topic</TableHead>
                      <TableHead className="font-semibold text-aduffy-navy">Type</TableHead>
                      <TableHead className="font-semibold text-aduffy-navy">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklySchedule.map((session) => {
                      const TypeIcon = getTypeIcon(session.type);
                      return (
                        <TableRow key={session.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <div className="font-medium text-aduffy-navy">{session.day}</div>
                              <div className="text-xs text-muted-foreground">{session.date}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 text-muted-foreground">📅</span>
                              <span className="text-sm font-medium">{session.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-medium text-aduffy-navy text-sm">{session.topic}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="aduffy-badge-info text-xs">
                              <span className="w-6 h-6 text-aduffy-teal">🎯</span>
                              {session.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              className="aduffy-button text-xs h-8"
                              onClick={() => window.open(session.joinLink, '_blank')}
                            >
                              <span className="w-3 h-3 mr-1">🎥</span>
                              Join
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 p-4 bg-aduffy-yellow/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 text-aduffy-yellow">📍</span>
                  <div>
                    <p className="font-medium text-aduffy-navy text-sm">All sessions are conducted online via ADuffy Learning Platform</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Join links will be activated 10 minutes before each session. Make sure you have a stable internet connection and working microphone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionItem>
        {/* Stats Grid Accordion */}
        <AccordionItem title={
          <div className="aduffy-card hover:no-underline p-6 rounded-xl [&[data-state=open]]:rounded-b-none flex items-center gap-4 w-full">
            <div className="w-12 h-12 bg-aduffy-teal/20 rounded-lg flex items-center justify-center">
              <span className="w-6 h-6 text-aduffy-teal">📊</span>
            </div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-semibold text-aduffy-navy">Learning Statistics</h3>
              <p className="text-sm text-muted-foreground">Your progress overview and achievements</p>
            </div>
            <Badge className="aduffy-badge-primary">
              <span className="w-4 h-4 mr-1">🏆</span>
              {userStats.level} Level
            </Badge>
          </div>
        } className="border-none">
          <div className="aduffy-card rounded-t-none border-t-0 p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <Card className="aduffy-card bg-gradient-to-br from-aduffy-yellow/10 to-aduffy-yellow/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Words Learned</CardTitle>
                  <div className="w-10 h-10 bg-aduffy-yellow/20 rounded-full flex items-center justify-center">
                    <span className="w-5 h-5 text-aduffy-yellow">📚</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-aduffy-navy">{userStats.wordsLearned}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-success font-medium">+12</span> this week
                  </p>
                </CardContent>
              </Card>
              <Card className="aduffy-card bg-gradient-to-br from-aduffy-teal/10 to-aduffy-teal/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Progress</CardTitle>
                  <div className="w-10 h-10 bg-aduffy-teal/20 rounded-full flex items-center justify-center">
                    <span className="w-5 h-5 text-aduffy-teal">📈</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-aduffy-teal">32/{userStats.weeklyGoal}</div>
                  <Progress value={64} className="mt-3 aduffy-progress-animate" />
                </CardContent>
              </Card>
              <Card className="aduffy-card bg-gradient-to-br from-success/10 to-success/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
                  <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                    <span className="w-5 h-5 text-success">📈</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">{userStats.currentStreak} days</div>
                  <p className="text-xs text-muted-foreground mt-1">Keep it up! 🔥</p>
                </CardContent>
              </Card>
              <Card className="aduffy-card bg-gradient-to-br from-aduffy-navy/10 to-aduffy-navy/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Score</CardTitle>
                  <div className="w-10 h-10 bg-aduffy-navy/20 rounded-full flex items-center justify-center">
                    <span className="w-5 h-5 text-aduffy-navy">🧠</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-aduffy-navy">{userStats.totalScore}</div>
                  <p className="text-xs text-muted-foreground mt-1">Expert level: <span className="text-aduffy-yellow font-medium">3000</span></p>
                </CardContent>
              </Card>
            </div>
          </div>
        </AccordionItem>
      </Accordion>

      {/* Learning Activities with Tabs */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold gradient-learning bg-clip-text text-transparent">
            Learning Activities
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose from our comprehensive vocabulary building tools designed for working professionals
          </p>
        </div>

        <Tabs defaultTab="0" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-12">
            <TabsTrigger 
              tabValue="0"
              className="data-[state=active]:bg-aduffy-yellow data-[state=active]:text-aduffy-navy font-medium"
            >
              <span className="w-4 h-4 mr-2">📚</span>
              Main Activities
            </TabsTrigger>
            <TabsTrigger 
              tabValue="1"
              className="data-[state=active]:bg-aduffy-teal data-[state=active]:text-white font-medium"
            >
              <span className="w-4 h-4 mr-2">📚</span>
              Practice Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent tabValue="0" className="mt-8">
            <div className="grid grid-cols-1 gap-6">
              {mainActivities.map(renderActivityCard)}
            </div>
          </TabsContent>

          <TabsContent tabValue="1" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherActivities.map(renderActivityCard)}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recent Words Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-aduffy-navy">Recent Words</h2>
            <p className="text-muted-foreground">Words you've been learning in your field</p>
          </div>
          <Badge className="aduffy-badge-info">
            <span className="capitalize">{userProfile?.fieldOfInterest || userProfile?.field || 'Professional'}</span> Focus
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentWords.map((word, index) => (
            <Card key={index} className="aduffy-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-aduffy-navy">{word.word}</h3>
                      {word.mastered ? (
                        <Badge className="aduffy-badge-success">
                          <span className="w-3 h-3 mr-1">✅</span>
                          Mastered
                        </Badge>
                      ) : (
                        <Badge className="aduffy-badge-warning">
                          <span className="w-3 h-3 mr-1">⏰</span>
                          Learning
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{word.definition}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}