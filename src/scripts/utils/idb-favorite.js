import { openDB } from 'idb';

const DB_NAME = 'favorite-story-db';
const STORE_NAME = 'favorites';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const IdbFavorite = {
  async put(story) {
    const db = await dbPromise;
    return db.put(STORE_NAME, story);
  },
  async getAll() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },
  async delete(id) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
  },
  async get(id) {
    const db = await dbPromise;
    return db.get(STORE_NAME, id);
  },
};

export default IdbFavorite;