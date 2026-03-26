import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          🌍 WorldExplorer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Decouvrez le monde a travers des quiz interactifs et une carte explorable.
          Apprenez les capitales, les drapeaux, les langues et bien plus !
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🗺️ Explorer
            </CardTitle>
            <CardDescription>
              Parcourez la carte interactive et decouvrez les pays du monde
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/explorer">
              <Button className="w-full">Ouvrir la carte</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧠 Quiz
            </CardTitle>
            <CardDescription>
              Testez vos connaissances en geographie avec des quiz personnalises
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/quiz">
              <Button className="w-full">Commencer un quiz</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
