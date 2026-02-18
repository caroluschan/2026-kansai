import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List, Map } from 'lucide-react';
import type { Location, ViewMode } from './types';
import { useFavorites } from './hooks/useFavorites';
import { useLocations } from './hooks/useLocations';
import LanguageSwitcher from './components/LanguageSwitcher';
import ListView from './components/ListView';
import MapView from './components/MapView';
import LocationDetail from './components/LocationDetail';
import { allLocations } from './lib/data';

export default function App() {
  const { t } = useTranslation();
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
  const { filters, filtered, updateFilter, clearFilters } = useLocations(favoriteIds);
  const [view, setView] = useState<ViewMode>('list');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  if (selectedLocation) {
    return (
      <LocationDetail
        location={selectedLocation}
        isStarred={isFavorite(selectedLocation.id)}
        onToggleStar={() => toggleFavorite(selectedLocation.id)}
        onBack={() => setSelectedLocation(null)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{t('app.title')}</h1>
          <p className="text-xs text-gray-400">{t('app.subtitle')}</p>
        </div>
        <LanguageSwitcher />
      </header>

      <div className="flex-1 overflow-hidden">
        {view === 'list' ? (
          <ListView
            locations={filtered}
            search={filters.search}
            region={filters.region}
            category={filters.category}
            starredOnly={filters.starredOnly}
            onSearchChange={(v) => updateFilter('search', v)}
            onRegionChange={(v) => updateFilter('region', v)}
            onCategoryChange={(v) => updateFilter('category', v)}
            onStarredChange={(v) => updateFilter('starredOnly', v)}
            onClear={clearFilters}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelectLocation={setSelectedLocation}
          />
        ) : (
          <MapView
            locations={allLocations}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelectLocation={setSelectedLocation}
            favoriteIds={favoriteIds}
          />
        )}
      </div>

      <nav className="bg-white border-t border-gray-200 flex shrink-0">
        <button
          onClick={() => setView('list')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
            view === 'list' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <List size={20} />
          {t('nav.listView')}
        </button>
        <button
          onClick={() => setView('map')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
            view === 'map' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <Map size={20} />
          {t('nav.mapView')}
        </button>
      </nav>
    </div>
  );
}
