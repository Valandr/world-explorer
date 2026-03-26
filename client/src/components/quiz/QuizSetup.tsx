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
    fetchContinents().then(setContinents).catch(() => {});
  }, []);

  const handleSubmit = () => {
    onStart({ type, category, continent, count });
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Configurer le Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as 'mcq' | 'locate')}
            options={[
              { value: 'mcq', label: 'QCM (4 choix)' },
              { value: 'locate', label: 'Localiser sur la carte' },
            ]}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Categorie</label>
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Continent</label>
          <Select
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
            options={[
              { value: '', label: 'Tous' },
              ...continents.map((c) => ({ value: c.name, label: c.name })),
            ]}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre de questions: {count}</label>
          <input
            type="range"
            min="5"
            max="30"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading ? 'Chargement...' : 'Commencer'}
        </Button>
      </CardContent>
    </Card>
  );
}
