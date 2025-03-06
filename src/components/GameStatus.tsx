import React from 'react';
import { useGameStore } from '../store';
import { HelpCircle } from 'lucide-react';

export const GameStatus: React.FC = () => {
  const { attempts, maxAttempts, guessed, currentLandmark, showHint, toggleHint } = useGameStore();
  
  if (guessed) {
    return (
      <div className="text-center p-6 bg-green-100 rounded-xl border border-green-200 shadow-inner animate-fade-in">
        <p className="text-2xl font-bold text-green-700 mb-2">🎉 Congratulations! 🎉</p>
        <p className="text-green-600">
          You found the {currentLandmark.name} in {currentLandmark.location}!
        </p>
      </div>
    );
  }

  if (attempts >= maxAttempts) {
    return (
      <div className="text-center p-6 bg-red-100 rounded-xl border border-red-200 shadow-inner animate-fade-in">
        <p className="text-2xl font-bold text-red-700 mb-2">Game Over</p>
        <p className="text-red-600">
          The landmark was {currentLandmark.name} in {currentLandmark.location}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <p className="text-xl font-semibold text-gray-700 mb-4">
        {maxAttempts - attempts} Attempts Remaining
      </p>
      <button
        onClick={toggleHint}
        className="group flex items-center gap-2 mx-auto px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
      >
        <HelpCircle size={16} className="group-hover:rotate-12 transition-transform" />
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </button>
      {showHint && (
        <p className="mt-4 text-gray-600 italic animate-fade-in">
          Hint: {currentLandmark.hint}
        </p>
      )}
    </div>
  );
};