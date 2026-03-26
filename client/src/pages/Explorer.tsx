import { useState, useCallback } from 'react';
import WorldMap from '@/components/map/WorldMap';
import MapFilters from '@/components/map/MapFilters';
import CountryPopup from '@/components/map/CountryPopup';
import { Card, CardContent } from '@/components/ui/card';
import { useCountries } from '@/hooks/useCountries';
import { fetchCountry } from '@/lib/api';
import type { Country, CountryDetail } from '@/types';

export default function Explorer() {
  const [filters, setFilters] = useState({ continent: '', search: '' });
  const { countries, loading } = useCountries(filters);
  const [selectedCountry, setSelectedCountry] = useState<CountryDetail | null>(null);

  const handleFilterChange = useCallback((f: { continent: string; search: string }) => {
    setFilters(f);
  }, []);

  const handleCountryClick = async (country: Country) => {
    try {
      const detail = await fetchCountry(country.code_alpha2);
      setSelectedCountry(detail);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Explorer le monde</h1>
      <MapFilters onFilterChange={handleFilterChange} />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-[500px] flex items-center justify-center bg-muted rounded-lg">
              Chargement...
            </div>
          ) : (
            <WorldMap countries={countries} onCountryClick={handleCountryClick} />
          )}
        </div>
        <div>
          {selectedCountry ? (
            <Card>
              <CardContent className="pt-6">
                <CountryPopup country={selectedCountry} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>Cliquez sur un pays pour voir ses details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
