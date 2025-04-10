import React, { useState } from 'react';
import { useGameStore } from '../store';
import { landmarks } from '../data/landmarks';

export const GuessInput: React.FC = () => {
  const [guess, setGuess] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addGuess, guessed, attempts, maxAttempts } = useGameStore();

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

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <p className="text-sm font-semibold mb-2 text-[#314158]">Think you got it? Type below!</p>
      <div className="flex w-full h-12">
        <input
          type="text"
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value);
            setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          disabled={guessed || attempts >= maxAttempts}
          placeholder="Enter landmark name..."
          className="w-4/5 rounded px-4 py-2 text-gray-700 bg-white border-2 border-transparent shadow-sm
                     focus:outline-none focus:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={guessed || attempts >= maxAttempts}
          className="w-1/5 rounded bg-[#053345] text-white font-semibold disabled:opacity-50"
        >
          Submit
        </button>
      </div>

      {showSuggestions && filteredLandmarks.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border shadow-md max-h-60 overflow-auto">
          {filteredLandmarks.map((landmark) => (
            <li
              key={landmark.id}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => handleSelect(landmark.name)}
            >
              {landmark.name}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};
