import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/explorer', label: 'Explorer' },
  { to: '/quiz', label: 'Quiz' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-8 flex items-center gap-2.5">
          <span className="text-2xl">🌍</span>
          <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            WorldExplorer
          </span>
        </Link>
        <div className="flex gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200',
                location.pathname === link.to
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-muted-foreground hover:bg-blue-50/60 hover:text-blue-600',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
