import { useTranslation } from 'react-i18next';
import { Search, X, Star } from 'lucide-react';
import { CATEGORIES, REGIONS } from '../types';
import type { Category, RegionName } from '../types';

interface FilterBarProps {
  search: string;
  region: RegionName | '';
  category: Category | '';
  starredOnly: boolean;
  resultCount: number;
  onSearchChange: (val: string) => void;
  onRegionChange: (val: RegionName | '') => void;
  onCategoryChange: (val: Category | '') => void;
  onStarredChange: (val: boolean) => void;
  onClear: () => void;
}

export default function FilterBar({
  search,
  region,
  category,
  starredOnly,
  resultCount,
  onSearchChange,
  onRegionChange,
  onCategoryChange,
  onStarredChange,
  onClear,
}: FilterBarProps) {
  const { t } = useTranslation();

  const hasActiveFilters = search || region || category || starredOnly;

  return (
    <div className="space-y-3 p-4 bg-white border-b border-gray-200">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('filter.search')}
          className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={region}
          onChange={(e) => onRegionChange(e.target.value as RegionName | '')}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="">{t('filter.allRegions')}</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {t(`region.${r}`)}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as Category | '')}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="">{t('filter.allCategories')}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t(`category.${c}`)}
            </option>
          ))}
        </select>

        <button
          onClick={() => onStarredChange(!starredOnly)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            starredOnly
              ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Star size={14} className={starredOnly ? 'fill-yellow-400 text-yellow-400' : ''} />
          {t('filter.starredOnly')}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('filter.clear')}
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">
        {t('filter.results', { count: resultCount })}
      </p>
    </div>
  );
}
