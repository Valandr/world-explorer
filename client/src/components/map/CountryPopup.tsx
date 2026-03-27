import { Badge } from '@/components/ui/badge';
import type { CountryDetail } from '@/types';

interface CountryPopupProps {
  country: CountryDetail;
}

export default function CountryPopup({ country }: CountryPopupProps) {
  const formatPopulation = (pop: number | null) => {
    if (!pop) return 'N/A';
    return new Intl.NumberFormat('fr-FR').format(pop);
  };

  return (
    <div className="space-y-3 p-2">
      <div className="flex items-center gap-3">
        {country.flag_url ? (
          <img src={country.flag_url} alt={`Drapeau ${country.name}`} className="h-10 w-14 rounded border border-border object-cover" />
        ) : (
          <span className="text-4xl">{country.flag_emoji}</span>
        )}
        <div>
          <h3 className="text-lg font-bold">{country.name}</h3>
          {country.official_name && (
            <p className="text-sm text-muted-foreground">{country.official_name}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Capitale:</span>{' '}
          <span className="font-medium">{country.capital ?? 'N/A'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Population:</span>{' '}
          <span className="font-medium">{formatPopulation(country.population)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Continent:</span>{' '}
          <span className="font-medium">{country.continent ?? 'N/A'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Region:</span>{' '}
          <span className="font-medium">{country.region ?? 'N/A'}</span>
        </div>
      </div>

      {country.languages.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {country.languages.map((lang) => (
            <Badge key={lang.id} variant="secondary">
              {lang.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
