import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuizQuestion } from "@/components/QuizQuestion";
import { ScoreSummary } from "@/components/ScoreSummary";
import { Lifelines } from "@/components/Lifelines";
import { getSequentialQuestions, Question, questionsBank } from "@/utils/questions";
import {
  initializeQuizSession,
  saveUsedQuestionIds,
  saveScore,
  saveCurrentBatch,
  markQuestionsAsUsed,
  hasQuestionsRemaining,
  resetQuizSession,
  saveCurrentQuestionIndex,
  saveBatchQuestionIds,
  saveBatchComplete,
  saveUsedLifelines,
  resetUsedLifelines,
} from "@/utils/quizState";
import { cn } from "@/lib/utils";

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [batchNumber, setBatchNumber] = useState(1);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(
    new Set()
  );
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [batchQuestionIds, setBatchQuestionIds] = useState<number[]>([]);
  const [isBatchComplete, setIsBatchComplete] = useState(false);
  const [usedLifelines, setUsedLifelines] = useState<Set<string>>(new Set());
  const [fiftyFiftyHidden, setFiftyFiftyHidden] = useState<Set<number>>(new Set());

  // Initialize quiz on mount
  useEffect(() => {
    const session = initializeQuizSession();
    setUsedQuestionIds(session.usedQuestionIds);
    setScore(session.score);
    setBatchNumber(session.currentBatch);
    setBatchQuestionIds(session.batchQuestionIds);
    setIsBatchComplete(session.isBatchComplete);
    setUsedLifelines(session.usedLifelines);

    // Resume incomplete batch or load new one
    if (session.batchQuestionIds.length > 0 && !session.isBatchComplete) {
      // Resume incomplete batch
      loadBatchFromQuestionIds(session.batchQuestionIds, session.currentQuestionIndex, session.usedQuestionIds);
    } else {
      // Load fresh batch
      loadNextBatch(session.usedQuestionIds);
    }
  }, []);

  const loadBatchFromQuestionIds = (questionIds: number[], startIndex: number, usedIds: Set<number>) => {
    setIsLoading(true);
    setCurrentQuestionIndex(startIndex);
    setQuestionsAnswered(startIndex);
    // Don't reset lifelines when resuming - they persist within the batch

    const batchQuestions = questionsBank.filter((q: Question) => questionIds.includes(q.id));

    if (batchQuestions.length === 0) {
      loadNextBatch(usedIds);
      return;
    }

    setCurrentQuestions(batchQuestions);
    setIsBatchComplete(false);
    setIsLoading(false);
  };

  const loadNextBatch = (usedIds: Set<number>) => {
    setIsLoading(true);
    setCurrentQuestionIndex(0);
    setQuestionsAnswered(0);
    setIsBatchComplete(false);
    // Reset lifelines for new level/batch
    setUsedLifelines(new Set());
    setFiftyFiftyHidden(new Set());
    resetUsedLifelines();

    const newQuestions = getSequentialQuestions(10, usedIds);

    if (newQuestions.length === 0) {
      setShowSummary(true);
      setIsLoading(false);
      return;
    }

    const questionIds = newQuestions.map((q) => q.id);
    setCurrentQuestions(newQuestions);
    setBatchQuestionIds(questionIds);
    saveBatchQuestionIds(questionIds);
    markQuestionsAsUsed(questionIds);

    setUsedQuestionIds((prev) => {
      const updated = new Set(prev);
      newQuestions.forEach((q) => updated.add(q.id));
      return updated;
    });

    setIsLoading(false);
  };

  const handleAnswer = (selectedIndex: number, isCorrect: boolean) => {
    const newQuestionsAnswered = questionsAnswered + 1;
    setQuestionsAnswered(newQuestionsAnswered);
    // Reset 50-50 for next question
    setFiftyFiftyHidden(new Set());

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      saveScore(newScore);
    }

    if (newQuestionsAnswered < currentQuestions.length) {
      const nextIndex = currentQuestionIndex + 1;
      setTimeout(() => {
        setCurrentQuestionIndex(nextIndex);
        saveCurrentQuestionIndex(nextIndex);
      }, 300);
    } else {
      setTimeout(() => {
        setIsBatchComplete(true);
        saveBatchComplete(true);
        setShowSummary(true);
      }, 300);
    }
  };

  const handleNextBatch = () => {
    setShowSummary(false);
    const nextBatchNumber = batchNumber + 1;
    setBatchNumber(nextBatchNumber);
    saveCurrentBatch(nextBatchNumber);
    saveCurrentQuestionIndex(0);
    setIsBatchComplete(false);
    // Reset lifelines for new level/batch
    setUsedLifelines(new Set());
    setFiftyFiftyHidden(new Set());
    resetUsedLifelines();
    loadNextBatch(usedQuestionIds);
  };

  const handleRestart = () => {
    resetQuizSession();
    setScore(0);
    setBatchNumber(1);
    setUsedQuestionIds(new Set());
    setCurrentQuestionIndex(0);
    setQuestionsAnswered(0);
    setShowSummary(false);
    setBatchQuestionIds([]);
    setIsBatchComplete(false);
    setUsedLifelines(new Set());
    setFiftyFiftyHidden(new Set());
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-foreground font-semibold">Loading Questions...</p>
        </div>
      </div>
    );
  }

  if (currentQuestions.length === 0 && !showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold font-poppins text-foreground mb-4">
            Quiz Completed!
          </h1>
          <p className="text-muted-foreground mb-8">
            You've answered all available questions. Great job!
          </p>
          <div className="flex gap-3 flex-col">
            <button
              onClick={handleRestart}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-all duration-300",
                "bg-primary text-primary-foreground",
                "hover:shadow-lg hover:shadow-primary/50",
                "border-2 border-primary"
              )}
            >
              Restart Quiz
            </button>
            <button
              onClick={() => navigate("/")}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-all duration-300",
                "bg-secondary text-secondary-foreground",
                "hover:shadow-lg hover:shadow-secondary/50",
                "border-2 border-secondary"
              )}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleLifelineUsed = (type: "fifty-fifty" | "phone-friend" | "audience-poll") => {
    const newUsedLifelines = new Set([...usedLifelines, type]);
    setUsedLifelines(newUsedLifelines);
    saveUsedLifelines(newUsedLifelines);

    if (type === "fifty-fifty") {
      // 50-50: Remove 2 wrong options
      const currentQ = currentQuestions[currentQuestionIndex];
      if (currentQ) {
        const wrongOptions = [];
        for (let i = 0; i < 4; i++) {
          if (i !== currentQ.correctAnswer) {
            wrongOptions.push(i);
          }
        }
        
        // Randomly select 2 wrong options to hide
        const shuffled = wrongOptions.sort(() => Math.random() - 0.5);
        const optionsToHide = shuffled.slice(0, 2);
        setFiftyFiftyHidden(new Set(optionsToHide));
      }
    } else if (type === "phone-friend") {
      // Call a friend
      console.log("Phone friend lifeline used!");
    } else if (type === "audience-poll") {
      // Audience poll
      console.log("Audience poll lifeline used!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className={cn(
                  "text-cyan-400 hover:text-cyan-300 transition-colors",
                  "font-semibold text-lg neon-text"
                )}
              >
                ← KBC Quiz
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs md:text-sm text-cyan-400/70">
                  Level {batchNumber}
                </p>
                <p className="text-lg md:text-xl font-bold text-cyan-400 neon-text">
                  {score} pts
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/50"
              style={{
                width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content with Lifelines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex gap-8">
          {/* Lifelines Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex flex-col items-center pt-4">
            <p className="text-xs text-cyan-400/60 mb-4 font-semibold text-center">LIFELINES</p>
            <Lifelines onLifelineUsed={handleLifelineUsed} usedLifelines={usedLifelines} />
          </div>

          {/* Main Quiz Content */}
          <div className="flex-1">
            <div className="bg-card/40 backdrop-blur-sm neon-border rounded-2xl p-8 md:p-10 shadow-2xl shadow-cyan-500/20">
              {currentQuestion && (
                <QuizQuestion
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  onAnswer={handleAnswer}
                  fiftyFiftyHidden={fiftyFiftyHidden}
                />
              )}
            </div>
          </div>

          {/* Mobile Lifelines - Show below on mobile */}
          <div className="lg:hidden w-full mt-8">
            <div className="flex justify-center gap-4">
              <p className="hidden">LIFELINES</p>
              {/* Compact mobile lifelines can be added here if needed */}
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary Modal */}
      {showSummary && (
        <ScoreSummary
          score={score % 10}
          totalQuestions={10}
          batchNumber={batchNumber}
          onNextBatch={
            hasQuestionsRemaining(usedQuestionIds) ? handleNextBatch : undefined
          }
          hasMoreQuestions={hasQuestionsRemaining(usedQuestionIds)}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
