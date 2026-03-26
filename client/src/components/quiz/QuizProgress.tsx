import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  current: number;
  total: number;
  score: number;
}

export default function QuizProgress({ current, total, score }: QuizProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          Question {current + 1} / {total}
        </span>
        <span>
          Score: {score} / {current}
        </span>
      </div>
      <Progress value={current + 1} max={total} />
    </div>
  );
}
