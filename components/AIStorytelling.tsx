import React, { useState } from 'react';
import './styles/main.css';

interface Word {
  id: number;
  word: string;
  type: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  definition: string;
  example: string;
}

export function AIStorytelling() {
  const [activeTab, setActiveTab] = useState('words');
  
  const words: Word[] = [
    {
      id: 1,
      word: 'Segmentation',
      type: 'noun',
      level: 'intermediate',
      definition: 'The process of dividing a market into distinct groups of consumers',
      example: 'Market segmentation helped the company target specific customer demographics.'
    },
    {
      id: 2,
      word: 'Attribution',
      type: 'noun',
      level: 'advanced',
      definition: 'The process of determining which marketing efforts led to a sale',
      example: 'Attribution analysis revealed that social media campaigns had the highest conversion rate.'
    },
    {
      id: 3,
      word: 'Optimization',
      type: 'noun',
      level: 'intermediate',
      definition: 'The action of making the best or most effective use of a situation',
      example: 'Campaign optimization resulted in a 40% increase in click-through rates.'
    },
    {
      id: 4,
      word: 'Conversion',
      type: 'noun',
      level: 'beginner',
      definition: 'The process of turning prospects into customers',
      example: 'The new landing page improved conversion rates by 25%.'
    },
    {
      id: 5,
      word: 'Engagement',
      type: 'noun',
      level: 'beginner',
      definition: 'The level of interaction and involvement with content or campaigns',
      example: 'Social media engagement increased significantly after the brand refresh.'
    }
  ];

  return (
    <div className="storytelling-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <a href="/">Dashboard</a>
        <span className="breadcrumb-separator">/</span>
        <span>AI Storytelling</span>
      </div>

      {/* Back Button */}
      <a href="#" className="back-button">
        ← Back to Dashboard
      </a>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-text">Overall Progress</span>
          <span className="progress-step">Step 1 of 5</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: '0%' }}></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="learning-nav">
        <div 
          className={`learning-nav-item ${activeTab === 'words' ? 'active' : ''}`}
          onClick={() => setActiveTab('words')}
        >
          Words
        </div>
        <div 
          className={`learning-nav-item ${activeTab === 'learning' ? 'active' : ''}`}
          onClick={() => setActiveTab('learning')}
        >
          Learning
        </div>
        <div 
          className={`learning-nav-item ${activeTab === 'writing' ? 'active' : ''}`}
          onClick={() => setActiveTab('writing')}
        >
          Writing
        </div>
        <div 
          className={`learning-nav-item ${activeTab === 'voice' ? 'active' : ''}`}
          onClick={() => setActiveTab('voice')}
        >
          Voice Chat
        </div>
        <div 
          className={`learning-nav-item ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Results
        </div>
      </nav>

      {/* Vocabulary Section */}
      <div className="vocabulary-header">
        <div className="vocabulary-header-icon">📚</div>
        <h2 className="vocabulary-title">Today's Vocabulary Words</h2>
        <p className="vocabulary-subtitle">
          Master these 5 carefully selected vocabulary words to enhance your professional
          communication skills.
        </p>
        <div className="vocabulary-count">
          📋 5 Professional Words
        </div>
      </div>

      {/* Learning Focus */}
      <div className="learning-focus">
        <div className="learning-focus-title">
          ⚙️ Learning Focus
        </div>
        <p className="learning-focus-description">
          Choose your professional field to get relevant vocabulary
        </p>
        <select className="field-select">
          <option value="marketing">📊 Marketing</option>
          <option value="technology">💻 Technology</option>
          <option value="finance">💰 Finance</option>
          <option value="healthcare">🏥 Healthcare</option>
        </select>
      </div>

      {/* Audio Learning Section */}
      <div className="audio-learning">
        <div className="audio-learning-header">
          <span className="audio-icon">🔊</span>
          <p className="audio-description">
            Listen to perfect pronunciation of all vocabulary words
          </p>
        </div>
        <button className="play-all-button">
          ▶️ Play All Words
        </button>
      </div>

      {/* Vocabulary Cards */}
      <div className="vocabulary-grid">
        {words.map((word) => (
          <div key={word.id} className="vocabulary-card">
            <div className="vocabulary-card-header">
              <div className="word-number">{word.id}</div>
              <div className={`word-level ${word.level}`}>
                {word.level}
              </div>
            </div>
            <div className="vocabulary-word">
              {word.word}
              <button className="audio-button">🔊</button>
            </div>
            <div className="word-type">{word.type}</div>
            <div>
              <div className="definition-label">Definition</div>
              <div className="word-definition">{word.definition}</div>
            </div>
            <div>
              <div className="example-label">Professional Example</div>
              <div className="word-example">"{word.example}"</div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <button className="continue-button">
        Continue to Learning Activities →
      </button>
    </div>
  );
} 