import React from "react";
import { Share } from "lucide-react";

interface EndGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onShare: () => void;
    streak: number;
    winRate: number;
}

export default function EndGameModal({
    isOpen,
    onClose,
    onShare,
    streak,
    winRate,
}: EndGameModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4">🎉 Parabéns!</h2>
                <p className="mb-2">Você completou o desafio!</p>
                <p className="mb-2">🔥 Streak: <strong>{streak}</strong></p>
                <p className="mb-4">📊 Winrate: <strong>{winRate.toFixed(2)}%</strong></p>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={onShare}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        <Share size={18} />
                        Compartilhar
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 transition"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
