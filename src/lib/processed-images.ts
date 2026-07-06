import damagedData from "@/data/damaged-processed-manifest.json";
import mapData from "@/data/processed-image-map.json";

type ProcessedImageMap = {
  urls: Record<string, string>;
};

type DamagedProcessedManifest = {
  urls: string[];
  paths: string[];
};

const catalog = mapData as ProcessedImageMap;
const damaged = damagedData as DamagedProcessedManifest;
const damagedUrls = new Set(damaged.urls ?? []);
const damagedPaths = new Set(damaged.paths ?? []);

/** Broken background removal — serve catalog original instead. */
const FORCE_ORIGINAL_URLS = new Set([
  "https://i.postimg.cc/zzMm64y4/1.png", // Jordan Socks (jordan-socks-2829)
]);

export type ProductImagePlan = {
  src: string;
  originalSrc: string;
  isProcessed: boolean;
  knockoutWhite: boolean;
  fallbacks: string[];
};

export function getProcessedApiSrc(sourceUrl: string): string {
  return `/api/processed-image?url=${encodeURIComponent(sourceUrl)}`;
}

function shouldUseOriginal(sourceUrl: string, staticPath?: string): boolean {
  if (FORCE_ORIGINAL_URLS.has(sourceUrl)) return true;
  if (damagedUrls.has(sourceUrl)) return true;
  if (staticPath && damagedPaths.has(staticPath)) return true;
  return false;
}

/** Prefer pre-built matte PNGs when clean; otherwise catalog original. */
export function getProductImagePlan(sourceUrl: string): ProductImagePlan {
  if (FORCE_ORIGINAL_URLS.has(sourceUrl)) {
    return {
      src: sourceUrl,
      originalSrc: sourceUrl,
      isProcessed: false,
      knockoutWhite: false,
      fallbacks: [],
    };
  }

  const staticPath = catalog.urls[sourceUrl];

  if (staticPath && !shouldUseOriginal(sourceUrl, staticPath)) {
    return {
      src: staticPath,
      originalSrc: sourceUrl,
      isProcessed: true,
      knockoutWhite: false,
      fallbacks: [sourceUrl],
    };
  }

  return {
    src: sourceUrl,
    originalSrc: sourceUrl,
    isProcessed: false,
    knockoutWhite: false,
    fallbacks: staticPath ? [] : [],
  };
}
