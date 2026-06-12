import mapData from "@/data/processed-image-map.json";

type ProcessedImageMap = {
  urls: Record<string, string>;
};

const catalog = mapData as ProcessedImageMap;

export type ProductImagePlan = {
  src: string;
  originalSrc: string;
  isProcessed: boolean;
};

/** Static cutout when built; on-demand API processing for the rest. */
export function getProductImagePlan(sourceUrl: string): ProductImagePlan {
  const processed = catalog.urls[sourceUrl];
  if (processed) {
    return {
      src: processed,
      originalSrc: sourceUrl,
      isProcessed: true,
    };
  }

  return {
    src: `/api/processed-image?url=${encodeURIComponent(sourceUrl)}`,
    originalSrc: sourceUrl,
    isProcessed: true,
  };
}
