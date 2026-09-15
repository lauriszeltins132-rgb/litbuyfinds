/**
 * Runtime lookup for mirrored catalog images (LitBuyFinds-controlled CDN).
 * Original remote URLs in products.json remain the source of truth / schema / fallback.
 */
import mirrorMap from "@/data/image-mirror-map.json";

type MirrorEntry = {
  url: string;
  pathname?: string;
  contentType?: string;
  bytes?: number;
  mirroredAt?: string;
};

type MirrorMapFile = {
  version: number;
  updatedAt: string | null;
  urls: Record<string, MirrorEntry | string>;
};

const map = mirrorMap as MirrorMapFile;

function entryUrl(value: MirrorEntry | string | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.url || "";
}

/** Public CDN URL for a catalog source image, if mirrored. */
export function getMirroredImageUrl(
  originalUrl: string | null | undefined
): string {
  if (!originalUrl) return "";
  return entryUrl(map.urls[originalUrl]);
}

/**
 * Render priority:
 * 1) controlled CDN mirror
 * 2) original approved image
 * Fallbacks always preserve the original when a mirror exists.
 */
export function resolveMirroredDisplay(
  originalUrl: string | null | undefined
): { displaySrc: string; fallbacks: string[] } | null {
  if (!originalUrl) return null;
  const mirrored = getMirroredImageUrl(originalUrl);
  if (mirrored) {
    return { displaySrc: mirrored, fallbacks: [originalUrl] };
  }
  return { displaySrc: originalUrl, fallbacks: [] };
}

export function getMirrorMapStats() {
  return {
    version: map.version,
    updatedAt: map.updatedAt,
    mirroredCount: Object.keys(map.urls).length,
  };
}

/** True when URL is a Vercel Blob public object we may display. */
export function isControlledMirrorHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host.endsWith(".public.blob.vercel-storage.com") ||
    host.endsWith(".blob.vercel-storage.com")
  );
}
