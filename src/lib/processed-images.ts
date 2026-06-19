export type ProductImagePlan = {
  src: string;
  originalSrc: string;
  isProcessed: boolean;
};

/**
 * Every catalog image is served through the matte-processing API.
 * Raw spreadsheet URLs are never shown — CDN caches the result permanently.
 */
export function getProductImagePlan(sourceUrl: string): ProductImagePlan {
  return {
    src: `/api/processed-image?url=${encodeURIComponent(sourceUrl)}`,
    originalSrc: sourceUrl,
    isProcessed: true,
  };
}
