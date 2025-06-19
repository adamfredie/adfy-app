# Brand Guidelines
# Aduffy Learning Design System

**Version:** 1.0  
**Date:** June 17, 2025  
**Brand System:** Professional Vocabulary Learning Platform  

---

## Brand Identity

### Mission Statement
Aduffy Learning empowers working professionals to advance their careers through improved vocabulary and communication skills, providing personalized, AI-driven learning experiences that fit into busy professional schedules.

### Brand Personality
- **Professional**: Business-appropriate, sophisticated, credible
- **Approachable**: Friendly, encouraging, non-intimidating
- **Innovative**: AI-powered, modern, technology-forward
- **Results-Oriented**: Data-driven, measurable, achievement-focused
- **Supportive**: Encouraging, patient, adaptive to user needs

## Color Palette

### Primary Colors

#### Aduffy Yellow
```
Primary: #f9a825
Light: #ffc107  
Dark: #e08900
RGB: 249, 168, 37
HSL: 45, 94%, 56%
```
**Usage**: Primary actions, highlights, brand elements, call-to-action buttons
**Psychology**: Energy, optimism, intelligence, confidence, creativity
**Accessibility**: Minimum contrast ratio 4.5:1 with dark text

#### Aduffy Navy
```
Primary: #1a1a1a
Light: #343a40
Dark: #000000
RGB: 26, 26, 26
HSL: 0, 0%, 10%
```
**Usage**: Primary text, headers, professional elements, high-contrast areas
**Psychology**: Professionalism, trust, stability, authority, sophistication

### Secondary Colors

#### Aduffy Teal
```
Primary: #17a2b8
Light: #20c997
Dark: #138496
RGB: 23, 162, 184
HSL: 188, 78%, 41%
```
**Usage**: Secondary actions, accent elements, progress indicators, success states
**Psychology**: Growth, learning, progress, clarity, communication

#### Aduffy Orange
```
Primary: #fd7e14
Light: #ff9800
Dark: #e65100
RGB: 253, 126, 20
HSL: 27, 98%, 54%
```
**Usage**: Accent elements, gradient combinations, warm highlights, creativity indicators
**Psychology**: Enthusiasm, creativity, warmth, motivation, energy

### Status Colors

#### Success Green
```
Color: #28a745
RGB: 40, 167, 69
Usage: Completion states, correct answers, achievements
```

#### Warning Yellow
```
Color: #ffc107
RGB: 255, 193, 7
Usage: Caution states, intermediate progress, attention needed
```

#### Error Red
```
Color: #dc3545
RGB: 220, 53, 69
Usage: Error states, incorrect answers, destructive actions
```

#### Info Blue
```
Color: #17a2b8
RGB: 23, 162, 184
Usage: Informational content, help text, neutral highlights
```

### Neutral Colors

#### Background Colors
```
White: #ffffff
Light Gray: #f8f9fa
Medium Gray: #e9ecef
Border Gray: rgba(0, 0, 0, 0.08)
```

#### Text Colors
```
Primary Text: #1a1a1a
Secondary Text: #6c757d
Muted Text: #adb5bd
Disabled Text: #dee2e6
```

## Color Usage Guidelines

### Do's
- Use Aduffy Yellow for primary actions and brand emphasis
- Pair Aduffy Navy with yellow for high contrast and readability
- Use teal and orange as supporting colors in gradients and accents
- Maintain consistent color relationships across all interfaces
- Test color combinations for accessibility compliance

### Don'ts
- Don't use yellow on white backgrounds without sufficient contrast
- Avoid using multiple bright colors together without proper hierarchy
- Don't rely solely on color to convey important information
- Avoid using red and green together for color-blind accessibility

### Color Combinations

#### Primary Combinations
```css
/* High Impact */
background: var(--aduffy-yellow);
color: var(--aduffy-navy);

/* Professional */
background: var(--aduffy-navy);
color: white;

/* Subtle Accent */
background: rgba(249, 168, 37, 0.1);
border: 1px solid var(--aduffy-yellow);
```

