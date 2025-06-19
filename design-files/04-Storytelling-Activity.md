# AI Storytelling Activity Design Specification
# Aduffy Learning Platform

**Screen Type**: Interactive Learning Activity  
**Priority**: High  
**Complexity**: High  

---

## Overview

The AI Storytelling Activity is the flagship learning experience of Aduffy Learning. It guides users through a 5-step journey that combines vocabulary learning, creative writing, and voice interaction to create an engaging and comprehensive learning experience.

## Activity Flow Architecture

### Step Flow Diagram
```
Step 1: Daily Words → Step 2: Learning Quiz → Step 3: Story Writing → Step 4: Voice Chat → Step 5: Results
```

### Container Structure
```css
.storytelling-container {
  max-width: 896px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - 80px);
}

.step-wrapper {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
```

## Header and Navigation

### Activity Header
```html
<header class="activity-header">
  <div class="header-content">
    <button class="back-button">
      <ArrowLeft />
      Back to Dashboard
    </button>
    
    <div class="activity-info">
      <h1>AI Storytelling</h1>
      <p>Create stories using professional vocabulary</p>
    </div>
    
    <div class="field-selector">
      <select id="vocabulary-field">
        <option value="marketing">Marketing</option>
        <option value="technology">Technology</option>
        <option value="sales">Sales</option>
        <!-- More options -->
      </select>
    </div>
  </div>
  
  <div class="progress-indicator">
    <div class="progress-bar">
      <div class="progress-fill" style="width: [progress]%"></div>
    </div>
    <div class="step-indicators">
      <div class="step-dot active">1</div>
      <div class="step-dot">2</div>
      <div class="step-dot">3</div>
      <div class="step-dot">4</div>
      <div class="step-dot">5</div>
    </div>
  </div>
</header>
```

### Header Styling
```css
.activity-header {
  background: linear-gradient(135deg, var(--aduffy-yellow) 0%, var(--aduffy-orange) 100%);
  color: white;
  padding: 2rem;
  margin-bottom: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.activity-info h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.field-selector {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.field-selector select {
  background: transparent;
  border: none;
  color: white;
  font-weight: 500;
}

.progress-indicator {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.6s ease-out;
}

.step-indicators {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step-dot.active {
  background: white;
  color: var(--aduffy-navy);
  transform: scale(1.1);
}

.step-dot.completed {
  background: var(--success);
  color: white;
}
```

## Step 1: Daily Vocabulary Words

### Layout Structure
```html
<div class="step-content step-words">
  <div class="step-header">
    <h2>Today's Vocabulary Words</h2>
    <p>Master these 5 professional words from [Field]</p>
  </div>
  
  <div class="words-grid">
    <!-- Word cards -->
  </div>
  
  <div class="example-story-section">
    <h3>Example Story</h3>
    <div class="story-container">
      <!-- Example story content -->
    </div>
    <button class="listen-button">
      <Volume2 />
      Listen to Story
    </button>
  </div>
  
  <div class="step-actions">
    <button class="primary-button">Start Learning</button>
  </div>
</div>
```

### Word Cards Design
```css
.words-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: 2rem 0;
}

@media (min-width: 768px) {
  .words-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.word-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.word-card:hover {
  border-color: var(--aduffy-yellow);
  box-shadow: 0 4px 12px rgba(249, 168, 37, 0.1);
}

.word-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.word-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--aduffy-navy);
}

.word-part-of-speech {
  font-size: 0.875rem;
  color: var(--muted-foreground);
  font-style: italic;
}

.pronunciation-button {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pronunciation-button:hover {
  border-color: var(--aduffy-yellow);
  background: rgba(249, 168, 37, 0.05);
}

.word-definition {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.word-example {
  background: var(--muted);
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid var(--aduffy-yellow);
  font-style: italic;
}
```

