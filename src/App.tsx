import { useEffect, useState } from 'react';
import { Compass, RefreshCw, Menu, X } from 'lucide-react';
import { useGameStore } from './store';
import { GuessInput } from './components/GuessInput';
import { GuessHistory } from './components/GuessHistory';
import { GameHistory } from './components/GameHistory';
import { Toaster } from 'react-hot-toast';
import EndGameModal from './components/EndGameModal';
import mountain from './assets/Mountain.png';

function App() {
  const { currentLandmark, blurLevel } = useGameStore();
  const isDailyMode = useGameStore((s) => s.isDailyMode);
  const guessed = useGameStore((state) => state.guessed);
  const attempts = useGameStore((state) => state.attempts);
  const maxAttempts = useGameStore((state) => state.maxAttempts);
  const dailyCompleted = useGameStore((s) => s.dailyCompleted);
  const streak = useGameStore((s) => s.streak);
  const gameHistory = useGameStore((s) => s.gameHistory);
  const gameOver = guessed || attempts >= maxAttempts;

  const total = gameHistory.length;
  const wins = gameHistory.filter((g) => g.guessed).length;
  const winRate = total ? Math.round((wins / total) * 100) : 0;
  const userWon = guessed;

  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (gameOver) {
      setShowEndGameModal(true);
    }
  }, [gameOver]);

  useEffect(() => {
    useGameStore.getState().resetGame(true);
  }, []);

  const renderMountains = () => {
    const remaining = maxAttempts - attempts;
    return (
      <div className="flex space-x-1 sm:space-x-2">
        {Array.from({ length: maxAttempts }).map((_, idx) => (
          <img
            key={idx}
            src={mountain}
            alt="Mountain life"
            className={`w-4 h-4 sm:w-6 sm:h-6 transition-opacity duration-300 ${
              idx < remaining ? 'opacity-100' : 'opacity-30'
            }`}
          />
        ))}
      </div>
    );
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#F0F9FF] via-white to-[#FFEDD4]">
      <Toaster position="top-center" />
      <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Compass className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-pulse" />
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              LandmarkLens
            </h1>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            <button disabled className="text-gray-400 cursor-not-allowed hover:text-gray-400 transition">
              FAQ
            </button>
            <button disabled className="text-gray-400 cursor-not-allowed hover:text-gray-400 transition">
              Settings
            </button>
            <button disabled className="text-gray-400 cursor-not-allowed hover:text-gray-400 transition">
              Statistics
            </button>

            {gameOver && (
              <button
                onClick={() => {
                  useGameStore.getState().resetGame(false);
                  setShowEndGameModal(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 rounded text-blue-700 hover:bg-blue-200 transition"
              >
                <RefreshCw size={16} />
                <span>New Game</span>
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {gameOver && (
              <button
                onClick={() => {
                  useGameStore.getState().resetGame(false);
                  setShowEndGameModal(false);
                }}
                className="mr-2 flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 rounded text-blue-700 hover:bg-blue-200 transition"
              >
                <RefreshCw size={14} />
                <span>New</span>
              </button>
            )}
            <button 
              onClick={toggleMenu}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-md animate-fadeIn">
            <div className="flex flex-col space-y-2 py-2 px-4">
              <button disabled className="text-gray-400 cursor-not-allowed hover:text-gray-400 transition text-left py-2 border-b border-gray-100">
                FAQ
              </button>
              <button disabled className="text-gray-400 cursor-not-allowed hover:text-gray-400 transition text-left py-2 border-b border-gray-100">
                Settings
              </button>
              <button disabled className="text-gray-400 cursor-not-allowed hover:text-gray-400 transition text-left py-2">
                Statistics
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-10">
        <div className="bg-[#F8FAFC] shadow-lg sm:shadow-xl p-4 sm:p-6 rounded">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#314158' }}>
              Can you recognise this place?
            </h2>
            <div className="flex justify-start sm:justify-end">
              {renderMountains()}
            </div>
          </div>

          <p className="text-xs sm:text-sm font-medium mb-2" style={{ color: '#314158' }}>
            {isDailyMode ? '🌐 Daily Challenge!' : '🎯 Explore in Free Mode!'}
          </p>

          <div className="relative aspect-video w-full overflow-hidden shadow-md bg-white mb-4 sm:mb-6 rounded">
            <div className="absolute inset-0 bg-black/10"></div>
            <div
              className="w-full h-full transition-all duration-700 ease-in-out"
              style={{
                backgroundImage: `url(${currentLandmark.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: `blur(${blurLevel}px)`,
              }}
              aria-label="Mystery landmark"
            />
          </div>

          <div className="flex flex-col items-center space-y-4 sm:space-y-6">
            <GuessInput />
            <GuessHistory />
          </div>
        </div>
        
        <div className="w-full flex flex-col space-y-4 sm:space-y-6">
          <GameHistory />
        </div>
      </main>

      <footer className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#F0F9FF] via-white to-[#FFEDD4] mt-6 sm:mt-10">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs sm:text-sm text-[#314158]">
          Made with ❤️ by the Landmark Team · © {new Date().getFullYear()}
        </div>
      </footer>

      {gameOver && showEndGameModal && (
        <EndGameModal
          isOpen={true}
          onClose={() => setShowEndGameModal(false)}
          streak={streak}
          winRate={winRate}
          guessed={userWon}
          attempts={attempts}
          onShare={() => {
            const shareText = userWon
              ? `🔥 I nailed today's LandmarkLens challenge in ${attempts} attempt${attempts > 1 ? 's' : ''}! I'm on a ${streak}-day streak with a ${winRate}% win rate!\nPlay at https://landmarklens.vercel.app`
              : `😓 I couldn't guess today's Landmark in LandmarkLens. Better luck tomorrow!\nWin rate: ${winRate}%\nPlay at https://landmarklens.vercel.app`;
            navigator.clipboard.writeText(shareText);
            alert('Now you are ready to paste your result!');
          }}
        />
      )}
    </div>
  );
}

export default App;