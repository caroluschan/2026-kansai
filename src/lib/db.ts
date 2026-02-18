import Dexie, { type Table } from 'dexie';

export interface FavoriteRecord {
  locationId: string;
  createdAt: number;
}

class FavoritesDB extends Dexie {
  favorites!: Table<FavoriteRecord, string>;

  constructor() {
    super('kansai-guide-favorites');
    this.version(1).stores({
      favorites: 'locationId, createdAt',
    });
  }
}

export const db = new FavoritesDB();
