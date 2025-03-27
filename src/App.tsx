import React from 'react';
import { Compass, RefreshCw } from 'lucide-react';
import { useGameStore } from './store';
import { GuessInput } from './components/GuessInput';
import { GameStatus } from './components/GameStatus';
import { GuessHistory } from './components/GuessHistory';
import { GameHistory } from './components/GameHistory'
import { Toaster } from 'react-hot-toast';

function App() {
  const { currentLandmark, blurLevel, resetGame } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Toaster />
      <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-8 h-8 text-blue-600 animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                LandmarkLens
              </h1>
            </div>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              <RefreshCw size={16} />
              New Game
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Main content - now in the center */}
        <main className="flex-1 order-1 md:order-1 max-w-2xl mx-auto">
          <div className="space-y-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl bg-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <img
                src={currentLandmark.image}
                alt="Mystery landmark"
                className="w-full h-full object-cover transition-all duration-700 ease-in-out transform hover:scale-105"
                style={{ filter: `blur(${blurLevel}px)` }}
              />
            </div>

            <div className="flex flex-col items-center space-y-6">
              <GameStatus />
              <GuessInput />
              <GuessHistory />
            </div>
          </div>
        </main>

        <aside className="md:w-80 md:sticky md:top-24 md:self-start order-2 md:order-2">
          <GameHistory />
        </aside>
      </div>

      <footer className="mt-auto py-4 text-center text-sm text-gray-600">
        <p>Try to guess the landmark in 6 attempts or less!</p>
      </footer>
    </div>
  );
}

export default App;
