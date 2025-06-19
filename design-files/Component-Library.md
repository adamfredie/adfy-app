# Component Library Specification
# Aduffy Learning Design System

**Version:** 1.0  
**Date:** June 17, 2025  
**Component System:** Reusable UI Components  

---

## Overview

This component library defines all reusable UI components for the Aduffy Learning platform. Each component includes design specifications, usage guidelines, accessibility requirements, and implementation notes.

## Button Components

### Primary Button

#### Visual Specifications
```css
.btn-primary {
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px; /* Accessibility: minimum touch target */
}

.btn-primary:hover {
  background: var(--aduffy-yellow-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(249, 168, 37, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(249, 168, 37, 0.3);
}

.btn-primary:disabled {
  background: var(--muted);
  color: var(--muted-foreground);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-primary:focus-visible {
  outline: 2px solid var(--aduffy-yellow);
  outline-offset: 2px;
}
```

#### Usage Guidelines
- **Primary Actions**: Main call-to-action on each screen
- **Limit Usage**: Only one primary button per section
- **Text Guidelines**: Use action verbs (Start, Continue, Submit)
- **Icon Support**: Optional leading or trailing icons

#### Accessibility
- **Minimum Size**: 44x44px touch target
- **Color Contrast**: 4.5:1 ratio with background
- **Focus States**: Clear focus indicators
- **Screen Reader**: Descriptive button text, no "click here"

### Secondary Button

#### Visual Specifications
```css
.btn-secondary {
  background: white;
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
}

.btn-secondary:hover {
  border-color: var(--aduffy-yellow);
  background: rgba(249, 168, 37, 0.05);
}

.btn-secondary:active {
  border-color: var(--aduffy-yellow-dark);
  background: rgba(249, 168, 37, 0.1);
}
```

#### Usage Guidelines
- **Secondary Actions**: Supporting actions like "Cancel", "Back"
- **Multiple Usage**: Can have multiple secondary buttons
- **Navigation**: Good for navigation and less critical actions

### Button Sizes

#### Size Variants
```css
/* Small Button */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  min-height: 36px;
}

/* Large Button */
.btn-lg {
  padding: 1rem 2rem;
  font-size: 1rem;
  min-height: 52px;
}

/* Full Width */
.btn-full {
  width: 100%;
}
```

### Icon Buttons

#### Visual Specifications
```css
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: white;
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  border-color: var(--aduffy-yellow);
  background: rgba(249, 168, 37, 0.05);
}

.btn-icon svg {
  width: 20px;
  height: 20px;
}
```

## Card Components

### Basic Card

#### Visual Specifications
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

#### Card Structure
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <div class="card-actions">
      <!-- Action buttons -->
    </div>
  </div>
  
  <div class="card-content">
    <p>Card content goes here...</p>
  </div>
  
  <div class="card-footer">
    <!-- Footer actions -->
  </div>
</div>
```

### Activity Card

#### Enhanced Card for Learning Activities
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

.activity-card .activity-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.activity-card .activity-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--aduffy-navy);
  margin-bottom: 0.5rem;
}

.activity-card .activity-description {
  color: var(--muted-foreground);
  line-height: 1.5;
  margin-bottom: 1rem;
  flex: 1;
}

.activity-card .activity-button {
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-weight: 500;
  width: 100%;
  margin-top: auto;
}
```

### Progress Card

#### Card with Progress Indicators
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

.progress-card .progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-card .progress-title {
  font-weight: 600;
  color: var(--aduffy-navy);
}

.progress-card .progress-status {
  background: var(--success);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.progress-card .progress-bar {
  width: 100%;
  height: 8px;
  background: var(--muted);
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-card .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--aduffy-yellow) 0%, var(--aduffy-orange) 100%);
  border-radius: 4px;
  transition: width 0.6s ease-out;
}
```

## Form Components

### Input Field

#### Visual Specifications
```css
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--input-background);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  color: var(--foreground);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--aduffy-yellow);
  box-shadow: 0 0 0 3px rgba(249, 168, 37, 0.1);
}

.form-input:invalid {
  border-color: var(--destructive);
}

.form-input:disabled {
  background: var(--muted);
  color: var(--muted-foreground);
  cursor: not-allowed;
}

.form-input::placeholder {
  color: var(--muted-foreground);
}
```

#### Form Group Structure
```html
<div class="form-group">
  <label for="input-id" class="form-label">
    Field Label
    <span class="required">*</span>
  </label>
  <input 
    type="text" 
    id="input-id" 
    class="form-input"
    placeholder="Enter value..."
    required
  />
  <div class="form-error">Error message here</div>
  <div class="form-help">Helper text here</div>
</div>
```

#### Form Label
```css
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--aduffy-navy);
}

.form-label .required {
  color: var(--destructive);
  margin-left: 0.25rem;
}
```

#### Form Error States
```css
.form-error {
  color: var(--destructive);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.form-help {
  color: var(--muted-foreground);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-group.error .form-input {
  border-color: var(--destructive);
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}
```

### Select Dropdown

#### Visual Specifications
```css
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--input-background);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  color: var(--foreground);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background-image: url("data:image/svg+xml,..."); /* Dropdown arrow */
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px;
  padding-right: 3rem;
}

.form-select:focus {
  outline: none;
  border-color: var(--aduffy-yellow);
  box-shadow: 0 0 0 3px rgba(249, 168, 37, 0.1);
}
```

### Textarea

#### Visual Specifications
```css
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--input-background);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--foreground);
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--aduffy-yellow);
  box-shadow: 0 0 0 3px rgba(249, 168, 37, 0.1);
}
```

## Badge Components

### Status Badges

#### Badge Specifications
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-primary {
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
}

.badge-success {
  background: rgba(40, 167, 69, 0.1);
  color: var(--success);
}

.badge-warning {
  background: rgba(255, 193, 7, 0.1);
  color: var(--warning-foreground);
}

.badge-info {
  background: rgba(23, 162, 184, 0.1);
  color: var(--info);
}

.badge-feature {
  background: linear-gradient(135deg, var(--aduffy-yellow) 0%, var(--aduffy-orange) 100%);
  color: white;
}
```

