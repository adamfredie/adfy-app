# Dashboard Screen Design Specification
# Aduffy Learning Platform

**Screen Type**: Main Learning Hub  
**Priority**: High  
**Complexity**: High  

---

## Overview

The Dashboard serves as the central hub for all learning activities. It provides users with a comprehensive overview of their progress, quick access to learning activities, and personalized recommendations based on their profile and learning history.

## Layout Architecture

### Container Structure
- **Max Width**: 1152px (6xl container)
- **Padding**: 32px on desktop, 24px on mobile
- **Grid System**: CSS Grid with responsive breakpoints
- **Background**: Clean white with subtle texture overlay

### Grid Layout
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 2fr 1fr;
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 3fr 1fr;
    gap: 3rem;
  }
}
```

## Section Breakdown

### 1. Welcome Header Section

#### Layout
- **Full Width**: Spans entire container width
- **Height**: Minimum 120px, flexible content
- **Background**: Gradient from Aduffy yellow to orange
- **Border Radius**: 16px
- **Padding**: 32px

#### Content Structure
```html
<!-- Welcome Header -->
<section class="welcome-header">
  <div class="welcome-content">
    <h1>Welcome back, [User Name]!</h1>
    <p>Ready to expand your [Field] vocabulary?</p>
  </div>
  <div class="welcome-stats">
    <div class="stat-item">
      <span class="stat-number">[Level]</span>
      <span class="stat-label">Current Level</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">[Streak]</span>
      <span class="stat-label">Day Streak</span>
    </div>
  </div>
</section>
```

#### Styling
```css
.welcome-header {
  background: linear-gradient(135deg, var(--aduffy-yellow) 0%, var(--aduffy-orange) 100%);
  border-radius: 1rem;
  padding: 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.welcome-content h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
}

.welcome-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}
```

### 2. Today's Progress Section

#### Layout
- **Position**: Below welcome header
- **Grid**: 2 columns on tablet+, 1 column on mobile
- **Cards**: Equal height, responsive design

#### Progress Cards

##### Daily Vocabulary Progress
```css
.progress-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.progress-card:hover {
  box-shadow: 0 4px 12px rgba(249, 168, 37, 0.1);
  transform: translateY(-1px);
}
```

##### Content Structure
- **Header**: Icon + Title + Status Badge
- **Progress Bar**: Visual progress indicator
- **Metrics**: Numbers and percentages
- **Action Button**: "Continue" or "Start Today"

#### Progress Indicators
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: #f1f3f4;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--aduffy-yellow) 0%, var(--aduffy-orange) 100%);
  border-radius: 4px;
  transition: width 0.6s ease-out;
  animation: aduffy-progress-animate 1s ease-out;
}
```

### 3. Learning Activities Grid

#### Grid Layout
```css
.activities-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: 2rem 0;
}

@media (min-width: 640px) {
  .activities-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .activities-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

#### Activity Cards

##### Card Structure
Each activity card contains:
- **Header**: Icon + Activity Name
- **Description**: Brief explanation of activity
- **Progress**: Completion status or streak
- **Action**: Primary call-to-action button
- **Metadata**: Time estimate, difficulty level

##### AI Storytelling Card
```css
.activity-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.activity-card:hover {
  border-color: var(--aduffy-yellow);
  box-shadow: 0 8px 24px rgba(249, 168, 37, 0.15);
  transform: translateY(-2px);
}

.activity-card.featured {
  border: 2px solid var(--aduffy-yellow);
  background: linear-gradient(135deg, rgba(249, 168, 37, 0.05) 0%, rgba(253, 126, 20, 0.05) 100%);
}
```

##### Card Content Layout
```html
<div class="activity-card">
  <div class="activity-header">
    <div class="activity-icon">[Icon]</div>
    <h3 class="activity-title">[Title]</h3>
    <span class="activity-badge">[Badge]</span>
  </div>
  
  <p class="activity-description">[Description]</p>
  
  <div class="activity-meta">
    <span class="time-estimate">[Time]</span>
    <span class="difficulty">[Level]</span>
  </div>
  
  <div class="activity-progress">
    <div class="progress-info">
      <span>[Progress Text]</span>
      <span>[Percentage]</span>
    </div>
    <div class="progress-bar">[Progress Bar]</div>
  </div>
  
  <button class="activity-button">[Action]</button>
