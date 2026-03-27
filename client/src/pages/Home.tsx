import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="space-y-12 py-8">
      <div className="text-center space-y-4">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-4xl shadow-lg shadow-blue-500/25">
          🌍
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-600 bg-clip-text text-transparent">
            WorldExplorer
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Decouvrez le monde a travers des quiz interactifs et une carte explorable. Apprenez les
          capitales, les drapeaux, les langues et bien plus !
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Card className="group hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl transition-colors group-hover:bg-blue-100">
                🗺️
              </span>
              Explorer
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

        <Card className="group hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl transition-colors group-hover:bg-blue-100">
                🧠
              </span>
              Quiz
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
