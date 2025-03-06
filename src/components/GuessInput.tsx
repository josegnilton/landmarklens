import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useGameStore } from '../store';

export const GuessInput: React.FC = () => {
  const [guess, setGuess] = useState('');
  const { addGuess, guessed, attempts, maxAttempts } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !guessed && attempts < maxAttempts) {
      addGuess(guess.trim());
      setGuess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative group">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={guessed || attempts >= maxAttempts}
          placeholder="Enter landmark name..."
          className="w-full px-4 py-3 text-gray-700 bg-white border-2 border-transparent rounded-xl shadow-sm 
                   focus:outline-none focus:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed
                   transition-all duration-300 group-hover:shadow-md"
        />
        <button
          type="submit"
          disabled={guessed || attempts >= maxAttempts}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500 
                   disabled:opacity-50 transition-colors duration-300"
        >
          <Search size={20} className="transform group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>
    </form>
  );
};