import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreSummaryProps {
  score: number;
  totalQuestions: number;
  batchNumber: number;
  onNextBatch?: () => void;
  hasMoreQuestions: boolean;
  onRestart?: () => void;
}

export function ScoreSummary({
  score,
  totalQuestions,
  batchNumber,
  onNextBatch,
  hasMoreQuestions,
  onRestart,
}: ScoreSummaryProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const percentage = Math.round((score / totalQuestions) * 100);

  const getPerformanceMessage = (percent: number) => {
    if (percent === 100) return "Perfect Score! Outstanding! �";
    if (percent >= 80) return "Excellent Performance! 🌟";
    if (percent >= 60) return "Good Job! Well Done! 👏";
    if (percent >= 40) return "Not Bad! Keep Practicing! 💪";
    return "Better Luck Next Time! 🚀";
  };

  const getPerformanceColor = (percent: number) => {
    if (percent === 100) return "text-yellow-400";
    if (percent >= 80) return "text-green-400";
    if (percent >= 60) return "text-blue-400";
    if (percent >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-cyan-500 rounded-2xl p-8 md:p-10 max-w-md w-full animate-slide-in-answer shadow-2xl shadow-cyan-500/30 neon-border">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-10px",
                  animation: `fall ${2 + Math.random() * 1}s linear forwards`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
          </div>
        )}

        <style>{`
          @keyframes fall {
            to {
              transform: translateY(400px) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>

        <div className="text-center relative z-10">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-2 text-cyan-400 neon-text">
              {score}/{totalQuestions}
            </h1>
            <p className="text-cyan-400/70">Questions Correct</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg
                  className="w-full h-full -rotate-90"
                  viewBox="0 0 120 120"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgba(0, 200, 255, 0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgb(0, 200, 255)"
                    strokeWidth="8"
                    strokeDasharray={`${(percentage / 100) * 2 * Math.PI * 54} ${
                      2 * Math.PI * 54
                    }`}
                    className="transition-all duration-1000 drop-shadow-lg"
                    style={{ filter: "drop-shadow(0 0 10px rgba(0, 200, 255, 0.8))" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn(
                    "text-3xl font-bold font-poppins",
                    getPerformanceColor(percentage)
                  )}>
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
            <p className={cn(
              "text-xl font-semibold font-poppins",
              getPerformanceColor(percentage)
            )}>
              {getPerformanceMessage(percentage)}
            </p>
          </div>

          <div className="bg-cyan-500/10 rounded-lg p-4 mb-8 text-sm border border-cyan-500/30">
            <p className="text-cyan-400">
              Level <span className="font-bold text-cyan-300">{batchNumber}</span> Complete
            </p>
            <p className="text-xs text-cyan-400/70 mt-1">
              Keep up the momentum! 🚀
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {hasMoreQuestions && onNextBatch && (
              <button
                onClick={onNextBatch}
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold transition-all duration-300",
                  "bg-gradient-to-r from-cyan-500 to-blue-500 text-primary-foreground",
                  "hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105",
                  "border-2 border-cyan-500",
                  "active:scale-95"
                )}
              >
                Next 10 Questions →
              </button>
            )}
            {!hasMoreQuestions && (
              <div className="text-center py-3 px-4 bg-cyan-500/10 rounded-xl border-2 border-cyan-500">
                <p className="font-semibold text-cyan-400">Quiz Completed!</p>
                <p className="text-sm text-cyan-400/70 mt-1">
                  All 50 questions answered! You're a legend! 🏆
                </p>
              </div>
            )}
            {onRestart && (
              <button
                onClick={onRestart}
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold transition-all duration-300",
                  "bg-secondary/80 text-secondary-foreground",
                  "hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105",
                  "border-2 border-secondary",
                  "active:scale-95"
                )}
              >
                Restart Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
