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

export function getProcessedApiSrc(sourceUrl: string): string {
  return `/api/processed-image?url=${encodeURIComponent(sourceUrl)}`;
}

/** Prefer pre-built matte PNGs, then catalog original. API processing is a last resort. */
export function getProductImagePlan(sourceUrl: string): ProductImagePlan {
  if (FORCE_ORIGINAL_URLS.has(sourceUrl)) {
    return {
      src: sourceUrl,
      originalSrc: sourceUrl,
      isProcessed: false,
      fallbacks: [],
    };
  }

  const staticPath = catalog.urls[sourceUrl];

  if (staticPath) {
    return {
      src: staticPath,
      originalSrc: sourceUrl,
      isProcessed: true,
      fallbacks: [sourceUrl],
    };
  }

  return {
    src: sourceUrl,
    originalSrc: sourceUrl,
    isProcessed: false,
    fallbacks: [],
  };
}
