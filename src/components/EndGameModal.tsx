import React from "react";
import { Share } from "lucide-react";

interface EndGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onShare: () => void;
    streak: number;
    winRate: number;
    guessed: boolean;
    attempts: number;
}

export default function EndGameModal({
    isOpen,
    onClose,
    onShare,
    streak,
    winRate,
    guessed,
    attempts,
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
                <h2 className="text-2xl font-bold mb-4">
                    {guessed ? "🎉 Well done!" : "💡 Keep going!"}
                </h2>

                {guessed ? (
                    <>
                        <p className="mb-2">
                            You guessed today’s landmark in <strong>{attempts}</strong>{" "}
                            attempt{attempts > 1 ? "s" : ""}!
                        </p>
                    </>
                ) : (
                    <>
                        <p className="mb-2">You didn’t guess today’s landmark.</p>
                        <p className="mb-2">Don’t give up — tomorrow is a new challenge!</p>
                    </>
                )}

                <p className="mb-2">
                    🔥 Streak: <strong>{streak}</strong>
                </p>
                <p className="mb-4">
                    📊 Win rate: <strong>{winRate.toFixed(2)}%</strong>
                </p>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={onShare}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        <Share size={18} />
                        Share
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
