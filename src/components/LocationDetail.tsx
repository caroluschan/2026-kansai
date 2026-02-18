import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, ExternalLink, Globe } from 'lucide-react';
import type { Location } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../types';
import StarButton from './StarButton';

interface LocationDetailProps {
  location: Location;
  isStarred: boolean;
  onToggleStar: () => void;
  onBack: () => void;
}

export default function LocationDetail({
  location,
  isStarred,
  onToggleStar,
  onBack,
}: LocationDetailProps) {
  const { t } = useTranslation();
  const color = CATEGORY_COLORS[location.category];
  const icon = CATEGORY_ICONS[location.category];

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold text-gray-900 truncate flex-1">{t('detail.back')}</h2>
        <StarButton isStarred={isStarred} onToggle={onToggleStar} size={24} />
      </div>

      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: color }}
            >
              <span>{icon}</span>
              {t(`category.${location.category}`)}
            </span>
            <span className="text-sm text-gray-500">
              {t(`region.${location.region}`)}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{location.name}</h1>
        </div>

        <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-100">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              {t('detail.description')}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{location.description}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              {t('detail.address')}
            </p>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-700">{location.address}</p>
            </div>
          </div>

          {location.lat !== null && location.lng !== null && (
            <div>
              <p className="text-xs text-gray-400">
                {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <a
            href={location.mappoint}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 transition-colors"
          >
            <ExternalLink size={16} />
            {t('detail.openInMaps')}
          </a>

          {location.ref && (
            <a
              href={location.ref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              <Globe size={16} />
              {t('detail.website')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
