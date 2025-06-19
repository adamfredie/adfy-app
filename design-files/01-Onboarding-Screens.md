# Onboarding Screens Design Specification
# Aduffy Learning Platform

**Screen Type**: Onboarding Flow (3 Steps)  
**Priority**: High  
**Complexity**: Medium  

---

## Overview

The onboarding flow introduces new users to Aduffy Learning and collects essential information to personalize their learning experience. The 3-step process should feel welcoming, professional, and efficient.

## User Flow

```
Landing → Step 1 (Assessment) → Step 2 (Field Selection) → Step 3 (Job Details) → Dashboard
```

## Design Specifications

### Layout Structure

#### Container
- **Max Width**: 768px (md breakpoint)
- **Padding**: 32px on desktop, 24px on mobile
- **Centered**: Horizontally centered on screen
- **Background**: Clean white with subtle Aduffy yellow accents

#### Progress Indicator
- **Position**: Top of container
- **Style**: Linear progress bar with step indicators
- **Colors**: Aduffy yellow for completed, light gray for pending
- **Animation**: Smooth progression with 300ms transition

```css
/* Progress Indicator */
.onboarding-progress {
  width: 100%;
  height: 4px;
  background: #f8f9fa;
  border-radius: 2px;
  margin-bottom: 2rem;
}

.onboarding-progress-fill {
  height: 100%;
  background: var(--aduffy-yellow);
  border-radius: 2px;
  transition: width 0.3s ease-out;
}
```

### Step 1: Vocabulary Assessment

#### Header Section
- **Title**: "Let's assess your vocabulary level"
- **Subtitle**: "This helps us personalize your learning experience"
- **Typography**: H2 for title, body text for subtitle
- **Spacing**: 24px margin bottom

#### Assessment Options
- **Layout**: Vertical card stack on mobile, horizontal on desktop
- **Card Design**: 
  - Border: 1px solid border color
  - Padding: 24px
  - Border radius: 12px
  - Hover state: Aduffy yellow border
  - Selected state: Aduffy yellow background (10% opacity)

##### Beginner Option
```css
.assessment-card {
  border: 1px solid var(--border);
  padding: 1.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.assessment-card:hover {
  border-color: var(--aduffy-yellow);
  box-shadow: 0 4px 12px rgba(249, 168, 37, 0.1);
}

.assessment-card.selected {
  border-color: var(--aduffy-yellow);
  background-color: rgba(249, 168, 37, 0.05);
}
```

#### Content Structure
- **Icon**: Large vocabulary-related icon (24x24px)
- **Level Title**: "Beginner", "Intermediate", "Advanced"
- **Description**: 2-3 sentences explaining the level
- **Bullet Points**: 3-4 key characteristics

#### Navigation
- **Back Button**: Not shown on first step
- **Next Button**: "Continue" - Aduffy yellow, disabled until selection
- **Button Spacing**: 24px margin top

### Step 2: Professional Field Selection

#### Header Section
- **Title**: "What's your professional field?"
- **Subtitle**: "We'll customize vocabulary to match your industry"
- **Visual**: Small icons representing different fields

#### Field Options Grid
- **Layout**: 2 columns on mobile, 3 columns on tablet, 3 columns on desktop
- **Gap**: 16px between cards
- **Responsive Breakpoints**:
  - Mobile (< 640px): 1 column
  - Tablet (640px - 1024px): 2 columns  
  - Desktop (> 1024px): 3 columns

##### Field Cards
```css
.field-card {
  aspect-ratio: 1;
  border: 2px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.field-card:hover {
  border-color: var(--aduffy-yellow);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(249, 168, 37, 0.15);
}

.field-card.selected {
  border-color: var(--aduffy-yellow);
  background: linear-gradient(135deg, var(--aduffy-yellow) 0%, var(--aduffy-orange) 100%);
  color: white;
}
```

#### Field Options
1. **Marketing**: Brand, campaigns, customer engagement
2. **Technology**: Development, systems, data
3. **Sales**: Leads, clients, negotiations
4. **Product**: Features, UX, roadmaps
5. **Finance**: Analysis, investments, budgets
6. **Operations**: Processes, supply chain, efficiency

#### Card Content
- **Icon**: Field-specific icon (32x32px)
- **Title**: Field name
- **Description**: 2-3 key focus areas
- **Selection State**: Gradient background when selected

### Step 3: Job Details

#### Header Section
- **Title**: "Tell us about your role"
- **Subtitle**: "This helps us create relevant scenarios"

#### Form Layout
- **Grid**: Single column, full width inputs
- **Input Styling**: Consistent with design system
- **Spacing**: 24px between form groups

