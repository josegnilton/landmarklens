import { create } from 'zustand';
import { GameState } from './types';
import { landmarks } from './data/landmarks';
import { compareTwoStrings } from 'string-similarity';

const SIMILARITY_THRESHOLD = 0.8;

const getRandomLandmark = () => {
  const randomIndex = Math.floor(Math.random() * landmarks.length);
  return landmarks[randomIndex];
};

const isCloseMatch = (guess: string, actual: string): boolean => {
  const similarity = compareTwoStrings(
    guess.toLowerCase().trim(),
    actual.toLowerCase().trim()
  );
  return similarity >= SIMILARITY_THRESHOLD;
};

export const useGameStore = create<GameState>((set) => ({
  currentLandmark: getRandomLandmark(),
  attempts: 0,
  maxAttempts: 6,
  guessed: false,
  blurLevel: 20,
  guesses: [],
  showHint: false,
  addGuess: (guess: string) => set((state) => ({
    attempts: state.attempts + 1,
    blurLevel: Math.max(0, state.blurLevel - 4),
    guesses: [...state.guesses, guess],
    guessed: isCloseMatch(guess, state.currentLandmark.name)
  })),
  resetGame: () => set({
    currentLandmark: getRandomLandmark(),
    attempts: 0,
    blurLevel: 20,
    guessed: false,
    guesses: [],
    showHint: false
  }),
  toggleHint: () => set((state) => ({
    showHint: !state.showHint
  }))
}));