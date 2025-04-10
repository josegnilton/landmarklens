export interface Landmark {
  id: number;
  name: string;
  location: string;
  image: string;
  hint: string;
}

export interface GameState {
  lastStreakDate: any;
  currentLandmark: Landmark;
  attempts: number;
  maxAttempts: number;
  guessed: boolean;
  blurLevel: number;
  guesses: string[];
  showHint: boolean;
  gameHistory: GameRecord[];
  streak: number;
  addGuess: (guess: string) => void;
  resetGame: () => void;
  toggleHint: () => void;
  saveGameToHistory: () => void;
  clearHistory: () => void;
}

export interface GameRecord {
  id: string;
  date: string;
  landmark: string;
  location: string;
  attempts: number;
  maxAttempts: number;
  guessed: boolean;
  timestamp: number;
}