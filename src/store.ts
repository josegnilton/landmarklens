import { create } from 'zustand';
import { GameState, GameRecord } from './types';
import { landmarks } from './data/landmarks';
import { compareTwoStrings } from 'string-similarity';
import { persist } from 'zustand/middleware';

const SIMILARITY_THRESHOLD = 0.8;
const MAX_HISTORY_ITEMS = 30;

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

const calculateStreak = (history: GameRecord[]): number => {
  if (!history || history.length === 0) return 0;
  
  let currentStreak = 0;
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);
  
  for (const game of sortedHistory) {
    if (game.guessed) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return currentStreak;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentLandmark: getRandomLandmark(),
      attempts: 0,
      maxAttempts: 6,
      guessed: false,
      blurLevel: 20,
      guesses: [],
      showHint: false,
      gameHistory: [],
      streak: 0,
      
      addGuess: (guess: string) => {
        const state = get();
        const isCorrect = isCloseMatch(guess, state.currentLandmark.name);
        const newAttempts = state.attempts + 1;
        const gameOver = isCorrect || newAttempts >= state.maxAttempts;

        set({
          attempts: newAttempts,
          blurLevel: isCorrect ? 0 : Math.max(0, state.blurLevel - 4),
          guesses: [...state.guesses, guess],
          guessed: isCorrect
        });

        if (gameOver) {
          get().saveGameToHistory();
        }
      },
      
      saveGameToHistory: () => {
        const state = get();
        const currentDate = new Date();
        const gameId = `${state.currentLandmark.id}_${currentDate.getTime()}`;
        
        const gameExists = state.gameHistory.some(game => 
          game.landmark === state.currentLandmark.name && 
          Math.abs(game.timestamp - currentDate.getTime()) < 5000
        );
        
        if (gameExists) {
          return;
        }
        
        const newGameRecord: GameRecord = {
          id: gameId,
          date: currentDate.toISOString(),
          landmark: state.currentLandmark.name,
          location: state.currentLandmark.location,
          attempts: state.attempts,
          maxAttempts: state.maxAttempts,
          guessed: state.guessed,
          timestamp: currentDate.getTime()
        };
        
        set(state => {
          const updatedHistory = [newGameRecord, ...state.gameHistory].slice(0, MAX_HISTORY_ITEMS);
          return {
            gameHistory: updatedHistory,
            streak: calculateStreak(updatedHistory)
          };
        });
      },
      
      resetGame: () => {
        set({
          currentLandmark: getRandomLandmark(),
          attempts: 0,
          blurLevel: 20,
          guessed: false,
          guesses: [],
          showHint: false
        });
      },
      
      toggleHint: () => set((state) => ({
        showHint: !state.showHint
      })),
      
      clearHistory: () => set({
        gameHistory: [],
        streak: 0
      })
    }),
    {
      name: 'landmark-guesser-storage',
      partialize: (state) => ({
        gameHistory: state.gameHistory,
        streak: state.streak
      }),
    }
  )
);

