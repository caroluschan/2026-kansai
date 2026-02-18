import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import type { Location } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../types';
import StarButton from './StarButton';

interface LocationCardProps {
  location: Location;
  isStarred: boolean;
  onToggleStar: () => void;
  onClick: () => void;
}

export default function LocationCard({
  location,
  isStarred,
  onToggleStar,
  onClick,
}: LocationCardProps) {
  const { t } = useTranslation();
  const color = CATEGORY_COLORS[location.category];
  const icon = CATEGORY_ICONS[location.category];
  const thumb = location.images[0];
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all active:scale-[0.99] overflow-hidden"
    >
      <div className="flex">
        <div className="shrink-0 w-[72px] h-[72px] m-3 rounded-lg overflow-hidden">
          {thumb && !imgError ? (
            <img
              src={thumb}
              alt={location.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${color}18` }}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 py-3 pr-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: color }}
                >
                  <span>{icon}</span>
                  {t(`category.${location.category}`)}
                </span>
                <span className="text-xs text-gray-400">
                  {t(`region.${location.region}`)}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                {location.name}
              </h3>

              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {location.description}
              </p>

              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <MapPin size={12} />
                <span className="truncate">{location.address}</span>
              </div>
            </div>

            <StarButton isStarred={isStarred} onToggle={onToggleStar} />
          </div>
        </div>
      </div>
    </div>
  );
}
