/**
 * In-memory session cache for product image URLs that finished loading.
 * Survives App Router client navigations (home → product → back) without
 * re-showing skeletons when the browser already has the bytes cached.
 */
const loadedUrls = new Set<string>();

export function markImageUrlLoaded(url: string): void {
  if (url) loadedUrls.add(url);
}

export function isImageUrlLoadedInSession(url: string): boolean {
  return Boolean(url && loadedUrls.has(url));
}

/**
 * Synchronous memory-cache probe. When an image is already decoded in the
 * browser, assigning src makes `complete` true before the next paint.
 */
export function probeBrowserImageCache(url: string): boolean {
  if (typeof window === "undefined" || !url) return false;

  try {
    const probe = new Image();
    probe.src = url;
    return probe.complete && probe.naturalWidth > 0;
  } catch {
    return false;
  }
}

export function rememberLoadedImageUrl(url: string): void {
  if (!url) return;
  markImageUrlLoaded(url);
}

export function isImageUrlCached(url: string): boolean {
  if (!url) return false;
  if (isImageUrlLoadedInSession(url)) return true;
  if (probeBrowserImageCache(url)) {
    markImageUrlLoaded(url);
    return true;
  }
  return false;
}
