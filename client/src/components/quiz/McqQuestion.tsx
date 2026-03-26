import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { McqQuestion as McqQuestionType } from '@/types';

interface McqQuestionProps {
  question: McqQuestionType;
  onAnswer: (correct: boolean) => void;
}

export default function McqQuestion({ question, onAnswer }: McqQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);

    setTimeout(() => {
      onAnswer(index === question.correctIndex);
      setSelected(null);
      setRevealed(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {question.choices.map((choice, i) => (
          <Button
            key={i}
            variant="outline"
            className={cn(
              'h-auto py-3 text-left justify-start',
              revealed && i === question.correctIndex && 'bg-green-100 border-green-500 text-green-800',
              revealed && i === selected && i !== question.correctIndex && 'bg-red-100 border-red-500 text-red-800',
            )}
            onClick={() => handleSelect(i)}
            disabled={revealed}
          >
            {choice}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
