import '@testing-library/jest-dom/vitest';

// Node 22+ has its own localStorage, undefined unless node gets --localstorage-file, and it hides jsdom's.
// Give the tests a plain in-memory one when that happens.
if (typeof globalThis.localStorage === 'undefined') {
  const data = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  };
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
}
