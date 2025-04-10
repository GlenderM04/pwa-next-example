import { openDB } from 'idb';

export const initDB = async () => {
  return await openDB('formDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('submissions')) {
        db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveSubmission = async (data) => {
  const db = await initDB();
  await db.add('submissions', data);
};

export const getSubmissions = async () => {
  const db = await initDB();
  return await db.getAll('submissions');
};

export const clearSubmissions = async () => {
  const db = await initDB();
  const tx = db.transaction('submissions', 'readwrite');
  await tx.store.clear();
  await tx.done;
};
