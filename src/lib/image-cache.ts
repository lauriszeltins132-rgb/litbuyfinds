import type { BrightBgTreatment } from "./bright-bg";

const MEMORY_LIMIT = 400;
const memory = new Map<string, string>();
const DB_NAME = "litbuyfinds-image-cache-v7";
const STORE = "processed";
const DB_VERSION = 1;
const CACHE_PREFIX = "p2:";

export type ProcessedImageEntry = {
  src: string;
  hasBrightBackground: boolean;
  processedToPng: boolean;
  treatment: BrightBgTreatment;
};

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

function serialize(entry: ProcessedImageEntry): string {
  return `${CACHE_PREFIX}${JSON.stringify(entry)}`;
}

export function parseCachedImage(raw: string): ProcessedImageEntry {
  if (raw.startsWith(CACHE_PREFIX)) {
    try {
      return JSON.parse(raw.slice(CACHE_PREFIX.length)) as ProcessedImageEntry;
    } catch {
      // fall through
    }
  }

  const processedToPng = raw.startsWith("data:");
  return {
    src: raw,
    hasBrightBackground: false,
    processedToPng,
    treatment: "none",
  };
}

export function getCachedImage(url: string): ProcessedImageEntry | undefined {
  const hit = memory.get(url);
  return hit ? parseCachedImage(hit) : undefined;
}

export async function getCachedImageAsync(
  url: string
): Promise<ProcessedImageEntry | undefined> {
  const hit = memory.get(url);
  if (hit) return parseCachedImage(hit);

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
      return parseCachedImage(value);
    }
  } catch {
    // ignore IDB errors
  }

  return undefined;
}

export function setCachedImage(url: string, entry: ProcessedImageEntry) {
  const serialized = serialize(entry);
  memory.set(url, serialized);
  trimMemory();

  void (async () => {
    try {
      const db = await openDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        const store = tx.objectStore(STORE);
        const req = store.put(serialized, url);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      db.close();
    } catch {
      // ignore IDB errors
    }
  })();
}
