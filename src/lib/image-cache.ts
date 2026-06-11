const MEMORY_LIMIT = 400;
const memory = new Map<string, string>();
const DB_NAME = "litbuyfinds-image-cache-v3";
const STORE = "processed";
const DB_VERSION = 1;

function trimMemory() {
  while (memory.size > MEMORY_LIMIT) {
    const oldest = memory.keys().next().value;
    if (!oldest) break;
    memory.delete(oldest);
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function getCachedImage(url: string): string | undefined {
  return memory.get(url);
}

export async function getCachedImageAsync(url: string): Promise<string | undefined> {
  const hit = memory.get(url);
  if (hit) return hit;

  try {
    const db = await openDb();
    const value = await new Promise<string | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const store = tx.objectStore(STORE);
      const req = store.get(url);
      req.onsuccess = () => resolve(req.result as string | undefined);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (value) {
      memory.set(url, value);
      return value;
    }
  } catch {
    // ignore IDB errors
  }

  return undefined;
}

export function setCachedImage(url: string, dataUrl: string) {
  memory.set(url, dataUrl);
  trimMemory();

  void (async () => {
    try {
      const db = await openDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        const store = tx.objectStore(STORE);
        const req = store.put(dataUrl, url);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      db.close();
    } catch {
      // ignore IDB errors
    }
  })();
}
