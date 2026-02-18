import type {
  TripDataset,
  Location,
  Category,
  RawRegion,
} from '../types';
import dataset from '../../resource/kansai_trip_dataset_2026-11_KIX.json';

const CATEGORIES: Category[] = [
  'restaurants',
  'theme_parks',
  'zoos',
  'malls',
  'cafes',
  'tourist_spots',
];

function flattenLocations(data: TripDataset): Location[] {
  const locations: Location[] = [];

  for (const region of data.regions) {
    for (const category of CATEGORIES) {
      const items = (region as RawRegion)[category] ?? [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        locations.push({
          id: `${region.region.toLowerCase()}-${category}-${i}`,
          name: item.name,
          address: item.address,
          description: item.description,
          mappoint: item.mappoint,
          lat: item.lat,
          lng: item.lng,
          ref: item.ref,
          region: region.region,
          category,
        });
      }
    }
  }

  return locations;
}

export const tripData = dataset as TripDataset;
export const allLocations: Location[] = flattenLocations(tripData);
