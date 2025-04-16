import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store';
import { landmarks } from '../data/landmarks';

export const GuessInput: React.FC = () => {
  const [guess, setGuess] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addGuess, guessed, attempts, maxAttempts } = useGameStore();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const filteredLandmarks = landmarks.filter(l =>
    l.name.toLowerCase().includes(guess.toLowerCase())
  );
  
  const handleSelect = (name: string) => {
    setGuess(name);
    setShowSuggestions(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !guessed && attempts < maxAttempts) {
      addGuess(guess.trim());
      setGuess('');
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <p className="text-sm md:text-base font-semibold mb-2 text-[#314158]">Think you got it? Type below!</p>
      <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-0">
        <div className="relative w-full sm:w-4/5">
          <input
            type="text"
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(Boolean(guess))}
            disabled={guessed || attempts >= maxAttempts}
            placeholder="Enter landmark name..."
            className="w-full h-12 rounded sm:rounded-r-none px-4 py-2 text-gray-700 bg-white border-2 border-transparent shadow-sm
                      focus:outline-none focus:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          
          {showSuggestions && filteredLandmarks.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border shadow-md max-h-60 overflow-auto rounded"
            >
              <ul>
                {filteredLandmarks.map((landmark) => (
                  <li
                    key={landmark.id}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 transition-colors text-sm md:text-base"
                    onClick={() => handleSelect(landmark.name)}
                  >
                    {landmark.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={guessed || attempts >= maxAttempts}
          className="h-12 w-full sm:w-1/5 rounded sm:rounded-l-none bg-[#053345] text-white font-semibold disabled:opacity-50 transition-colors hover:bg-[#0a4d65]"
        >
          Submit
        </button>
      </div>
    </form>
  );
};