</div>
```

#### Activity Types

##### 1. AI Storytelling (Featured)
- **Icon**: Creative writing/story icon
- **Badge**: "Featured" with gradient background
- **Description**: "Create stories using daily vocabulary words"
- **Progress**: "5 words ready" or completion status
- **Button**: "Start Storytelling" (primary style)

##### 2. Vocabulary Quiz
- **Icon**: Quiz/question icon
- **Description**: "Test your knowledge with adaptive questions"
- **Progress**: Recent score or completion status
- **Button**: "Take Quiz" (secondary style)

##### 3. Interview Prep
- **Icon**: Business/interview icon
- **Description**: "Practice professional scenarios"
- **Progress**: Scenarios completed this week
- **Button**: "Start Practice" (secondary style)

##### 4. Voice Conversation
- **Icon**: Microphone/speech icon
- **Description**: "Practice speaking with AI conversation"
- **Progress**: Minutes practiced this week
- **Button**: "Start Conversation" (secondary style)

##### 5. Pronunciation Practice
- **Icon**: Audio/pronunciation icon
- **Description**: "Perfect your professional pronunciation"
- **Progress**: Words practiced today
- **Button**: "Practice Now" (secondary style)

### 4. Analytics Sidebar

#### Layout
- **Position**: Right sidebar on desktop, bottom section on mobile
- **Width**: 320px on desktop
- **Sticky**: Sticky positioning on desktop
- **Cards**: Stacked card layout

#### Analytics Cards

##### Weekly Progress Chart
```css
.analytics-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.chart-container {
  height: 200px;
  margin: 1rem 0;
}
```

##### Achievement Badges
- **Layout**: Grid of recent achievements
- **Badge Design**: Circular badges with icons
- **Animation**: Subtle pulse for new achievements

##### Streak Counter
- **Design**: Large number with flame icon
- **Progress**: Visual calendar showing streak days
- **Motivation**: Encouraging message for consistency

##### Learning Goals
- **Progress Bars**: Visual goal completion
- **Targets**: Weekly and monthly objectives
- **Status**: On track, behind, ahead indicators

## Interactive States

### Card Hover Effects
```css
.card-hover-effect {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover-effect:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -10px rgba(249, 168, 37, 0.15);
}
```

### Button States
- **Primary Buttons**: Aduffy yellow with navy text
- **Secondary Buttons**: White with navy text and yellow border
- **Disabled State**: Gray background, disabled cursor
- **Loading State**: Spinner animation with brand colors

### Progress Animations
- **Progress Bars**: Animated fill from 0 to current value
- **Numbers**: Count-up animation for statistics
- **Charts**: Smooth data visualization transitions

## Responsive Behavior

### Mobile (< 640px)
- **Single Column**: All content stacks vertically
- **Welcome**: Simplified layout, stats below content
- **Activities**: 1 column grid with full-width cards
- **Sidebar**: Moves to bottom, simplified charts

### Tablet (640px - 1024px)
- **Two Column**: Activities in 2-column grid
- **Sidebar**: Remains at bottom or side panel
- **Welcome**: Maintains horizontal layout

### Desktop (> 1024px)
- **Three Column**: Activities in 3-column grid
- **Sidebar**: Fixed right sidebar
- **Optimal Spacing**: Increased margins and padding

## Loading States

### Initial Load
```css
.dashboard-skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-card {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Activity Loading
- **Spinner**: Centered loading spinner with brand colors
- **Card States**: Disabled cards during loading
- **Progress**: Loading progress for data-heavy operations

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical progression through interactive elements
- **Focus Indicators**: Clear visual focus states
- **Skip Links**: Jump to main content areas

### Screen Reader Support
- **Landmarks**: Proper ARIA landmarks for sections
- **Labels**: Descriptive labels for all interactive elements
- **Live Regions**: Progress updates announced to screen readers

### Visual Accessibility
- **Color Contrast**: 4.5:1 minimum ratio for all text
- **Focus States**: High contrast focus indicators
- **Alternative Text**: Descriptive alt text for all icons and images

## Performance Considerations

### Code Splitting
- **Lazy Loading**: Non-critical components loaded on demand
- **Chart Libraries**: Loaded only when analytics section is visible
- **Images**: Lazy loading for user avatars and icons

### Data Loading
- **Progressive Enhancement**: Basic content loads first
- **API Optimization**: Minimal data requests on initial load
- **Caching Strategy**: Smart caching for frequently accessed data

---

**Design Status**: Complete  
**Implementation Notes**: Focus on performance and accessibility  
**Testing Requirements**: Cross-device testing, analytics functionality, loading states