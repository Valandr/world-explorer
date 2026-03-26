import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useConfetti } from '@/hooks/useConfetti';
import { useSound } from '@/hooks/useSound';
import type { QuizResult } from '@/types';

interface QuizResultsProps {
  result: QuizResult;
  onRestart: () => void;
  onHome: () => void;
}

export default function QuizResults({ result, onRestart, onHome }: QuizResultsProps) {
  const { fireMultiple } = useConfetti();
  const { play } = useSound('/sounds/success.mp3');
  const percentage = Math.round((result.score / result.total) * 100);
  const isGood = percentage >= 70;

  useEffect(() => {
    if (isGood) {
      fireMultiple();
      play();
    }
  }, [isGood, fireMultiple, play]);

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isGood ? 'Bravo !' : 'Pas mal !'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="text-6xl font-bold text-primary">{percentage}%</div>
        <p className="text-lg text-muted-foreground">
          {result.score} / {result.total} bonnes reponses
        </p>
        <div className="text-sm text-muted-foreground">
          <p>Type: {result.config.type === 'mcq' ? 'QCM' : 'Localisation'}</p>
          <p>Categorie: {result.config.category}</p>
          {result.config.continent && <p>Continent: {result.config.continent}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button onClick={onRestart} className="flex-1">
          Rejouer
        </Button>
        <Button onClick={onHome} variant="outline" className="flex-1">
          Accueil
        </Button>
      </CardFooter>
    </Card>
  );
}