#### Gradient Combinations
```css
/* Primary Brand Gradient */
background: linear-gradient(135deg, var(--aduffy-yellow) 0%, var(--aduffy-orange) 100%);

/* Learning Progress Gradient */
background: linear-gradient(90deg, var(--aduffy-yellow) 0%, var(--aduffy-teal) 100%);

/* Subtle Background Gradient */
background: linear-gradient(135deg, rgba(249, 168, 37, 0.05) 0%, rgba(253, 126, 20, 0.05) 100%);
```

## Typography

### Font Stack
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

**Rationale**: System fonts ensure optimal performance, native feel, and excellent readability across all platforms while maintaining professional appearance.

### Type Scale

#### Headings
```css
/* Heading 1 - Page Titles */
h1 {
  font-size: 1.875rem; /* 30px */
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.025em;
  color: var(--aduffy-navy);
}

/* Heading 2 - Section Titles */
h2 {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.025em;
  color: var(--aduffy-navy);
}

/* Heading 3 - Subsection Titles */
h3 {
  font-size: 1.25rem; /* 20px */
  font-weight: 600;
  line-height: 1.4;
  color: var(--aduffy-navy);
}

/* Heading 4 - Card Titles */
h4 {
  font-size: 1rem; /* 16px */
  font-weight: 600;
  line-height: 1.4;
  color: var(--aduffy-navy);
}
```

#### Body Text
```css
/* Body Text */
p {
  font-size: 1rem; /* 16px */
  font-weight: 400;
  line-height: 1.6;
  color: var(--foreground);
}

/* Small Text */
.text-sm {
  font-size: 0.875rem; /* 14px */
  line-height: 1.5;
}

/* Large Text */
.text-lg {
  font-size: 1.125rem; /* 18px */
  line-height: 1.6;
}
```

#### UI Elements
```css
/* Labels */
label {
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  line-height: 1.4;
  color: var(--foreground);
}

/* Buttons */
button {
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  line-height: 1.4;
}

/* Input Fields */
input, textarea {
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  line-height: 1.4;
}
```

### Typography Hierarchy

#### Information Hierarchy
1. **Primary Headlines**: Main page titles and major section headers
2. **Secondary Headlines**: Section divisions and feature titles  
3. **Tertiary Headlines**: Card titles and subsection headers
4. **Body Text**: Main content, descriptions, instructions
5. **Supporting Text**: Labels, captions, metadata
6. **Interactive Text**: Buttons, links, form elements

#### Emphasis Levels
```css
/* High Emphasis */
.text-emphasis-high {
  font-weight: 700;
  color: var(--aduffy-navy);
}

/* Medium Emphasis */
.text-emphasis-medium {
  font-weight: 500;
  color: var(--foreground);
}

/* Low Emphasis */
.text-emphasis-low {
  font-weight: 400;
  color: var(--muted-foreground);
}
```

## Logo and Branding

### Logo Usage
- **Primary Logo**: Full Aduffy Learning wordmark
- **Icon Logo**: "A" symbol for small spaces and favicons
- **Minimum Size**: 120px width for full logo, 24px for icon
- **Clear Space**: Minimum padding equal to the height of the "A" in the logo

### Logo Applications
```css
/* Header Logo */
.header-logo {
  height: 40px;
  width: auto;
  max-width: 200px;
}

/* Favicon Logo */
.favicon-logo {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}
```

### Brand Colors in Logo
- Use full-color logo on white/light backgrounds
- Use white logo on dark/colored backgrounds
- Use navy logo on yellow backgrounds
- Maintain contrast ratio minimum 3:1 for logos

## Spacing and Layout

### Spacing Scale
```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
}
```

### Layout Principles
- **Consistent Spacing**: Use spacing scale for all margins and padding
- **Visual Hierarchy**: Larger spacing between unrelated elements
- **Breathing Room**: Adequate whitespace for readability
- **Alignment**: Consistent alignment grid throughout interface

