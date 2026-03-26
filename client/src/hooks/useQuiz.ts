import { useState, useCallback } from 'react';
import type { QuizQuestion, QuizConfig, QuizResult } from '@/types';
import { fetchQuiz } from '@/lib/api';

type QuizState = 'idle' | 'loading' | 'playing' | 'finished';

export function useQuiz() {
  const [state, setState] = useState<QuizState>('idle');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; correct: boolean }[]>([]);
  const [config, setConfig] = useState<QuizConfig | null>(null);

  const startQuiz = useCallback(async (quizConfig: QuizConfig) => {
    setState('loading');
    setConfig(quizConfig);
    try {
      const data = await fetchQuiz(quizConfig);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswers([]);
      setState('playing');
    } catch {
      setState('idle');
    }
  }, []);

  const submitAnswer = useCallback(
    (correct: boolean) => {
      const question = questions[currentIndex];
      if (!question) return;

      const newAnswers = [...answers, { questionId: question.id, correct }];
      setAnswers(newAnswers);

      if (currentIndex + 1 >= questions.length) {
        setState('finished');
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [questions, currentIndex, answers],
  );

  const reset = useCallback(() => {
    setState('idle');
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setConfig(null);
  }, []);

  const score = answers.filter((a) => a.correct).length;

  const result: QuizResult | null =
    state === 'finished' && config
      ? {
          date: new Date().toISOString(),
          config,
          score,
          total: questions.length,
          answers,
        }
      : null;

  return {
    state,
    questions,
    currentQuestion: questions[currentIndex] ?? null,
    currentIndex,
    score,
    total: questions.length,
    answers,
    result,
    startQuiz,
    submitAnswer,
    reset,
  };
}
