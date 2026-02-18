export type Category =
  | 'restaurants'
  | 'theme_parks'
  | 'zoos'
  | 'malls'
  | 'cafes'
  | 'tourist_spots';

export type RegionName = 'Wakayama' | 'Nara' | 'Kyoto' | 'Osaka' | 'Sakai';

export interface RawLocation {
  name: string;
  address: string;
  description: string;
  mappoint: string;
  lat: number | null;
  lng: number | null;
  ref: string;
  images?: string[];
}

export interface RawRegion {
  region: RegionName;
  restaurants: RawLocation[];
  theme_parks: RawLocation[];
  zoos: RawLocation[];
  malls: RawLocation[];
  cafes: RawLocation[];
  tourist_spots: RawLocation[];
}

export interface TripMeta {
  generated_on: string;
  trip_window: {
    arrive: string;
    depart: string;
    airport: string;
  };
  notes: string[];
}

export interface TripDataset {
  meta: TripMeta;
  regions: RawRegion[];
}

/** Flattened location with unique ID, region, and category */
export interface Location {
  id: string;
  name: string;
  address: string;
  description: string;
  mappoint: string;
  lat: number | null;
  lng: number | null;
  ref: string;
  region: RegionName;
  category: Category;
  images: string[];
}

export type ViewMode = 'list' | 'map';

export const CATEGORIES: Category[] = [
  'restaurants',
  'theme_parks',
  'zoos',
  'malls',
  'cafes',
  'tourist_spots',
];

export const REGIONS: RegionName[] = [
  'Wakayama',
  'Nara',
  'Kyoto',
  'Osaka',
  'Sakai',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  restaurants: '#ef4444',
  theme_parks: '#8b5cf6',
  zoos: '#22c55e',
  malls: '#3b82f6',
  cafes: '#a16207',
  tourist_spots: '#f97316',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  restaurants: '🍽️',
  theme_parks: '🎢',
  zoos: '🦁',
  malls: '🛍️',
  cafes: '☕',
  tourist_spots: '⛩️',
};
