import { useState, useEffect } from 'react';
import { Select } from '@/components/ui/select';
import { useContinents } from '@/hooks/useContinents';

interface MapFiltersProps {
  onFilterChange: (filters: { continent: string; search: string }) => void;
}

export default function MapFilters({ onFilterChange }: MapFiltersProps) {
  const continents = useContinents();
  const [continent, setContinent] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    onFilterChange({ continent, search });
  }, [continent, search, onFilterChange]);

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={continent}
        onChange={(e) => setContinent(e.target.value)}
        options={[
          { value: '', label: 'Tous les continents' },
          ...continents.map((c) => ({ value: c.name, label: c.name })),
        ]}
        className="w-48"
      />
      <input
        type="text"
        placeholder="Rechercher un pays..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />
    </div>
  );
}
