/**
 * Session cache for product image URLs that finished loading.
 * Survives App Router client navigations (home → product → back) without
 * re-showing skeletons when the browser already has the bytes cached.
 *
 * Never initiates network requests during cache lookups — probes use the
 * Performance API or an existing <img> element only.
 */
const SESSION_STORAGE_KEY = "litbuyf:loaded-images";
const SESSION_STORAGE_MAX = 400;

const loadedUrls = new Set<string>();
let hydrated = false;

function hydrateFromSessionStorage(): void {
  if (typeof window === "undefined") return;

  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return;

    for (const url of parsed) {
      if (typeof url === "string" && url) loadedUrls.add(url);
    }
  } catch {
    // Ignore corrupt session storage.
  }
}

function ensureHydrated(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  hydrateFromSessionStorage();
}

function persistToSessionStorage(url: string): void {
  if (typeof window === "undefined") return;

  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    let urls: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    if (!Array.isArray(urls)) urls = [];

    if (urls.includes(url)) return;

    urls.push(url);
    if (urls.length > SESSION_STORAGE_MAX) {
      urls = urls.slice(-SESSION_STORAGE_MAX);
    }

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(urls));
  } catch {
    // Ignore quota errors.
  }
}

export function markImageUrlLoaded(url: string): void {
  if (!url) return;

  ensureHydrated();
  if (loadedUrls.has(url)) return;

  loadedUrls.add(url);
  persistToSessionStorage(url);
}

export function isImageUrlLoadedInSession(url: string): boolean {
  ensureHydrated();
  return Boolean(url && loadedUrls.has(url));
}

/** Resource-timing lookup — does not start downloads. */
function wasLoadedInDocument(url: string): boolean {
  if (typeof performance === "undefined" || !url) return false;

  try {
    const entries = performance.getEntriesByName(url, "resource");
    if (entries.length === 0) return false;

    const entry = entries[entries.length - 1] as PerformanceResourceTiming;
    return entry.decodedBodySize > 0 || entry.transferSize > 0;
  } catch {
    return false;
  }
}

export function rememberLoadedImageUrl(url: string): void {
  markImageUrlLoaded(url);
}

/**
 * Fast cache check for mount-time decisions (lazy vs eager, skeleton skip).
 * Safe to call during render — never creates probe Image() requests.
 */
export function isImageUrlCached(url: string): boolean {
  if (!url) return false;
  if (isImageUrlLoadedInSession(url)) return true;

  if (wasLoadedInDocument(url)) {
    markImageUrlLoaded(url);
    return true;
  }

  return false;
}

/** Probe browser cache via an existing element — use in useLayoutEffect only. */
export function isImageElementCached(img: HTMLImageElement): boolean {
  return img.complete && img.naturalWidth > 0;
}
