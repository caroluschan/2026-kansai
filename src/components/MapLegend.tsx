import { useTranslation } from 'react-i18next';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../types';
import type { Category } from '../types';
import { Star } from 'lucide-react';

interface MapLegendProps {
  visibleCategories: Set<Category>;
  showStarred: boolean;
  onToggleCategory: (cat: Category) => void;
  onToggleStarred: () => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

export default function MapLegend({
  visibleCategories,
  showStarred,
  onToggleCategory,
  onToggleStarred,
  onShowAll,
  onHideAll,
}: MapLegendProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-56">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {t('map.layers')}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={onShowAll}
            className="text-[10px] px-1.5 py-0.5 rounded text-blue-600 hover:bg-blue-50"
          >
            {t('map.showAll')}
          </button>
          <button
            onClick={onHideAll}
            className="text-[10px] px-1.5 py-0.5 rounded text-gray-500 hover:bg-gray-50"
          >
            {t('map.hideAll')}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onToggleCategory(cat)}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs transition-colors ${
              visibleCategories.has(cat)
                ? 'bg-gray-50 text-gray-800'
                : 'text-gray-400'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                backgroundColor: visibleCategories.has(cat)
                  ? CATEGORY_COLORS[cat]
                  : '#d1d5db',
              }}
            />
            <span>{CATEGORY_ICONS[cat]}</span>
            <span className="truncate">{t(`category.${cat}`)}</span>
          </button>
        ))}

        <div className="border-t border-gray-100 my-1" />

        <button
          onClick={onToggleStarred}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs transition-colors ${
            showStarred
              ? 'bg-yellow-50 text-yellow-700'
              : 'text-gray-400'
          }`}
        >
          <Star
            size={12}
            className={showStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
          />
          <span>{t('map.showStarred')}</span>
        </button>
      </div>
    </div>
  );
}
