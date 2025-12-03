const USED_QUESTIONS_KEY = "kbc_quiz_used_questions";
const SCORE_KEY = "kbc_quiz_score";
const CURRENT_BATCH_KEY = "kbc_quiz_current_batch";
const CURRENT_QUESTION_INDEX_KEY = "kbc_quiz_current_question_index";
const BATCH_QUESTIONS_KEY = "kbc_quiz_batch_questions";
const IS_BATCH_COMPLETE_KEY = "kbc_quiz_is_batch_complete";
const USED_LIFELINES_KEY = "kbc_quiz_used_lifelines";

export interface QuizSessionState {
  usedQuestionIds: Set<number>;
  score: number;
  currentBatch: number;
  answeredCount: number;
  currentQuestionIndex: number;
  isBatchComplete: boolean;
  batchQuestionIds: number[];
  usedLifelines: Set<string>;
}

export function initializeQuizSession(): QuizSessionState {
  const stored = localStorage.getItem(USED_QUESTIONS_KEY);
  const storedScore = localStorage.getItem(SCORE_KEY);
  const storedBatch = localStorage.getItem(CURRENT_BATCH_KEY);
  const storedQuestionIndex = localStorage.getItem(CURRENT_QUESTION_INDEX_KEY);
  const storedBatchQuestions = localStorage.getItem(BATCH_QUESTIONS_KEY);
  const storedIsBatchComplete = localStorage.getItem(IS_BATCH_COMPLETE_KEY);
  const storedUsedLifelines = localStorage.getItem(USED_LIFELINES_KEY);

  return {
    usedQuestionIds: stored ? new Set(JSON.parse(stored)) : new Set(),
    score: storedScore ? parseInt(storedScore) : 0,
    currentBatch: storedBatch ? parseInt(storedBatch) : 1,
    answeredCount: stored ? JSON.parse(stored).length : 0,
    currentQuestionIndex: storedQuestionIndex ? parseInt(storedQuestionIndex) : 0,
    isBatchComplete: storedIsBatchComplete ? JSON.parse(storedIsBatchComplete) : false,
    batchQuestionIds: storedBatchQuestions ? JSON.parse(storedBatchQuestions) : [],
    usedLifelines: storedUsedLifelines ? new Set(JSON.parse(storedUsedLifelines)) : new Set(),
  };
}

export function saveUsedQuestionIds(ids: Set<number>): void {
  localStorage.setItem(USED_QUESTIONS_KEY, JSON.stringify(Array.from(ids)));
}

export function saveScore(score: number): void {
  localStorage.setItem(SCORE_KEY, score.toString());
}

export function saveCurrentBatch(batch: number): void {
  localStorage.setItem(CURRENT_BATCH_KEY, batch.toString());
}

export function saveCurrentQuestionIndex(index: number): void {
  localStorage.setItem(CURRENT_QUESTION_INDEX_KEY, index.toString());
}

export function saveBatchQuestionIds(ids: number[]): void {
  localStorage.setItem(BATCH_QUESTIONS_KEY, JSON.stringify(ids));
}

export function saveBatchComplete(isComplete: boolean): void {
  localStorage.setItem(IS_BATCH_COMPLETE_KEY, JSON.stringify(isComplete));
}

export function saveUsedLifelines(lifelines: Set<string>): void {
  localStorage.setItem(USED_LIFELINES_KEY, JSON.stringify(Array.from(lifelines)));
}

export function resetUsedLifelines(): void {
  localStorage.removeItem(USED_LIFELINES_KEY);
}

export function resetQuizSession(): void {
  localStorage.removeItem(USED_QUESTIONS_KEY);
  localStorage.removeItem(SCORE_KEY);
  localStorage.removeItem(CURRENT_BATCH_KEY);
  localStorage.removeItem(CURRENT_QUESTION_INDEX_KEY);
  localStorage.removeItem(BATCH_QUESTIONS_KEY);
  localStorage.removeItem(IS_BATCH_COMPLETE_KEY);
  localStorage.removeItem(USED_LIFELINES_KEY);
}

export function markQuestionsAsUsed(ids: number[]): void {
  const stored = localStorage.getItem(USED_QUESTIONS_KEY);
  const current = stored ? new Set(JSON.parse(stored)) : new Set<number>();

  ids.forEach((id) => current.add(id));
  localStorage.setItem(USED_QUESTIONS_KEY, JSON.stringify(Array.from(current)));
}

export function hasQuestionsRemaining(usedIds: Set<number>): boolean {
  return usedIds.size < 50;
}
