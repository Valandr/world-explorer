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

  useEffect(() => {
    setLoading(true);
    fetchCountries(params)
      .then(setCountries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params?.continent, params?.region, params?.language, params?.search]);

  return { countries, loading };
}
