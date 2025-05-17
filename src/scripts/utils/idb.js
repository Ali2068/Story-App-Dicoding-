import { openDB } from 'idb';

const DB_NAME = 'cerita-db';
const STORE_NAME = 'stories';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export const IdbStory = {
  async getAll() {
    return (await dbPromise).getAll(STORE_NAME);
  },
  async put(story) {
    return (await dbPromise).put(STORE_NAME, story);
  },
  async delete(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },
  async clear() {
    return (await dbPromise).clear(STORE_NAME);
  },
};