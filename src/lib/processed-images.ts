export type ProductImagePlan = {
  src: string;
  originalSrc: string;
  isCutout: boolean;
  needsMatte: boolean;
};

/** Always show the original catalog photo in a dark framed stage — no cutout processing. */
export function getProductImagePlan(sourceUrl: string): ProductImagePlan {
  return {
    src: sourceUrl,
    originalSrc: sourceUrl,
    isCutout: false,
    needsMatte: true,
  };
}
