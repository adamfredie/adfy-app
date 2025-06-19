# Settings Screen Design Specification
# Aduffy Learning Platform

**Screen Type**: Profile and Preferences Management  
**Priority**: Medium  
**Complexity**: Medium  

---

## Overview

The Settings screen allows users to manage their profile information, learning preferences, and account settings. It provides easy access to modify onboarding preferences, upload profile pictures, and customize their learning experience.

## Layout Architecture

### Container Structure
- **Max Width**: 896px (5xl container)
- **Layout**: Single column with tabbed sections
- **Padding**: 32px on desktop, 24px on mobile
- **Background**: Clean white with subtle section dividers

### Navigation Structure
```css
.settings-container {
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.settings-nav {
  border-bottom: 1px solid var(--border);
  margin-bottom: 2rem;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
```

## Section Layout

### 1. Settings Header

#### Header Structure
```html
<header class="settings-header">
  <div class="header-content">
    <h1>Settings</h1>
    <p>Manage your profile and learning preferences</p>
  </div>
  <button class="back-button">
    <ArrowLeft />
    Back to Dashboard
  </button>
</header>
```

#### Styling
```css
.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.settings-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--aduffy-navy);
  margin-bottom: 0.5rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: white;
  color: var(--foreground);
  transition: all 0.2s ease;
}

.back-button:hover {
  border-color: var(--aduffy-yellow);
  background: rgba(249, 168, 37, 0.05);
}
```

### 2. Profile Section

#### Profile Card Layout
```css
.profile-section {
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.profile-header {
  display: flex;
  items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
```

#### Profile Picture Management
```html
<div class="profile-picture-section">
  <div class="profile-picture-container">
    <img src="[profile-picture]" alt="Profile Picture" class="profile-picture" />
    <button class="picture-edit-overlay">
      <Camera />
      <span>Change</span>
    </button>
  </div>
  
  <div class="picture-actions">
    <button class="upload-button">Upload New Picture</button>
    <button class="remove-button">Remove Picture</button>
  </div>
</div>
```

#### Profile Picture Styling
```css
.profile-picture-container {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--aduffy-yellow);
}

.profile-picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.picture-edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: pointer;
}

.profile-picture-container:hover .picture-edit-overlay {
  opacity: 1;
}

.picture-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 1rem;
}
```

#### Basic Info Form
```html
<form class="profile-form">
  <div class="form-group">
    <label for="job-title">Job Title</label>
    <input type="text" id="job-title" value="[current-title]" />
  </div>
  
  <div class="form-group">
    <label for="company">Company</label>
    <input type="text" id="company" value="[current-company]" />
  </div>
  
  <div class="form-row">
    <div class="form-group">
      <label for="industry">Industry</label>
      <select id="industry">
        <option value="">Select Industry</option>
        <!-- Industry options -->
      </select>
    </div>
    
    <div class="form-group">
      <label for="experience">Experience</label>
      <select id="experience">
        <option value="">Select Experience</option>
        <!-- Experience options -->
      </select>
    </div>
  </div>
</form>
```

### 3. Learning Preferences Section

#### Vocabulary Level Adjustment
```html
<div class="preferences-section">
  <h3>Vocabulary Level</h3>
  <p>Adjust the difficulty of your learning materials</p>
  
  <div class="level-selector">
    <div class="level-option">
      <input type="radio" id="beginner" name="level" value="beginner" />
      <label for="beginner" class="level-card">
        <div class="level-indicator beginner"></div>
        <h4>Beginner</h4>
        <p>Building foundation vocabulary</p>
      </label>
    </div>
    
    <div class="level-option">
      <input type="radio" id="intermediate" name="level" value="intermediate" />
      <label for="intermediate" class="level-card">
        <div class="level-indicator intermediate"></div>
        <h4>Intermediate</h4>
        <p>Expanding professional vocabulary</p>
      </label>
    </div>
    
    <div class="level-option">
      <input type="radio" id="advanced" name="level" value="advanced" />
      <label for="advanced" class="level-card">
        <div class="level-indicator advanced"></div>
        <h4>Advanced</h4>
        <p>Mastering complex terminology</p>
      </label>
    </div>
  </div>
</div>
```

#### Level Selector Styling
```css
.level-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.level-option input[type="radio"] {
  display: none;
}

.level-card {
  padding: 1.5rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: block;
}

.level-card:hover {
  border-color: var(--aduffy-yellow);
  box-shadow: 0 2px 8px rgba(249, 168, 37, 0.1);
}

.level-option input:checked + .level-card {
  border-color: var(--aduffy-yellow);
  background: rgba(249, 168, 37, 0.05);
}

.level-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.level-indicator.beginner { background: var(--success); }
.level-indicator.intermediate { background: var(--warning); }
.level-indicator.advanced { background: var(--aduffy-orange); }
```