### Example Story Section
```css
.example-story-section {
  background: linear-gradient(135deg, rgba(249, 168, 37, 0.05) 0%, rgba(253, 126, 20, 0.05) 100%);
  border: 1px solid rgba(249, 168, 37, 0.2);
  border-radius: 0.75rem;
  padding: 2rem;
  margin: 2rem 0;
}

.story-container {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  line-height: 1.7;
  font-size: 1rem;
}

.story-container .vocabulary-word {
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

.listen-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.listen-button:hover {
  background: var(--aduffy-yellow-dark);
}
```

## Step 2: Learning Quiz

### Quiz Layout
```html
<div class="step-content step-quiz">
  <div class="quiz-progress">
    <div class="progress-text">Question [current] of [total]</div>
    <div class="quiz-progress-bar">
      <div class="quiz-progress-fill" style="width: [percentage]%"></div>
    </div>
  </div>
  
  <div class="question-card">
    <div class="question-header">
      <span class="question-type">[Type]</span>
      <h3 class="question-text">[Question]</h3>
    </div>
    
    <div class="answer-options">
      <!-- Answer options -->
    </div>
  </div>
  
  <div class="quiz-actions">
    <button class="skip-button">Skip Question</button>
    <button class="submit-button" disabled>Submit Answer</button>
  </div>
</div>
```

### Quiz Styling
```css
.quiz-progress {
  background: white;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quiz-progress-bar {
  width: 200px;
  height: 8px;
  background: var(--muted);
  border-radius: 4px;
  overflow: hidden;
}

.quiz-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--aduffy-yellow) 0%, var(--aduffy-orange) 100%);
  transition: width 0.4s ease-out;
}

.question-card {
  background: white;
  padding: 2rem;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.question-type {
  display: inline-block;
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.question-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--aduffy-navy);
  margin-bottom: 2rem;
  line-height: 1.4;
}

.answer-options {
  display: grid;
  gap: 1rem;
}

.answer-option {
  padding: 1rem 1.5rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  text-align: left;
}

.answer-option:hover {
  border-color: var(--aduffy-yellow);
  box-shadow: 0 2px 8px rgba(249, 168, 37, 0.1);
}

.answer-option.selected {
  border-color: var(--aduffy-yellow);
  background: rgba(249, 168, 37, 0.05);
}

.answer-option.correct {
  border-color: var(--success);
  background: rgba(40, 167, 69, 0.05);
}

.answer-option.incorrect {
  border-color: var(--destructive);
  background: rgba(220, 53, 69, 0.05);
}
```

### Feedback Display
```css
.quiz-feedback {
  background: white;
  border-top: 1px solid var(--border);
  padding: 1.5rem;
  margin-top: auto;
}

.feedback-correct {
  background: rgba(40, 167, 69, 0.1);
  border-left: 4px solid var(--success);
  padding: 1rem;
  border-radius: 0.5rem;
}

.feedback-incorrect {
  background: rgba(220, 53, 69, 0.1);
  border-left: 4px solid var(--destructive);
  padding: 1rem;
  border-radius: 0.5rem;
}

.feedback-explanation {
  margin-top: 0.5rem;
  font-style: italic;
  color: var(--muted-foreground);
}
```

## Step 3: Story Writing

### Writing Interface
```html
<div class="step-content step-writing">
  <div class="writing-prompt">
    <h3>Your Story Challenge</h3>
    <div class="scenario-card">
      <h4>[Scenario Title]</h4>
      <p>[Scenario Description]</p>
    </div>
    
    <div class="requirements">
      <h4>Requirements:</h4>
      <ul>
        <li>Use all 5 vocabulary words in your story</li>
        <li>Write 200-500 words</li>
        <li>Keep it professional and realistic</li>
      </ul>
    </div>
    
    <div class="vocabulary-reference">
      <h4>Your Vocabulary Words:</h4>
      <div class="word-chips">
        <!-- Word chips -->
      </div>
    </div>
  </div>
  
  <div class="writing-area">
    <div class="editor-toolbar">
      <span class="word-count">0 / 500 words</span>
      <div class="word-usage-indicators">
        <!-- Word usage indicators -->
      </div>
    </div>
    
    <textarea 
      class="story-editor"
      placeholder="Start writing your professional story here..."
    ></textarea>
    
    <div class="writing-actions">
      <button class="save-draft-button">Save Draft</button>
      <button class="analyze-story-button">Analyze Story</button>
    </div>
  </div>
</div>
```

