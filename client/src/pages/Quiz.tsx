import { useNavigate } from 'react-router-dom';
import QuizSetup from '@/components/quiz/QuizSetup';
import { useProgress } from '@/hooks/useProgress';
import { Badge } from '@/components/ui/badge';
import type { QuizConfig } from '@/types';

export default function Quiz() {
  const navigate = useNavigate();
  const { bestScore } = useProgress();

  const categories = ['capital', 'country', 'flag', 'population', 'language'];

  const handleStart = (config: QuizConfig) => {
    navigate('/quiz/play', { state: { config } });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Quiz Geographie</h1>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const score = bestScore(cat);
            return (
              <Badge key={cat} variant={score >= 70 ? 'default' : 'secondary'}>
                {cat}: {score}%
              </Badge>
            );
          })}
        </div>
      </div>

      <QuizSetup onStart={handleStart} />
    </div>
  );
}
