import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { saveQuizAttempt } from "../db";
import { Quiz, SupportedLanguage, QuizAttempt, QuizQuestion } from "./curriculum";

export type SessionStatus = "idle" | "active" | "review" | "complete";

export interface QuizSessionState {
  status: SessionStatus;
  currentIndex: number;
  answers: (number | null)[];
  showFeedback: boolean;
  score: number;
  elapsedSeconds: number;
}

export function useQuizSession(
  quiz: Quiz | null,
  documentId: string,
  language: SupportedLanguage,
  studentId: string
) {
  const [state, setState] = useState<QuizSessionState>({
    status: "idle",
    currentIndex: 0,
    answers: [],
    showFeedback: false,
    score: 0,
    elapsedSeconds: 0,
  });

  const startTime = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  
  const startSession = useCallback(() => {
    if (!quiz) return;
    
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    startTime.current = Date.now();

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.status === "active") {
          return {
            ...prev,
            elapsedSeconds: Math.floor((Date.now() - startTime.current) / 1000),
          };
        }
        return prev;
      });
    }, 1000);

    setState({
      status: "active",
      currentIndex: 0,
      answers: new Array(quiz.questions.length).fill(null),
      showFeedback: false,
      score: 0,
      elapsedSeconds: 0,
    });
  }, [quiz]);

  
  const submitAnswer = useCallback((answerIndex: number) => {
    setState((prev) => {
      if (prev.showFeedback) return prev;
      
      const updated = [...prev.answers];
      updated[prev.currentIndex] = answerIndex;
      return { ...prev, answers: updated, showFeedback: true };
    });
  }, []);

  
  const nextQuestion = useCallback(() => {
    if (!quiz) return;
    
    setState((prev) => {
      const next = prev.currentIndex + 1;
      if (next >= quiz.questions.length) {
        
        return { ...prev, showFeedback: false, status: "review" };
      }
      return { ...prev, currentIndex: next, showFeedback: false };
    });
  }, [quiz]);

  
  const finishSession = useCallback(async () => {
    if (!quiz) return 0;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const elapsed = Math.floor((Date.now() - startTime.current) / 1000);

    const finalAnswers = state.answers.map((a) => (a === null ? -1 : a));
    const correctCount = quiz.questions.filter(
      (q, i) => finalAnswers[i] === q.correctIndex
    ).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    const attempt: QuizAttempt = {
      id: uuidv4(),
      quizId: quiz.id,
      documentId,
      language,
      studentId,
      answers: finalAnswers,
      score,
      completedAt: new Date().toISOString(),
      timeTakenSeconds: elapsed,
    };

    try {
      await saveQuizAttempt(attempt);
    } catch (error) {
      console.error("Failed to save quiz attempt:", error);
    }

    setState((prev) => ({ 
      ...prev, 
      score, 
      status: "complete", 
      elapsedSeconds: elapsed 
    }));

    return score;
  }, [quiz, state.answers, state.answers.length, documentId, language, studentId]);

  
  const resetSession = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setState({ 
      status: "idle", 
      currentIndex: 0, 
      answers: [], 
      showFeedback: false, 
      score: 0, 
      elapsedSeconds: 0 
    });
  }, []);

  
  const currentQuestion: QuizQuestion | null = quiz && quiz.questions[state.currentIndex] 
    ? quiz.questions[state.currentIndex] 
    : null;

  const isCorrect = (questionIndex: number): boolean => {
    if (!quiz) return false;
    const answer = state.answers[questionIndex];
    return answer !== null && answer !== undefined && answer === quiz.questions[questionIndex].correctIndex;
  };

  const correctCount = quiz
    ? quiz.questions.filter((_, i) => isCorrect(i)).length
    : 0;

  
  const allQuestionsAnswered = quiz && state.answers.length === quiz.questions.length 
    ? state.answers.every(a => a !== null)
    : false;

  return {
    state,
    currentQuestion,
    isCorrect,
    correctCount,
    allQuestionsAnswered,
    startSession,
    submitAnswer,
    nextQuestion,
    finishSession,
    resetSession,
  };
}