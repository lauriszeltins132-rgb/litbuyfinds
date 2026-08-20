/**
 * Session cache for product image URLs that finished loading (or hard-failed).
 * Survives App Router client navigations (home → product → back) without
 * re-showing skeletons when the browser already has the bytes cached.
 *
 * Never initiates network requests during cache lookups — probes use the
 * Performance API or an existing <img> element only.
 */
const SESSION_STORAGE_KEY = "litbuyf:loaded-images";
const SESSION_FAILED_KEY = "litbuyf:failed-images";
const SESSION_STORAGE_MAX = 600;
const SESSION_FAILED_MAX = 240;

const loadedUrls = new Set<string>();
const failedUrls = new Set<string>();
let hydrated = false;
let persistLoadedScheduled = false;
let persistFailedScheduled = false;

function readSessionArray(key: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((url): url is string => typeof url === "string" && Boolean(url));
  } catch {
    return [];
  }
}

function writeSessionArray(key: string, urls: string[], max: number): void {
  if (typeof window === "undefined") return;

  try {
    const trimmed = urls.length > max ? urls.slice(-max) : urls;
    sessionStorage.setItem(key, JSON.stringify(trimmed));
  } catch {
    // Ignore quota errors.
  }
}

function hydrateFromSessionStorage(): void {
  if (typeof window === "undefined") return;

  for (const url of readSessionArray(SESSION_STORAGE_KEY)) {
    loadedUrls.add(url);
  }
  for (const url of readSessionArray(SESSION_FAILED_KEY)) {
    failedUrls.add(url);
  }
}

function ensureHydrated(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  hydrateFromSessionStorage();
}

function schedulePersistLoaded(): void {
  if (persistLoadedScheduled || typeof window === "undefined") return;
  persistLoadedScheduled = true;

  const flush = () => {
    persistLoadedScheduled = false;
    writeSessionArray(SESSION_STORAGE_KEY, Array.from(loadedUrls), SESSION_STORAGE_MAX);
  };

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(flush, { timeout: 500 });
  } else {
    queueMicrotask(flush);
  }
}

function schedulePersistFailed(): void {
  if (persistFailedScheduled || typeof window === "undefined") return;
  persistFailedScheduled = true;

  const flush = () => {
    persistFailedScheduled = false;
    writeSessionArray(SESSION_FAILED_KEY, Array.from(failedUrls), SESSION_FAILED_MAX);
  };

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(flush, { timeout: 500 });
  } else {
    queueMicrotask(flush);
  }
}

export function markImageUrlLoaded(url: string): void {
  if (!url) return;

  ensureHydrated();
  failedUrls.delete(url);
  if (loadedUrls.has(url)) return;

  loadedUrls.add(url);
  schedulePersistLoaded();
}

export function markImageUrlFailed(url: string): void {
  if (!url) return;

  ensureHydrated();
  if (loadedUrls.has(url) || failedUrls.has(url)) return;

  failedUrls.add(url);
  schedulePersistFailed();
}

export function isImageUrlLoadedInSession(url: string): boolean {
  ensureHydrated();
  return Boolean(url && loadedUrls.has(url));
}

export function isImageUrlFailedInSession(url: string): boolean {
  ensureHydrated();
  return Boolean(url && failedUrls.has(url));
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

/** Drop known-failed URLs from the candidate list while keeping at least one option. */
export function filterFailedImageCandidates(candidates: string[]): string[] {
  if (candidates.length <= 1) return candidates;

  const usable = candidates.filter((url) => !isImageUrlFailedInSession(url));
  return usable.length > 0 ? usable : candidates;
}

/** Stop a hung download so the next candidate can use bandwidth. */
export function abortImageElementLoad(img: HTMLImageElement | null): void {
  if (!img) return;
  try {
    img.removeAttribute("src");
    img.src = "";
  } catch {
    // Ignore detach errors during unmount.
  }
}
