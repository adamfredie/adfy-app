import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Search, Volume2 } from 'lucide-react';

interface Word {
  id: string;
  word: string;
  type: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  definition: string;
}

const WordBank: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const words: Word[] = [
    {
      id: '1',
      word: 'Segmentation',
      type: 'noun',
      difficulty: 'intermediate',
      definition: 'The process of dividing a market into distinct groups of consumers'
    },
    {
      id: '2',
      word: 'Innovation',
      type: 'noun',
      difficulty: 'intermediate',
      definition: 'A new method, idea, product, or the introduction of something new'
    },
    {
      id: '3',
      word: 'Collaboration',
      type: 'noun',
      difficulty: 'beginner',
      definition: 'The action of working with someone to produce or create something'
    },
    {
      id: '4',
      word: 'Sustainability',
      type: 'noun',
      difficulty: 'advanced',
      definition: 'The ability to maintain or support a process over time without depleting resources'
    },
    {
      id: '5',
      word: 'Analytics',
      type: 'noun',
      difficulty: 'intermediate',
      definition: 'The systematic computational analysis of data or statistics'
    }
  ];

  // Filter words based on search term
  const filteredWords = words.filter(word =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAudioPlay = (word: string) => {
    // Implement text-to-speech functionality here
    console.log(`Playing audio for: ${word}`);
  };

  return (
    <div className="w-full max-w-[500px] mx-auto bg-white min-h-screen shadow-lg flex flex-col">
      {/* Header */}
            
      {/* Header with Search */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="text-[var(--primary)]">
            <FiArrowLeft size={22} strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold">Wordbank</h1>
          <div className="w-6"></div> {/* Spacer */}
        </div>
        
        {/* Search Bar inside Header */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
        </div>
      </div>


      {/* Words List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-20">
        {filteredWords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No words found matching "{searchTerm}"
          </div>
        ) : (
          filteredWords.map((word) => (
            <div
              key={word.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3"
            >
              {/* Word Header in Flexbox */}
              <div className="flex items-center justify-between mb-2">
      
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-sm font-light text-gray-800">{word.word}</h3>
                  <span className="text-sm italic text-gray-500">{word.type}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      word.difficulty
                    )}`}
                  >
                    {word.difficulty}
                  </span>
                </div>

                {/* Right Section: Audio Button */}
                <button
                  onClick={() => handleAudioPlay(word.word)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Volume2 size={18} className="text-[var(--primary)]" />
                </button>
              </div>

              {/* Definition */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                  Definition
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {word.definition}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WordBank;
