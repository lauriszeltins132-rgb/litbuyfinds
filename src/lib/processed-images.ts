import mapData from "@/data/processed-image-map.json";

type ProcessedImageMap = {
  urls: Record<string, string>;
};

const catalog = mapData as ProcessedImageMap;

export type ProductImagePlan = {
  /** Primary src to load first */
  src: string;
  /** Original catalog URL — used when cutout fails */
  originalSrc: string;
  isCutout: boolean;
  /** Non-cutout images get a dark matte stage to hide white backgrounds */
  needsMatte: boolean;
};

/** Resolve display plan: pre-built cutout PNG when available, else original with matte. */
export function getProductImagePlan(sourceUrl: string): ProductImagePlan {
  const cutout = catalog.urls[sourceUrl];
  if (cutout) {
    return {
      src: cutout,
      originalSrc: sourceUrl,
      isCutout: true,
      needsMatte: false,
    };
  }

  return {
    src: sourceUrl,
    originalSrc: sourceUrl,
    isCutout: false,
    needsMatte: true,
  };
}
