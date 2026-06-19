import mapData from "@/data/processed-image-map.json";

type ProcessedImageMap = {
  urls: Record<string, string>;
};

const catalog = mapData as ProcessedImageMap;

export type ProductImagePlan = {
  src: string;
  originalSrc: string;
  isProcessed: boolean;
  fallbacks: string[];
};

/** Matte-processed assets only — never raw spreadsheet URLs. */
export function getProductImagePlan(sourceUrl: string): ProductImagePlan {
  const apiSrc = `/api/processed-image?url=${encodeURIComponent(sourceUrl)}`;
  const staticPath = catalog.urls[sourceUrl];

  if (staticPath) {
    return {
      src: staticPath,
      originalSrc: sourceUrl,
      isProcessed: true,
      fallbacks: [apiSrc],
    };
  }

  return {
    src: apiSrc,
    originalSrc: sourceUrl,
    isProcessed: true,
    fallbacks: [],
  };
}
