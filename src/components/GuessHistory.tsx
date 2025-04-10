import React from 'react';
import { useGameStore } from '../store';

export const GuessHistory: React.FC = () => {
  const { guesses } = useGameStore();

  if (!guesses || guesses.length === 0) {
    return (
      <div className="w-full bg-[#F9FAFB] p-6 border border-gray-200 rounded">
        <h3 className="text-md font-semibold text-[#314158] mb-2">Your Previous Guesses</h3>
        <p className="text-gray-500">No previous guesses. Try to guess the landmark!</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F9FAFB] p-6 border border-gray-200 rounded">
      <h3 className="text-md font-semibold text-[#314158] mb-4">Your Previous Guesses</h3>
      <div className="space-y-2">
        {guesses.map((guess, index) => (
          <div
            key={index}
            className="p-3 bg-[#F3F4F6] text-[#314158] font-medium"
          >
            {guess}
          </div>
        ))}
      </div>
    </div>
  );
};
