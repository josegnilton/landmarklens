import React from 'react';
import { useGameStore } from '../store';

export const GuessHistory: React.FC = () => {
  const { guesses } = useGameStore();

  if (guesses.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Previous Guesses</h3>
      <div className="space-y-2">
        {guesses.map((guess, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-lg text-gray-700 border border-gray-100
                     transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            {guess}
          </div>
        ))}
      </div>
    </div>
  );
};