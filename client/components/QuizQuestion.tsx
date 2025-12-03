import { useState, useEffect } from "react";
import { Question } from "@/utils/questions";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
  disabled?: boolean;
  fiftyFiftyHidden?: Set<number>;
}

export function QuizQuestion({
  question,
  questionNumber,
  onAnswer,
  disabled = false,
  fiftyFiftyHidden = new Set(),
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Reset component state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsShaking(false);
  }, [question.id]);

  const handleOptionClick = (index: number) => {
    if (selectedAnswer !== null || disabled) return;

    setSelectedAnswer(index);
    setShowFeedback(true);

    const isCorrect = index === question.correctAnswer;

    if (!isCorrect) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }

    setTimeout(() => {
      onAnswer(index, isCorrect);
    }, 1200);
  };

  return (
    <div className={cn("w-full", isShaking && "animate-shake-wrong")}>
      {/* Question Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm font-semibold text-cyan-400 neon-text">
              Question {questionNumber} of 10
            </span>
          </div>
          <div className="h-2 w-40 bg-muted rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${(questionNumber / 10) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-poppins leading-tight">
          {question.question}
        </h2>
      </div>

      {/* Options Grid - 2x2 Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = index === question.correctAnswer;
          const showCorrect = showFeedback && isCorrectAnswer;
          const showWrong = showFeedback && isSelected && !isCorrectAnswer;
          const isHiddenByFiftyFifty = fiftyFiftyHidden.has(index);

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={selectedAnswer !== null || disabled || isHiddenByFiftyFifty}
              className={cn(
                "p-5 md:p-6 text-left rounded-xl transition-all duration-300",
                "text-base md:text-lg font-medium",
                "disabled:cursor-not-allowed",
                "animate-slide-in-answer",
                "border-2",
                // Default state - neon cyan border
                !showFeedback &&
                  cn(
                    "border-cyan-500 bg-card/40 hover:bg-card/60",
                    "text-foreground",
                    "hover:shadow-lg hover:shadow-cyan-500/50",
                    "neon-border-hover"
                  ),
                // Correct answer shown - green glow
                showCorrect &&
                  cn(
                    "border-green-500 bg-green-500/15",
                    "text-green-100 shadow-lg shadow-green-500/50"
                  ),
                // Wrong answer selected - red glow
                showWrong &&
                  cn(
                    "border-red-500 bg-red-500/15",
                    "text-red-100 shadow-lg shadow-red-500/50"
                  ),
                // Other options after selection
                showFeedback &&
                  !isSelected &&
                  !isCorrectAnswer &&
                  "border-muted/40 opacity-40",
                // Selected but not answered yet
                isSelected &&
                  !showFeedback &&
                  "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/40",
                // Hidden by 50-50 lifeline
                isHiddenByFiftyFifty &&
                  "opacity-30 bg-muted/20 border-muted/40 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg",
                    "transition-all duration-300",
                    showCorrect &&
                      "border-green-500 bg-green-500/30 text-green-100",
                    showWrong &&
                      "border-red-500 bg-red-500/30 text-red-100",
                    !showFeedback &&
                      "border-cyan-500 text-cyan-400 bg-cyan-500/10"
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-grow leading-snug">{option}</span>
                {showCorrect && (
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {showWrong && (
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback Message */}
      {showFeedback && selectedAnswer !== null && (
        <div
          className={cn(
            "mt-8 p-5 rounded-xl text-sm font-semibold animate-slide-in-answer",
            "border-2",
            selectedAnswer === question.correctAnswer
              ? "bg-green-500/15 border-green-500 text-green-200 shadow-lg shadow-green-500/30"
              : "bg-red-500/15 border-red-500 text-red-200 shadow-lg shadow-red-500/30"
          )}
        >
          <div className="flex items-center gap-3">
            {selectedAnswer === question.correctAnswer ? (
              <>
                <span className="text-xl">✓</span>
                <span>Correct Answer! Outstanding!</span>
              </>
            ) : (
              <>
                <span className="text-xl">✗</span>
                <span>
                  Wrong Answer. The correct answer is{" "}
                  <span className="font-bold">
                    {String.fromCharCode(65 + question.correctAnswer)}
                  </span>
                  .
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
