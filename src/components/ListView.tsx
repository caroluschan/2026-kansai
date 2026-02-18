import type { Location } from '../types';
import FilterBar from './FilterBar';
import LocationCard from './LocationCard';
import type { Category, RegionName } from '../types';

interface ListViewProps {
  locations: Location[];
  search: string;
  region: RegionName | '';
  category: Category | '';
  starredOnly: boolean;
  onSearchChange: (val: string) => void;
  onRegionChange: (val: RegionName | '') => void;
  onCategoryChange: (val: Category | '') => void;
  onStarredChange: (val: boolean) => void;
  onClear: () => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectLocation: (loc: Location) => void;
}

export default function ListView({
  locations,
  search,
  region,
  category,
  starredOnly,
  onSearchChange,
  onRegionChange,
  onCategoryChange,
  onStarredChange,
  onClear,
  isFavorite,
  onToggleFavorite,
  onSelectLocation,
}: ListViewProps) {
  return (
    <div className="h-full flex flex-col">
      <FilterBar
        search={search}
        region={region}
        category={category}
        starredOnly={starredOnly}
        resultCount={locations.length}
        onSearchChange={onSearchChange}
        onRegionChange={onRegionChange}
        onCategoryChange={onCategoryChange}
        onStarredChange={onStarredChange}
        onClear={onClear}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {locations.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-sm">No locations found</p>
          </div>
        ) : (
          locations.map((loc) => (
            <LocationCard
              key={loc.id}
              location={loc}
              isStarred={isFavorite(loc.id)}
              onToggleStar={() => onToggleFavorite(loc.id)}
              onClick={() => onSelectLocation(loc)}
            />
          ))
        )}
      </div>
    </div>
  );
}