### Writing Area Styling
```css
.step-writing {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  padding: 2rem;
}

@media (max-width: 1024px) {
  .step-writing {
    grid-template-columns: 1fr;
  }
}

.writing-prompt {
  background: var(--muted);
  padding: 1.5rem;
  border-radius: 0.75rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.scenario-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 1rem 0;
}

.scenario-card h4 {
  color: var(--aduffy-navy);
  margin-bottom: 0.5rem;
}

.requirements ul {
  list-style-type: none;
  padding: 0;
}

.requirements li {
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.requirements li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--success);
  font-weight: bold;
}

.word-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.word-chip {
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.word-chip.used {
  background: var(--success);
  color: white;
}

.writing-area {
  display: flex;
  flex-direction: column;
  height: 600px;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border);
  border-bottom: none;
  border-radius: 0.75rem 0.75rem 0 0;
  background: var(--muted);
}

.word-count {
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.word-usage-indicators {
  display: flex;
  gap: 0.25rem;
}

.usage-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
}

.usage-dot.used {
  background: var(--success);
}

.story-editor {
  flex: 1;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 0 0 0.75rem 0.75rem;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
}

.story-editor:focus {
  outline: none;
  border-color: var(--aduffy-yellow);
  box-shadow: 0 0 0 3px rgba(249, 168, 37, 0.1);
}

.writing-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
```

## Step 4: Voice Conversation

### Voice Interface Layout
```html
<div class="step-content step-voice">
  <div class="conversation-header">
    <h3>Voice Conversation</h3>
    <p>Discuss your story with our AI assistant</p>
  </div>
  
  <div class="conversation-area">
    <div class="messages-container">
      <!-- Conversation messages -->
    </div>
    
    <div class="voice-controls">
      <div class="voice-status">
        <div class="status-indicator">
          <div class="pulse-animation"></div>
        </div>
        <span class="status-text">Ready to listen</span>
      </div>
      
      <button class="voice-button">
        <Mic />
        <span>Hold to Speak</span>
      </button>
      
      <div class="voice-options">
        <button class="skip-voice">Skip Voice Chat</button>
      </div>
    </div>
  </div>
  
  <div class="vocabulary-tracker">
    <h4>Use These Words in Conversation:</h4>
    <div class="conversation-words">
      <!-- Word tracking chips -->
    </div>
  </div>
</div>
```

### Voice Interface Styling
```css
.step-voice {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 600px;
}

.conversation-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 80%;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  position: relative;
}

.message.ai {
  background: var(--muted);
  align-self: flex-start;
  border-bottom-left-radius: 0.25rem;
}

.message.user {
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  align-self: flex-end;
  border-bottom-right-radius: 0.25rem;
}

.voice-controls {
  background: var(--muted);
  padding: 2rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.voice-status {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.vocabulary-tracker {
  background: var(--muted);
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-top: 1rem;
}

.conversation-words {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.conversation-word-chip {
  background: var(--border);
  color: var(--muted-foreground);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.conversation-word-chip.used {
  background: var(--success);
  color: white;
}
```

## Step 5: Results and Analysis