#### Usage Guidelines
- **Status Indication**: Use for progress, completion, level indicators
- **Feature Highlighting**: Use feature badge for premium/special features
- **Color Coding**: Consistent color usage across similar badge types

### Achievement Badges

#### Large Achievement Badges
```css
.achievement-badge {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--aduffy-yellow) 0%, var(--aduffy-orange) 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 4px 12px rgba(249, 168, 37, 0.3);
  animation: achievement-pop 0.6s ease-out;
}

@keyframes achievement-pop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.achievement-badge .badge-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}
```

## Progress Components

### Progress Bar

#### Visual Specifications
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--muted);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--aduffy-yellow) 0%, var(--aduffy-orange) 100%);
  border-radius: 4px;
  transition: width 0.6s ease-out;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: progress-shimmer 2s infinite;
}

@keyframes progress-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

#### Progress with Label
```html
<div class="progress-container">
  <div class="progress-header">
    <span class="progress-label">Vocabulary Progress</span>
    <span class="progress-percentage">75%</span>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 75%"></div>
  </div>
</div>
```

### Circular Progress

#### Visual Specifications
```css
.circular-progress {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  background: conic-gradient(
    var(--aduffy-yellow) 0deg,
    var(--aduffy-yellow) calc(var(--progress) * 3.6deg),
    var(--muted) calc(var(--progress) * 3.6deg),
    var(--muted) 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.circular-progress::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
}

.circular-progress .progress-text {
  position: relative;
  z-index: 1;
  font-weight: 600;
  color: var(--aduffy-navy);
}
```

## Loading Components

### Spinner

#### Visual Specifications
```css
.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--muted);
  border-top: 2px solid var(--aduffy-yellow);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner-lg {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

.spinner-sm {
  width: 16px;
  height: 16px;
  border-width: 1.5px;
}
```

### Skeleton Loading

#### Visual Specifications
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 0.375rem;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text {
  height: 1rem;
  margin-bottom: 0.5rem;
}

.skeleton-text:last-child {
  width: 60%;
}

.skeleton-card {
  height: 200px;
  border-radius: 0.75rem;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
```

## Voice Components

### Voice Button

#### Visual Specifications
```css
.voice-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--aduffy-yellow);
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(249, 168, 37, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--aduffy-navy);
  font-weight: 500;
}

.voice-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(249, 168, 37, 0.4);
}

.voice-button:active,
.voice-button.listening {
  background: var(--aduffy-orange);
  transform: scale(0.95);
}

.voice-button .icon {
  width: 24px;
  height: 24px;
  margin-bottom: 0.25rem;
}

.voice-button .text {
  font-size: 0.75rem;
  text-align: center;
}
```

### Voice Status Indicator

#### Visual Specifications
```css
.voice-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--muted);
  border-radius: 0.5rem;
}

.status-indicator {
  position: relative;
  width: 16px;
  height: 16px;
}

.pulse-animation {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--success);
  animation: pulse 2s infinite;
}

.pulse-animation.listening {
  background: var(--aduffy-orange);
  animation: pulse-fast 0.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

@keyframes pulse-fast {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.3); }
}

.status-text {
  font-size: 0.875rem;
  color: var(--muted-foreground);
}
```

## Navigation Components

### Breadcrumb

#### Visual Specifications
```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin-bottom: 1rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-item:not(:last-child)::after {
  content: '/';
  color: var(--muted-foreground);
  margin-left: 0.5rem;
}

.breadcrumb-link {
  color: var(--muted-foreground);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--aduffy-yellow);
}

.breadcrumb-current {
  color: var(--foreground);
  font-weight: 500;
}
```

### Step Indicator

#### Visual Specifications
```css
.step-indicators {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--muted);
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  position: relative;
}

.step-dot.active {
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  transform: scale(1.1);
}

.step-dot.completed {
  background: var(--success);
  color: white;
}

.step-dot:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  width: calc(100vw / 5 - 32px);
  height: 2px;
  background: var(--muted);
  transform: translateY(-50%);
}

.step-dot.completed:not(:last-child)::after {
  background: var(--success);
}
```

## Responsive Design Guidelines

### Breakpoint System
```css
/* Mobile First Approach */
.component {
  /* Mobile styles by default */
}

@media (min-width: 640px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}

@media (min-width: 1280px) {
  .component {
    /* Large desktop styles */
  }
}
```

### Responsive Utilities
```css
/* Show/Hide on different screens */
.mobile-only { display: block; }
.tablet-up { display: none; }
.desktop-up { display: none; }

@media (min-width: 640px) {
  .mobile-only { display: none; }
  .tablet-up { display: block; }
}

@media (min-width: 1024px) {
  .tablet-up { display: none; }
  .desktop-up { display: block; }
}
```

## Accessibility Implementation

### Focus Management
```css
.focusable {
  outline: none;
  border-radius: 0.375rem;
  transition: box-shadow 0.2s ease;
}

.focusable:focus-visible {
  box-shadow: 0 0 0 2px var(--aduffy-yellow);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
```

### Screen Reader Only Content
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

**Component Library Status**: Complete  
**Implementation**: Use with React and Tailwind CSS  
**Testing**: All components tested for accessibility and responsive behavior  
**Maintenance**: Regular updates based on user feedback and design evolution