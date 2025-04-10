import React from 'react';
import { useGameStore } from '../store';
import { Calendar, Clock, Flame, Trophy } from 'lucide-react';

export const GameHistory: React.FC = () => {
  const { gameHistory, streak } = useGameStore();

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  const isToday = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const today = new Date();
      return date.toDateString() === today.toDateString();
    } catch (error) {
      return false;
    }
  };

  const renderStreakIndicator = () => {
    if (streak <= 0) return null;
    
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 rounded-lg text-orange-700 animate-pulse">
        <Flame className="text-orange-600" size={18} />
        <span className="font-bold">{streak} day streak!</span>
      </div>
    );
  };

  const renderPerformanceEmoji = (game: any) => {
    if (!game.guessed) {
      return <span className="text-red-500">❌</span>;
    }
    
    const ratio = game.attempts / game.maxAttempts;
    
    if (ratio <= 0.3) return <span title="Perfect!">🏆</span>;
    if (ratio <= 0.5) return <span title="Great!">🌟</span>;
    if (ratio <= 0.7) return <span title="Good">👍</span>;
    return <span title="Correct">✅</span>;
  };

  if (!gameHistory || gameHistory.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
        <p className="text-gray-500">No game history yet. Play your first game!</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Game History</h2>
        {renderStreakIndicator()}
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {gameHistory.map((game, index) => (
          <div 
            key={game.id || `game-${index}-${game.timestamp}`} 
            className={`p-3 rounded-lg border ${
              isToday(game.date) ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
            } ${game.guessed ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-500" />
                <span className="text-sm text-gray-600">{formatDate(game.date)}</span>
                {isToday(game.date) && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Today</span>}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-gray-500" />
                <span className="text-sm text-gray-600">{game.attempts}/{game.maxAttempts}</span>
                {renderPerformanceEmoji(game)}
              </div>
            </div>
            
            <p className="font-medium text-gray-800">{game.landmark}</p>
            <p className="text-sm text-gray-600">{game.location}</p>
          </div>
        ))}
      </div>
      
      {streak >= 3 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            <div>
              <p className="font-bold text-orange-700">You're on fire! 🔥</p>
              <p className="text-sm text-orange-600">Keep your {streak} day streak going!</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Trophy size={14} />
          <span>Total games: {gameHistory.length}</span>
        </div>
        <div>
          Win rate: {gameHistory.length > 0 ? Math.round((gameHistory.filter(g => g.guessed).length / gameHistory.length) * 100) : 0}%
        </div>
      </div>
    </div>
  );
};

export default GameHistory;