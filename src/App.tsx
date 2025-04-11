import { useEffect, useState } from 'react';
import { Compass, RefreshCw } from 'lucide-react';
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
      <div className="flex space-x-2">
        {Array.from({ length: maxAttempts }).map((_, idx) => (
          <img
            key={idx}
            src={mountain}
            alt="Mountain life"
            className={`w-6 h-6 transition-opacity duration-300 ${idx < remaining ? 'opacity-100' : 'opacity-30'
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#F0F9FF] via-white to-[#FFEDD4]">
      <Toaster />
      <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-blue-600 animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              LandmarkLens
            </h1>
          </div>
          <div className="flex items-center gap-4">
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
              >
                <RefreshCw size={16} />
                New Game
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10 rounded">
        <div className="bg-[#F8FAFC] shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: '#314158' }}>
              Can you recognise this place?
            </h2>
            {renderMountains()}
          </div>

          <p className="text-sm font-medium mb-2" style={{ color: '#314158' }}>
            {isDailyMode ? '🌐 Daily Challenge!' : '🎯 Explore in Free Mode!'}
          </p>

          <div className="relative aspect-video w-full overflow-hidden shadow-md bg-white mb-6">
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

          <div className="flex flex-col items-center space-y-6">
            <GuessInput />
            <GuessHistory />
          </div>
        </div>
        <div className="w-full flex flex-col space-y-6 mt-8">
          <GameHistory />
        </div>
      </main>

      <footer className="w-full py-4 bg-gradient-to-r from-[#F0F9FF] via-white to-[#FFEDD4] mt-10">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-[#314158]">
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
