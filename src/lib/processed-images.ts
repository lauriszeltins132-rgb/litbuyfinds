import mapData from "@/data/processed-image-map.json";
import { shouldSkipCutout } from "./cutout-quality";

type ProcessedImageMap = {
  urls: Record<string, string>;
};

const catalog = mapData as ProcessedImageMap;

export type ProductImagePlan = {
  src: string;
  originalSrc: string;
  isCutout: boolean;
  needsMatte: boolean;
};

function framedOriginal(sourceUrl: string): ProductImagePlan {
  return {
    src: sourceUrl,
    originalSrc: sourceUrl,
    isCutout: false,
    needsMatte: true,
  };
}

/** Pre-built cutout when quality-safe; otherwise original in a dark framed stage. */
export function getProductImagePlan(
  sourceUrl: string,
  productName?: string
): ProductImagePlan {
  if (shouldSkipCutout(sourceUrl, productName)) {
    return framedOriginal(sourceUrl);
  }

  const cutout = catalog.urls[sourceUrl];
  if (cutout) {
    return {
      src: cutout,
      originalSrc: sourceUrl,
      isCutout: true,
      needsMatte: false,
    };
  }

  return framedOriginal(sourceUrl);
}
