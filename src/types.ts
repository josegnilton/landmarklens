export interface Landmark {
  id: number;
  name: string;
  location: string;
  image: string;
  hint: string;
}

export interface GameState {
  currentLandmark: Landmark;
  attempts: number;
  maxAttempts: number;
  guessed: boolean;
  blurLevel: number;
  guesses: string[];
  showHint: boolean;
  addGuess: (guess: string) => void;
  resetGame: () => void;
  toggleHint: () => void;
}