### Results Layout
```html
<div class="step-content step-results">
  <div class="results-header">
    <div class="completion-badge">
      <CheckCircle />
      <h2>Story Complete!</h2>
    </div>
    <p>Great work on your vocabulary practice</p>
  </div>
  
  <div class="results-grid">
    <div class="score-card overall">
      <h3>Overall Score</h3>
      <div class="score-display">
        <span class="score-number">[Score]</span>
        <span class="score-max">/100</span>
      </div>
      <div class="score-breakdown">
        <!-- Score breakdown -->
      </div>
    </div>
    
    <div class="score-card vocabulary">
      <h3>Vocabulary Usage</h3>
      <div class="word-scores">
        <!-- Individual word scores -->
      </div>
    </div>
    
    <div class="score-card creativity">
      <h3>Creativity & Style</h3>
      <div class="creativity-metrics">
        <!-- Creativity analysis -->
      </div>
    </div>
  </div>
  
  <div class="achievements-section">
    <h3>New Achievements</h3>
    <div class="achievement-badges">
      <!-- Achievement badges -->
    </div>
  </div>
  
  <div class="next-steps">
    <h3>What's Next?</h3>
    <div class="recommendations">
      <!-- Learning recommendations -->
    </div>
  </div>
  
  <div class="results-actions">
    <button class="share-story-button">Share Story</button>
    <button class="try-again-button">Try Again</button>
    <button class="continue-learning-button">Continue Learning</button>
  </div>
</div>
```

### Results Styling
```css
.step-results {
  padding: 2rem;
}

.results-header {
  text-align: center;
  margin-bottom: 2rem;
}

.completion-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.completion-badge svg {
  width: 48px;
  height: 48px;
  color: var(--success);
}

.completion-badge h2 {
  color: var(--aduffy-navy);
  font-size: 1.75rem;
  font-weight: 700;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .results-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.score-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
}

.score-card.overall {
  background: linear-gradient(135deg, rgba(249, 168, 37, 0.1) 0%, rgba(253, 126, 20, 0.1) 100%);
  border-color: var(--aduffy-yellow);
}

.score-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin: 1rem 0;
}

.score-number {
  font-size: 3rem;
  font-weight: 700;
  color: var(--aduffy-yellow);
}

.score-max {
  font-size: 1.5rem;
  color: var(--muted-foreground);
}

.achievement-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.achievement-badge {
  background: linear-gradient(135deg, var(--aduffy-yellow) 0%, var(--aduffy-orange) 100%);
  color: white;
  padding: 1rem;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  animation: achievement-pop 0.6s ease-out;
}

@keyframes achievement-pop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.results-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.results-actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.continue-learning-button {
  background: var(--aduffy-yellow);
  color: var(--aduffy-navy);
  border: none;
}

.try-again-button,
.share-story-button {
  background: white;
  color: var(--foreground);
  border: 1px solid var(--border);
}
```

## Responsive Design

### Mobile Optimizations
```css
@media (max-width: 640px) {
  .storytelling-container {
    padding: 1rem 0.5rem;
  }
  
  .step-writing {
    grid-template-columns: 1fr;
  }
  
  .writing-prompt {
    position: static;
    margin-bottom: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .step-indicators {
    justify-content: center;
    gap: 0.5rem;
  }
  
  .voice-controls {
    padding: 1rem;
  }
  
  .results-actions {
    flex-direction: column;
  }
}
```

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical progression through interactive elements
- **Focus Management**: Clear focus states and proper focus handling
- **Voice Controls**: Keyboard alternatives for voice interactions

### Screen Reader Support
- **Progress Announcements**: Step progression and score updates
- **Content Structure**: Proper heading hierarchy and landmarks
- **Interactive Feedback**: Clear announcements for user actions

### WCAG Compliance
- **Color Contrast**: High contrast for all text and interactive elements
- **Alternative Text**: Descriptive text for all icons and visual elements
- **Form Labels**: Proper labeling for all interactive elements

---

**Design Status**: Complete  
**Implementation Priority**: High - Core feature  
**Testing Requirements**: Voice functionality, cross-browser compatibility, accessibility audit