#### Professional Field Selection
```html
<div class="field-selection">
  <h3>Professional Field</h3>
  <p>Switch fields to explore different vocabulary sets</p>
  
  <div class="field-grid">
    <div class="field-card" data-field="marketing">
      <div class="field-icon">📊</div>
      <h4>Marketing</h4>
      <p>Brand, campaigns, analytics</p>
    </div>
    
    <div class="field-card" data-field="technology">
      <div class="field-icon">💻</div>
      <h4>Technology</h4>
      <p>Development, systems, data</p>
    </div>
    
    <!-- Additional field cards -->
  </div>
</div>
```

### 4. Data Management Section

#### Export and Reset Options
```html
<div class="data-management">
  <h3>Data Management</h3>
  
  <div class="management-options">
    <div class="option-card">
      <h4>Export Data</h4>
      <p>Download your learning progress and vocabulary lists</p>
      <button class="export-button">Export Data</button>
    </div>
    
    <div class="option-card warning">
      <h4>Reset Progress</h4>
      <p>Clear all learning progress and start fresh</p>
      <button class="reset-button">Reset Progress</button>
    </div>
    
    <div class="option-card danger">
      <h4>Reset Profile</h4>
      <p>Clear profile and return to onboarding</p>
      <button class="profile-reset-button">Reset Profile</button>
    </div>
  </div>
</div>
```

#### Management Card Styling
```css
.management-options {
  display: grid;
  gap: 1rem;
}

.option-card {
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-card.warning {
  border-color: var(--warning);
  background: rgba(255, 193, 7, 0.05);
}

.option-card.danger {
  border-color: var(--destructive);
  background: rgba(220, 53, 69, 0.05);
}

.export-button,
.reset-button,
.profile-reset-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.export-button {
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  border: none;
}

.reset-button {
  background: var(--warning);
  color: var(--warning-foreground);
  border: none;
}

.profile-reset-button {
  background: var(--destructive);
  color: var(--destructive-foreground);
  border: none;
}
```

## Form Handling

### Input Styling
```css
.settings-form .form-group {
  margin-bottom: 1.5rem;
}

.settings-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--aduffy-navy);
}

.settings-form input,
.settings-form select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--input-background);
  transition: border-color 0.2s ease;
}

.settings-form input:focus,
.settings-form select:focus {
  outline: none;
  border-color: var(--aduffy-yellow);
  box-shadow: 0 0 0 3px rgba(249, 168, 37, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
```

### Save States
```css
.save-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
}

.save-indicator.saving {
  background: rgba(249, 168, 37, 0.1);
  color: var(--aduffy-navy);
}

.save-indicator.saved {
  background: rgba(40, 167, 69, 0.1);
  color: var(--success);
}

.save-indicator.error {
  background: rgba(220, 53, 69, 0.1);
  color: var(--destructive);
}
```

## Interactive Elements

### Modal Dialogs
```css
.confirmation-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
```

### File Upload
```css
.file-upload-area {
  border: 2px dashed var(--border);
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.file-upload-area:hover,
.file-upload-area.dragover {
  border-color: var(--aduffy-yellow);
  background: rgba(249, 168, 37, 0.05);
}

.file-upload-area input[type="file"] {
  display: none;
}
```

## Responsive Behavior

### Mobile (< 640px)
- **Single Column**: All form elements stack vertically
- **Profile Picture**: Centered layout with stacked actions
- **Field Grid**: Single column for field selection cards
- **Navigation**: Simplified back button placement

### Tablet (640px - 1024px)
- **Form Layout**: Two-column for shorter related fields
- **Field Grid**: Two columns for field selection
- **Profile Section**: Maintains horizontal profile picture layout

### Desktop (> 1024px)
- **Optimal Layout**: Three columns for field selection
- **Form Sections**: Logical grouping with appropriate whitespace
- **Fixed Actions**: Sticky save/cancel buttons if needed

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical progression through all interactive elements
- **Focus Management**: Clear focus states for all inputs
- **Modal Handling**: Proper focus trapping in confirmation dialogs

### Screen Reader Support
- **Form Labels**: Proper association between labels and inputs
- **Instructions**: Clear instructions for complex interactions
- **Status Updates**: Live regions for save status and errors

### Visual Accessibility
- **Color Contrast**: High contrast for all text and interactive elements
- **Focus Indicators**: Clear visual focus states
- **Error States**: Both color and icon indicators for errors

## Error Handling

### Validation Messages
- **Real-time Validation**: Immediate feedback for invalid inputs
- **Error Styling**: Red borders and descriptive error messages
- **Success States**: Green indicators for valid inputs

### Save Error Recovery
- **Retry Mechanism**: Clear retry options for failed saves
- **Draft Recovery**: Auto-save draft states for form data
- **Network Issues**: Graceful handling of connectivity problems

---

**Design Status**: Complete  
**Implementation Notes**: Focus on auto-save functionality and user feedback  
**Testing Requirements**: Form validation, file upload, accessibility compliance