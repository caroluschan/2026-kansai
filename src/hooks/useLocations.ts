import { useState, useMemo } from 'react';
import { allLocations } from '../lib/data';
import type { Location, Category, RegionName } from '../types';

interface Filters {
  search: string;
  region: RegionName | '';
  category: Category | '';
  starredOnly: boolean;
}

export function useLocations(favoriteIds: Set<string>) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    region: '',
    category: '',
    starredOnly: false,
  });

  const filtered = useMemo(() => {
    let result: Location[] = allLocations;

    if (filters.region) {
      result = result.filter((loc) => loc.region === filters.region);
    }

    if (filters.category) {
      result = result.filter((loc) => loc.category === filters.category);
    }

    if (filters.starredOnly) {
      result = result.filter((loc) => favoriteIds.has(loc.id));
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.address.toLowerCase().includes(q) ||
          loc.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [filters, favoriteIds]);

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({ search: '', region: '', category: '', starredOnly: false });
  }

  return { filters, filtered, updateFilter, clearFilters };
}
