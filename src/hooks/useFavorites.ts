import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import type { FavoriteRecord } from '../lib/db';

export function useFavorites() {
  const favorites = useLiveQuery(() => db.favorites.toArray(), []) ?? [];

  const favoriteIds = new Set(favorites.map((f: FavoriteRecord) => f.locationId));

  async function toggleFavorite(locationId: string) {
    const exists = await db.favorites.get(locationId);
    if (exists) {
      await db.favorites.delete(locationId);
    } else {
      await db.favorites.put({ locationId, createdAt: Date.now() });
    }
  }

  function isFavorite(locationId: string): boolean {
    return favoriteIds.has(locationId);
  }

  return { favorites, favoriteIds, toggleFavorite, isFavorite };
}
