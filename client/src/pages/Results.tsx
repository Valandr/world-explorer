import { useProgress } from '@/hooks/useProgress';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function Results() {
  const { results, clearProgress } = useProgress();

  if (results.length === 0) {
    return (
      <div className="text-center space-y-4 py-12">
        <h1 className="text-2xl font-bold">Historique</h1>
        <p className="text-muted-foreground">Aucun quiz termine pour le moment.</p>
        <Link to="/quiz">
          <Button>Commencer un quiz</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Historique ({results.length} quiz)</h1>
        <Button variant="destructive" size="sm" onClick={clearProgress}>
          Effacer
        </Button>
      </div>

      <div className="grid gap-4">
        {[...results].reverse().map((r, i) => {
          const pct = Math.round((r.score / r.total) * 100);
          return (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {r.config.category} — {r.config.type === 'mcq' ? 'QCM' : 'Localisation'}
                  </CardTitle>
                  <Badge variant={pct >= 70 ? 'default' : 'secondary'}>{pct}%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  {r.score}/{r.total} • {new Date(r.date).toLocaleDateString('fr-FR')}
                  {r.config.continent && ` • ${r.config.continent}`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
