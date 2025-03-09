import React from 'react';
import { useGameStore } from '../store';
import { HelpCircle } from 'lucide-react';

export const GameStatus: React.FC = () => {
  const { attempts, maxAttempts, guessed, currentLandmark, showHint, toggleHint, guesses }= useGameStore();

  const handleCopy = () => {
    // Create the share text, including attempts and emojis (✅ or ❌)
    const shareText = `🎉 I guessed the landmark! The landmark is ${currentLandmark.name} located in ${currentLandmark.location}. I made ${attempts} attempts: ${guesses.map((guess, index) => `${guess} ${isCloseMatch(guess, currentLandmark.name) ? '✅' : '❌'}`).join(' ')}`;

    navigator.clipboard.writeText(shareText)
      .then(() => {
        alert('Result copied to clipboard!'); // Optional: Show a confirmation message
      })
      .catch((error) => {
        console.error('Error copying text to clipboard:', error);
      });
  };

  const isCloseMatch = (guess: string, actual: string) => {
    return guess.toLowerCase().trim() === actual.toLowerCase().trim();
  };

  if (guessed) {

    return (
      <div className="text-center p-6 bg-green-100 rounded-xl border border-green-200 shadow-inner animate-fade-in">
        <p className="text-2xl font-bold text-green-700 mb-2">🎉 Congratulations! 🎉</p>
        <p className="text-green-600">
          You found the {currentLandmark.name} in {currentLandmark.location}!
        </p>
        <button
          onClick={handleCopy}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 transition-colors"
        >
          Share Your Result
        </button>
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