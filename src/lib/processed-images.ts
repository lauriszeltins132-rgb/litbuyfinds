import mapData from "@/data/processed-image-map.json";
import skipData from "@/data/skip-cutout-urls.json";

type ProcessedImageMap = {
  urls: Record<string, string>;
};

type SkipCutoutManifest = {
  urls: string[];
};

const catalog = mapData as ProcessedImageMap;
const skipSet = new Set((skipData as SkipCutoutManifest).urls ?? []);

export type ProductImagePlan = {
  src: string;
  originalSrc: string;
  isProcessed: boolean;
};

/** White-bg-removed catalog photo when available; else original. */
export function getProductImagePlan(sourceUrl: string): ProductImagePlan {
  if (!skipSet.has(sourceUrl)) {
    const processed = catalog.urls[sourceUrl];
    if (processed) {
      return {
        src: processed,
        originalSrc: sourceUrl,
        isProcessed: true,
      };
    }
  }

  return {
    src: sourceUrl,
    originalSrc: sourceUrl,
    isProcessed: false,
  };
}
