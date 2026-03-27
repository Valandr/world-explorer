import { useState, useEffect } from 'react';
import type { Continent } from '@/types';
import { fetchContinents } from '@/lib/api';

export function useContinents() {
  const [continents, setContinents] = useState<Continent[]>([]);

  useEffect(() => {
    fetchContinents()
      .then(setContinents)
      .catch(() => {});
  }, []);

  return continents;
}
