/** Every product image goes through the cutout API (cached at CDN after first hit). */
export function getProcessedImageSrc(sourceUrl: string): {
  src: string;
  isCutout: boolean;
} {
  return {
    src: `/api/processed-image?url=${encodeURIComponent(sourceUrl)}`,
    isCutout: true,
  };
}
