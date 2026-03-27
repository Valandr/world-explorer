import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useQuiz } from '@/hooks/useQuiz';
import { useProgress } from '@/hooks/useProgress';
import { useConfetti } from '@/hooks/useConfetti';
import { useSound } from '@/hooks/useSound';
import McqQuestion from '@/components/quiz/McqQuestion';
import LocateQuestion from '@/components/quiz/LocateQuestion';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizResults from '@/components/quiz/QuizResults';
import type { QuizConfig, McqQuestion as McqType, LocateQuestion as LocateType } from '@/types';

export default function QuizPlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = (location.state as { config: QuizConfig } | null)?.config;

  const { state, currentQuestion, currentIndex, score, total, result, startQuiz, submitAnswer, reset } = useQuiz();
  const { addResult } = useProgress();
  const { fire } = useConfetti();
  const { play } = useSound('/sounds/success.mp3');
  const resultSaved = useRef(false);

  useEffect(() => {
    if (config && state === 'idle') {
      startQuiz(config);
    }
  }, [state === 'idle' && config?.type, state === 'idle' && config?.category, state === 'idle' && config?.continent, state === 'idle' && config?.count, startQuiz]);

  useEffect(() => {
    if (result && !resultSaved.current) {
      resultSaved.current = true;
      addResult(result);
    }
    if (!result) {
      resultSaved.current = false;
    }
  }, [result, addResult]);

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      fire();
      play();
    }
    submitAnswer(correct);
  };

  if (!config) {
    return <Navigate to="/quiz" replace />;
  }

  if (state === 'loading') {
    return <div className="text-center py-12">Chargement du quiz...</div>;
  }

  if (state === 'finished' && result) {
    return (
      <QuizResults
        result={result}
        onRestart={() => {
          reset();
          startQuiz(config);
        }}
        onHome={() => navigate('/quiz')}
      />
    );
  }

  if (state === 'playing' && currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <QuizProgress current={currentIndex} total={total} score={score} />
        {currentQuestion.type === 'mcq' ? (
          <McqQuestion question={currentQuestion as McqType} onAnswer={handleAnswer} />
        ) : (
          <LocateQuestion question={currentQuestion as LocateType} onAnswer={handleAnswer} />
        )}
      </div>
    );
  }

  return null;
}
