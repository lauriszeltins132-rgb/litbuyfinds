import mapData from "@/data/processed-image-map.json";

type ProcessedImageMap = {
  urls: Record<string, string>;
};

const catalog = mapData as ProcessedImageMap;

/** Broken background removal — serve catalog original instead. */
const FORCE_ORIGINAL_URLS = new Set([
  "https://i.postimg.cc/zzMm64y4/1.png", // Jordan Socks (jordan-socks-2829)
]);

export type ProductImagePlan = {
  src: string;
  originalSrc: string;
  isProcessed: boolean;
  fallbacks: string[];
};

/** Prefer pre-built matte PNGs, then API processing, then the catalog original. */
export function getProductImagePlan(sourceUrl: string): ProductImagePlan {
  if (FORCE_ORIGINAL_URLS.has(sourceUrl)) {
    return {
      src: sourceUrl,
      originalSrc: sourceUrl,
      isProcessed: false,
      fallbacks: [],
    };
  }

  const apiSrc = `/api/processed-image?url=${encodeURIComponent(sourceUrl)}`;
  const staticPath = catalog.urls[sourceUrl];

  if (staticPath) {
    return {
      src: staticPath,
      originalSrc: sourceUrl,
      isProcessed: true,
      fallbacks: [apiSrc, sourceUrl],
    };
  }

  return {
    src: apiSrc,
    originalSrc: sourceUrl,
    isProcessed: true,
    fallbacks: [sourceUrl],
  };
}