### Container Widths
```css
.container-sm { max-width: 640px; }   /* Forms, settings */
.container-md { max-width: 768px; }   /* Onboarding, activities */
.container-lg { max-width: 1024px; }  /* Dashboard */
.container-xl { max-width: 1280px; }  /* Wide layouts */
```

## Imagery and Icons

### Icon Style
- **Style**: Outline/stroke icons for consistency
- **Weight**: 1.5px stroke weight
- **Size**: 16px, 20px, 24px standard sizes
- **Color**: Match text color or use accent colors
- **Library**: Lucide React for consistency

### Icon Usage
```css
/* Standard Icons */
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }

/* Icon Colors */
.icon-primary { color: var(--aduffy-yellow); }
.icon-secondary { color: var(--aduffy-teal); }
.icon-muted { color: var(--muted-foreground); }
```

### Image Guidelines
- **Professional**: Business-appropriate imagery
- **Diverse**: Inclusive representation of professionals
- **High Quality**: Minimum 300dpi for print, optimized for web
- **Consistent Style**: Maintain consistent visual treatment

## Component Design Principles

### Button Design
```css
/* Primary Button */
.btn-primary {
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--aduffy-yellow-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(249, 168, 37, 0.3);
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: var(--aduffy-yellow);
  background: rgba(249, 168, 37, 0.05);
}
```

### Card Design
```css
.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--aduffy-yellow);
  box-shadow: 0 8px 24px rgba(249, 168, 37, 0.15);
  transform: translateY(-2px);
}
```

### Form Elements
```css
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--input-background);
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--aduffy-yellow);
  box-shadow: 0 0 0 3px rgba(249, 168, 37, 0.1);
}
```

## Animation and Motion

### Transition Principles
- **Purposeful**: Animations should enhance user understanding
- **Subtle**: Smooth, professional animations without distraction
- **Consistent**: Use consistent timing and easing functions
- **Performance**: Optimize for smooth 60fps performance

### Standard Transitions
```css
/* Standard Transition */
.transition-standard {
  transition: all 0.2s ease;
}

/* Slow Transition */
.transition-slow {
  transition: all 0.3s ease;
}

/* Fast Transition */
.transition-fast {
  transition: all 0.15s ease;
}

/* Bounce Effect */
.transition-bounce {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Hover Effects
```css
/* Card Hover */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Button Hover */
.hover-brighten:hover {
  filter: brightness(1.05);
}

/* Icon Hover */
.hover-scale:hover {
  transform: scale(1.1);
}
```

## Accessibility Guidelines

### Color Accessibility
- **Contrast Ratios**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Color Blindness**: Don't rely solely on color to convey information
- **Focus States**: High contrast focus indicators for all interactive elements

### Typography Accessibility
- **Readable Fonts**: Use system fonts for optimal readability
- **Font Sizes**: Minimum 14px for body text, scalable with user preferences
- **Line Height**: Minimum 1.5 for body text for improved readability

### Interactive Accessibility
- **Touch Targets**: Minimum 44px touch targets for mobile
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Screen Readers**: Proper semantic markup and ARIA labels

## Brand Voice and Tone

### Voice Characteristics
- **Professional**: Knowledgeable, credible, business-appropriate
- **Encouraging**: Supportive, motivating, confidence-building
- **Clear**: Simple, direct, jargon-free communication
- **Friendly**: Approachable, warm, human-centered

### Tone Variations

#### Instructional Content
- Clear, step-by-step guidance
- Professional but approachable language
- Encouraging and supportive tone

#### Error Messages
- Helpful, not blame-focused
- Clear instructions for resolution
- Maintain positive, solution-oriented tone

#### Success Messages
- Celebratory but professional
- Acknowledge user achievement
- Encourage continued learning

#### Marketing Copy
- Benefits-focused language
- Professional advancement emphasis
- Results-oriented messaging

---

**Brand Guidelines Status**: Complete  
**Usage**: All design and content creation must follow these guidelines  
**Updates**: Guidelines reviewed quarterly and updated as needed  
**Compliance**: All team members responsible for brand consistency