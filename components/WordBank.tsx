import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Search, Volume2, Loader2 } from 'lucide-react';
import { getWordBankWords, WordBankWord } from '../src/api/supabase';

interface WordBankProps {
  onBack: () => void;
  userField?: string; // Optional field to filter words
  userId?: string; // User ID to fetch their learned words
}

const WordBank: React.FC<WordBankProps> = ({ onBack, userField, userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState<WordBankWord[]>([]);
  const [filteredWords, setFilteredWords] = useState<WordBankWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch words from Supabase on component mount
  useEffect(() => {
    console.log('🔍 WordBank: useEffect triggered', { userId, userField });
    fetchWords();
  }, [userField, userId]);

  // Filter words when search term changes - Pure client-side filtering
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredWords(words);
    } else {
      // Efficient client-side filtering
      const filtered = words.filter(word =>
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.definition.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWords(filtered);
    }
  }, [searchTerm, words]);

  const fetchWords = async () => {
    try {
      console.log('🔍 WordBank: fetchWords called with', { userId, userField });
      setLoading(true);
      setError(null);
      
      if (!userId) {
        console.error('❌ WordBank: userId is missing', { userId, userField });
        setError('User ID is required to fetch learned words.');
        setLoading(false);
        return;
      }
      
      console.log('✅ WordBank: Calling getWordBankWords with', { userId, userField });
      const fetchedWords = await getWordBankWords(userId, userField);
      console.log('✅ WordBank: Fetched words', fetchedWords);
      
      // Debug: Check for words with placeholder definitions
      const wordsWithPlaceholders = fetchedWords.filter(word => 
        word.definition.startsWith('Definition for ')
      );
      if (wordsWithPlaceholders.length > 0) {
        console.warn('⚠️ WordBank: Found words with placeholder definitions:', 
          wordsWithPlaceholders.map(w => ({ word: w.word, definition: w.definition }))
        );
      }
      
      setWords(fetchedWords);
      setFilteredWords(fetchedWords);
    } catch (err) {
      console.error('❌ WordBank: Error fetching words:', err);
      setError('Failed to load words. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleRetry = () => {
    fetchWords();
  };

  if (loading) {
    return (
      <div className="w-full max-w-[500px] mx-auto bg-white min-h-screen shadow-lg flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <button onClick={onBack} className="text-[var(--primary)]">
              <FiArrowLeft size={22} strokeWidth={2} />
            </button>
            <h1 className="text-lg font-semibold">Wordbank</h1>
            <div className="w-6"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-[var(--primary)]" size={32} />
            <p className="text-gray-600">Loading words...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[500px] mx-auto bg-white min-h-screen shadow-lg flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <button onClick={onBack} className="text-[var(--primary)]">
              <FiArrowLeft size={22} strokeWidth={2} />
            </button>
            <h1 className="text-lg font-semibold">Wordbank</h1>
            <div className="w-6"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[500px] mx-auto bg-white min-h-screen shadow-lg flex flex-col">
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
            {searchTerm ? (
              <>
                <p>No words found matching "{searchTerm}"</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilteredWords(words);
                  }}
                  className="mt-2 text-[var(--primary)] hover:underline"
                >
                  Clear search
                </button>
              </>
            ) : (
              <p>No words available in the word bank</p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-3 text-sm text-gray-600">
              {searchTerm ? `Found ${filteredWords.length} word${filteredWords.length !== 1 ? 's' : ''}` : `${filteredWords.length} word${filteredWords.length !== 1 ? 's' : ''} available`}
            </div>
            {filteredWords.map((word) => (
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

                {/* Learning Info - Simplified */}
                {word.learned_at && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      <span>Learned: {new Date(word.learned_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default WordBank;
