import { useState, useEffect } from 'react';
import type { Country } from '@/types';
import { fetchCountries } from '@/lib/api';

export function useCountries(params?: {
  continent?: string;
  region?: string;
  language?: string;
  search?: string;
}) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCountries(params)
      .then(setCountries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params?.continent, params?.region, params?.language, params?.search]);

  return { countries, loading, error };
}
