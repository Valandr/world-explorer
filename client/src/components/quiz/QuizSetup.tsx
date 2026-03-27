import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchContinents } from '@/lib/api';
import type { Continent, QuizConfig } from '@/types';

interface QuizSetupProps {
  onStart: (config: QuizConfig) => void;
  loading?: boolean;
}

export default function QuizSetup({ onStart, loading }: QuizSetupProps) {
  const [type, setType] = useState<'mcq' | 'locate'>('mcq');
  const [category, setCategory] = useState('capital');
  const [continent, setContinent] = useState('');
  const [count, setCount] = useState(10);
  const [continents, setContinents] = useState<Continent[]>([]);

  useEffect(() => {
    fetchContinents()
      .then(setContinents)
      .catch(() => {});
  }, []);

  const handleSubmit = () => {
    onStart({ type, category, continent, count });
  };

  return (
    <Card className="mx-auto max-w-md animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold tracking-tight">Configurer le Quiz</CardTitle>
        <p className="text-sm text-muted-foreground">Personnalisez votre session d'apprentissage</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Type
          </label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as 'mcq' | 'locate')}
            options={[
              { value: 'mcq', label: 'QCM (4 choix)' },
              { value: 'locate', label: 'Localiser sur la carte' },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categorie
          </label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'capital', label: 'Capitales' },
              { value: 'country', label: 'Pays' },
              { value: 'flag', label: 'Drapeaux' },
              { value: 'population', label: 'Population' },
              { value: 'language', label: 'Langues' },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Continent
          </label>
          <Select
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
            options={[
              { value: '', label: 'Tous' },
              ...continents.map((c) => ({ value: c.name, label: c.name })),
            ]}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Questions
            </label>
            <span className="text-2xl font-bold tabular-nums text-blue-600">{count}</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5</span>
            <span>30</span>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full" size="lg" disabled={loading}>
          {loading ? 'Chargement...' : 'Commencer'}
        </Button>
      </CardContent>
    </Card>
  );
}
