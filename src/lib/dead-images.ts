import deadData from "@/data/dead-image-urls.json";
import mapData from "@/data/processed-image-map.json";

type DeadImageManifest = {
  urls: string[];
};

const manifest = deadData as DeadImageManifest;
const deadSet = new Set(manifest.urls ?? []);
const processedUrls = (mapData as { urls: Record<string, string> }).urls ?? {};

/** True when the source CDN URL is in the dead manifest (ignores processed fallback). */
export function isCatalogImageUrlDead(url: string): boolean {
  if (!url) return true;
  return deadSet.has(url);
}

/** CDN URL is dead — but still usable when we have a local /processed/ matte file. */
export function isDeadImageUrl(url: string): boolean {
  if (!url) return true;
  if (processedUrls[url]) return false;
  return deadSet.has(url);
}

export function hasProcessedStaticImage(url: string): boolean {
  return Boolean(url && processedUrls[url]);
}
