import React, { useState } from 'react';
import { useGameStore } from '../store';
import { HelpCircle, Share, Copy, Twitter } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const GameStatus: React.FC = () => {
  const { attempts, maxAttempts, guessed, currentLandmark, showHint, toggleHint, guesses } = useGameStore();
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Função para verificar proximidade da resposta
  const isCloseMatch = (guess: string, actual: string) => {
    return guess.toLowerCase().trim() === actual.toLowerCase().trim();
  };

  // Gera o texto de compartilhamento com formatação aprimorada
  const generateShareText = () => {
    const emojis = guesses.map(guess => isCloseMatch(guess, currentLandmark.name) ? '✅' : '❌');
    
    let shareText = `🌍 LandmarkLens 🌍\n`;
    shareText += `I guessed: ${currentLandmark.name} in ${currentLandmark.location}!\n`;
    shareText += `Attempts: ${attempts}/${maxAttempts}\n`;
    shareText += `${emojis.join('')}\n`;
    shareText += `Play it yourself at: landmarklens.vercel.app`;
    
    return shareText;
  };

  // Copia resultado para a área de transferência
  const handleCopy = () => {
    const shareText = generateShareText();
    
    navigator.clipboard.writeText(shareText)
      .then(() => {
        toast.success('Result copied to clipboard!', {
          duration: 3000,
          position: 'bottom-center',
          style: {
            background: '#4ade80',
            color: '#fff',
            padding: '16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          icon: '📋',
        });
      })
      .catch((error) => {
        console.error('Error copying text:', error);
        toast.error('Could not copy the result', {
          duration: 3000,
          position: 'bottom-center',
          style: {
            background: '#f87171',
            color: '#fff',
            padding: '16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '500',
          },
        });
      });
    
    setShowShareOptions(true);
  };

  // Compartilhar no X (formerly Twitter)
  const handleXShare = () => {
    const shareText = encodeURIComponent(generateShareText());
    window.open(`https://x.com/intent/tweet?text=${shareText}`, '_blank', 'noopener,noreferrer');
    setShowShareOptions(false);
  };

  // Compartilhar em dispositivos móveis usando a Web Share API
  const handleNativeShare = () => {
    // Verificar se é realmente um dispositivo móvel
    const isMobileByUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isMobileByScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const isTrulyMobile = isMobileByUserAgent && (isMobileByScreen || isTouchDevice);
    
    if (navigator.share && isTrulyMobile) {
      navigator.share({
        title: 'My result in LandmarkLens',
        text: generateShareText(),
        url: 'https://landmarklens.vercel.app',
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        setShowShareOptions(true);
      });
    } else {
      setShowShareOptions(prev => !prev);
    }
  };

  if (guessed) {
    return (
      <div className="text-center p-6 bg-green-100 rounded-xl border border-green-200 shadow-sm animate-fade-in">
        <p className="text-2xl font-bold text-green-700 mb-2">🎉 Parabéns! 🎉</p>
        <p className="text-green-600 mb-4">
          You discovered {currentLandmark.name} in {currentLandmark.location}!
        </p>
        
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition-colors w-full max-w-xs"
          >
            <Share size={18} />
            Share Result
          </button>
          
          {showShareOptions && (
            <div className="flex flex-wrap justify-center gap-2 mt-2 p-2 bg-white rounded-lg shadow animate-fade-in w-full max-w-xs">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition"
              >
                <Copy size={16} />
                <span>Copy</span>
              </button>
              <button
                onClick={handleXShare}
                className="flex items-center gap-1 px-3 py-2 bg-black text-white hover:bg-gray-800 rounded-md transition"
              >
                <Twitter size={16} />
                <span>X</span>
              </button>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-left w-full max-w-xs">
            <p className="text-sm text-gray-500 font-medium mb-1">Preview:</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">{generateShareText()}</p>
          </div>
        </div>
      </div>
    );
  }

  if (attempts >= maxAttempts) {
    return (
      <div className="text-center p-6 bg-red-100 rounded-xl border border-red-200 shadow-sm animate-fade-in">
        <p className="text-2xl font-bold text-red-700 mb-2">Game Over</p>
        <p className="text-red-600 mb-4">
          The tourist attraction was {currentLandmark.name} in {currentLandmark.location}
        </p>
        <button
          onClick={handleNativeShare}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition-colors mx-auto"
        >
          <Share size={16} />
          Share Result
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-md mx-auto">
      <p className="text-lg font-semibold text-gray-700 mb-2">
        {maxAttempts - attempts} Attempts Remaining
      </p>
      <button
        onClick={toggleHint}
        className="group flex items-center gap-2 mx-auto px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
      >
        <HelpCircle size={16} className="group-hover:rotate-12 transition-transform" />
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </button>
      {showHint && (
        <p className="mt-3 text-gray-600 italic animate-fade-in text-sm">
          Hint: {currentLandmark.hint}
        </p>
      )}
    </div>
  );
};

export default GameStatus;
