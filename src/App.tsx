
import { useEffect } from 'react';
import { Compass, RefreshCw } from 'lucide-react';
import { useGameStore } from './store';
import { GuessInput } from './components/GuessInput';
import { GameStatus } from './components/GameStatus';
import { GuessHistory } from './components/GuessHistory';
import { GameHistory } from './components/GameHistory'
import { Toaster } from 'react-hot-toast';

function App() {
  const { currentLandmark, blurLevel, resetGame } = useGameStore();
  const isDailyMode = useGameStore((s) => s.isDailyMode);
  const guessed = useGameStore((state) => state.guessed);
  const attempts = useGameStore((state) => state.attempts);
  const maxAttempts = useGameStore((state) => state.maxAttempts);
  const gameOver = guessed || attempts >= maxAttempts;

  const dailyCompleted = useGameStore((s) => s.dailyCompleted);


  useEffect(() => {
    useGameStore.getState().resetGame(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Toaster />
      <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-8 h-8 text-blue-600 animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                LandmarkLens
              </h1>
            </div>
            {dailyCompleted && (
              <button
                onClick={() => useGameStore.getState().resetGame(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                <RefreshCw size={16} />
                New Game
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-center mt-4 pb-2 text-blue-500 animate-pulse">
            {isDailyMode ? "🌐 Daily Challenge!" : "🎯 Explore in Free Mode!"}
          </h2>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl bg-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div
              className="w-full h-full transition-all duration-700 ease-in-out transform hover:scale-105"
              style={{
                backgroundImage: `url(${currentLandmark.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: `blur(${blurLevel}px)`
              }}
              aria-label="Mystery landmark"
            />
          </div>

          <div className="flex flex-col items-center space-y-6 mt-6">
            <GameStatus />
            <GuessInput />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            <GuessHistory />
          </div>

          <div>
            <GameHistory />
          </div>
        </div>
      </main>

      <footer className="mt-auto py-4 text-center text-sm text-gray-600">
        <p>Try to guess the landmark in 6 attempts or less!</p>
      </footer>
    </div>
  );
}

export default App;
