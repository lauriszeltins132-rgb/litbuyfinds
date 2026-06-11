import mapData from "@/data/processed-image-map.json";

type ProcessedImageMap = {
  urls: Record<string, string>;
};

const catalog = mapData as ProcessedImageMap;

/** Local transparent PNG with white background removed at build time. */
export function getPreprocessedImageUrl(sourceUrl: string): string | null {
  return catalog.urls[sourceUrl] ?? null;
}