#### Form Fields

##### Job Title (Required)
- **Input Type**: Text
- **Placeholder**: "e.g., Marketing Manager, Senior Developer"
- **Validation**: Required field indicator
- **Max Length**: 100 characters

##### Company Name (Optional)
- **Input Type**: Text
- **Placeholder**: "e.g., Tech Startup, Fortune 500 Company"
- **Max Length**: 100 characters

##### Industry (Required)
- **Input Type**: Select dropdown
- **Options**: Technology, Healthcare, Finance, Retail, Manufacturing, etc.
- **Default**: "Select your industry"

##### Experience Level (Required)
- **Input Type**: Radio buttons
- **Options**: 
  - "0-2 years"
  - "3-5 years" 
  - "6-10 years"
  - "10+ years"
- **Layout**: 2x2 grid on desktop, vertical on mobile

##### Learning Goals (Optional)
- **Input Type**: Checkbox group
- **Options**:
  - "Improve presentation skills"
  - "Enhance written communication"
  - "Prepare for interviews"
  - "Expand industry vocabulary"
  - "Build confidence in meetings"

#### Form Styling
```css
.onboarding-form .form-group {
  margin-bottom: 1.5rem;
}

.onboarding-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--aduffy-navy);
}

.onboarding-form input,
.onboarding-form select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--input-background);
  transition: border-color 0.2s ease;
}

.onboarding-form input:focus,
.onboarding-form select:focus {
  outline: none;
  border-color: var(--aduffy-yellow);
  box-shadow: 0 0 0 3px rgba(249, 168, 37, 0.1);
}
```

## Interactive States

### Button States
- **Default**: Aduffy yellow background, navy text
- **Hover**: Darker yellow background
- **Disabled**: Gray background, disabled cursor
- **Loading**: Spinner with Aduffy yellow accent

### Form Validation
- **Error State**: Red border, error message below field
- **Success State**: Green border for valid fields
- **Required Indicators**: Red asterisk for required fields

### Card Selection
- **Default**: Light border, white background
- **Hover**: Yellow border, slight elevation
- **Selected**: Yellow border, yellow background tint
- **Disabled**: Gray text, no interaction

## Responsive Behavior

### Mobile (< 640px)
- **Layout**: Single column for all elements
- **Card Grid**: 1 column for field selection
- **Form**: Full width inputs, stacked radio buttons
- **Navigation**: Full width buttons

### Tablet (640px - 1024px)
- **Layout**: Centered with appropriate margins
- **Card Grid**: 2 columns for field selection
- **Form**: Maintained single column for clarity

### Desktop (> 1024px)
- **Layout**: Optimal 768px max width
- **Card Grid**: 3 columns for field selection
- **Form**: Consider 2-column layout for shorter fields

## Accessibility Requirements

### Keyboard Navigation
- **Tab Order**: Logical progression through form elements
- **Focus Indicators**: Clear visual focus states
- **Skip Links**: Option to skip non-essential elements

### Screen Reader Support
- **Labels**: Proper labels for all form elements
- **Instructions**: Clear instructions for each step
- **Progress**: Announced progress through steps
- **Error Handling**: Clear error announcements

### WCAG Compliance
- **Color Contrast**: 4.5:1 minimum for all text
- **Focus Management**: Proper focus handling between steps
- **Alternative Text**: Descriptive text for all icons
- **Form Validation**: Clear error messaging

## Animation and Transitions

### Step Transitions
- **Duration**: 300ms ease-out
- **Movement**: Slide left/right between steps
- **Loading**: Smooth progress bar animation

### Card Interactions
- **Hover Effects**: 200ms ease transitions
- **Selection**: Immediate visual feedback
- **Error States**: Gentle shake animation for invalid inputs

### Progress Indicator
- **Fill Animation**: Smooth width transition
- **Step Completion**: Check mark appearance with scale animation

## Error Handling

### Validation Messages
- **Position**: Below invalid form field
- **Styling**: Red text with warning icon
- **Content**: Clear, helpful error messages
- **Timing**: Real-time validation for immediate feedback

### Network Errors
- **Retry Mechanism**: Clear retry button
- **Error Message**: User-friendly explanation
- **Fallback**: Graceful degradation if save fails

## Success States

### Completion Feedback
- **Animation**: Success checkmark with scale effect
- **Message**: "Profile setup complete!"
- **Transition**: Smooth transition to dashboard
- **Timing**: 1-second delay before redirect

---

**Design Status**: Complete  
**Developer Notes**: Implement with proper form validation and accessibility features  
**Test Requirements**: Cross-browser testing, accessibility audit, mobile responsiveness