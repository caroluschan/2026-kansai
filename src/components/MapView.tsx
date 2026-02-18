import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import type { Location, Category } from '../types';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../types';
import MapLegend from './MapLegend';
import StarButton from './StarButton';

const KANSAI_CENTER: [number, number] = [34.55, 135.5];
const KANSAI_ZOOM = 9;

function createMarkerIcon(category: Category, isStarred: boolean): L.DivIcon {
  const color = CATEGORY_COLORS[category];
  const emoji = CATEGORY_ICONS[category];
  const border = isStarred ? '3px solid #eab308' : '2px solid white';
  const shadow = isStarred ? '0 0 6px rgba(234,179,8,0.5)' : '0 2px 6px rgba(0,0,0,0.3)';

  return L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    html: `<div style="
      width:32px;height:32px;
      background:${color};
      border:${border};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:${shadow};
    "><span style="transform:rotate(45deg);font-size:14px;line-height:1">${emoji}</span></div>`,
  });
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useMemo(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

interface MapViewProps {
  locations: Location[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectLocation: (loc: Location) => void;
  favoriteIds: Set<string>;
}

export default function MapView({
  locations,
  isFavorite,
  onToggleFavorite,
  onSelectLocation,
  favoriteIds,
}: MapViewProps) {
  const { t } = useTranslation();
  const [visibleCategories, setVisibleCategories] = useState<Set<Category>>(
    new Set(CATEGORIES)
  );
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);

  const visibleLocations = useMemo(() => {
    return locations.filter((loc) => {
      if (loc.lat === null || loc.lng === null) return false;
      if (!visibleCategories.has(loc.category)) return false;
      if (showStarredOnly && !favoriteIds.has(loc.id)) return false;
      return true;
    });
  }, [locations, visibleCategories, showStarredOnly, favoriteIds]);

  function toggleCategory(cat: Category) {
    setVisibleCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  return (
    <div className="h-full relative">
      <MapContainer
        center={KANSAI_CENTER}
        zoom={KANSAI_ZOOM}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={KANSAI_CENTER} zoom={KANSAI_ZOOM} />

        {visibleLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat!, loc.lng!]}
            icon={createMarkerIcon(loc.category, isFavorite(loc.id))}
          >
            <Popup>
              <div className="min-w-[200px] max-w-[260px]">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-semibold text-sm text-gray-900 leading-tight">
                    {loc.name}
                  </h3>
                  <StarButton
                    isStarred={isFavorite(loc.id)}
                    onToggle={() => onToggleFavorite(loc.id)}
                    size={16}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {loc.description}
                </p>
                <button
                  onClick={() => onSelectLocation(loc)}
                  className="mt-2 text-xs text-blue-600 font-medium hover:underline"
                >
                  {t('detail.back') === '返回'
                    ? '查看詳情'
                    : t('detail.back') === '戻る'
                    ? '詳細を見る'
                    : 'View Details'}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-3 right-3 z-[1000]">
        <button
          onClick={() => setLegendOpen(!legendOpen)}
          className="bg-white rounded-lg shadow-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-2"
        >
          {t('map.legend')} {legendOpen ? '▲' : '▼'}
        </button>

        {legendOpen && (
          <MapLegend
            visibleCategories={visibleCategories}
            showStarred={showStarredOnly}
            onToggleCategory={toggleCategory}
            onToggleStarred={() => setShowStarredOnly(!showStarredOnly)}
            onShowAll={() => setVisibleCategories(new Set(CATEGORIES))}
            onHideAll={() => setVisibleCategories(new Set())}
          />
        )}
      </div>
    </div>
  );
}
