import { isDeadImageUrl } from "./dead-images";
import { getProductImagePlan } from "./processed-images";
import {
  hasPlausibleImageDimensions,
  sanitizeImageUrl,
  validateImageUrl,
} from "./image-url";
import { getImageQualityDetails } from "./image-quality";

export const MIN_PRODUCT_IMAGE_DIMENSION = 80;
export const MIN_CARD_IMAGE_DIMENSION = 120;

const TRACKING_PATTERNS = [
  /pixel/i,
  /1x1/i,
  /spacer/i,
  /blank\.(gif|png)/i,
  /transparent\.(gif|png)/i,
];

const SUPPORTED_EXTENSIONS = /\.(png|jpe?g|webp|gif|avif)(\?|$)/i;

export type ImageSourceRejection =
  | "empty"
  | "invalid_url"
  | "dead_url"
  | "tracking_pixel"
  | "unsupported_format"
  | "too_small"
  | "duplicate";

export type ImageSourceCandidate = {
  url: string;
  score: number;
  rejections: ImageSourceRejection[];
};

function isTrackingOrBlankUrl(url: string): boolean {
  return TRACKING_PATTERNS.some((pattern) => pattern.test(url));
}

function extensionScore(url: string): number {
  if (url.startsWith("/processed/")) return 100;
  if (url.startsWith("/api/processed-image")) return 90;
  if (/\.webp(\?|$)/i.test(url)) return 20;
  if (/\.png(\?|$)/i.test(url)) return 18;
  if (/\.jpe?g(\?|$)/i.test(url)) return 16;
  if (SUPPORTED_EXTENSIONS.test(url)) return 12;
  return 8;
}

function dimensionScore(url: string): number {
  const details = getImageQualityDetails(url);
  if (!details?.width || !details?.height) return 0;
  const minSide = Math.min(details.width, details.height);
  if (minSide < MIN_PRODUCT_IMAGE_DIMENSION) return -40;
  if (minSide < MIN_CARD_IMAGE_DIMENSION) return -10;
  return Math.min(40, Math.floor(minSide / 24));
}

export function scoreImageSource(url: string): ImageSourceCandidate {
  const rejections: ImageSourceRejection[] = [];
  const normalized = sanitizeImageUrl(url);
  if (!normalized) {
    return { url: "", score: -100, rejections: ["empty"] };
  }

  const validation = validateImageUrl(normalized);
  if (!validation.valid && !normalized.startsWith("/processed/")) {
    rejections.push("invalid_url");
  }

  if (
    !normalized.startsWith("/processed/") &&
    !normalized.startsWith("/api/processed-image") &&
    isDeadImageUrl(normalized)
  ) {
    rejections.push("dead_url");
  }

  if (isTrackingOrBlankUrl(normalized)) {
    rejections.push("tracking_pixel");
  }

  if (
    !normalized.startsWith("/processed/") &&
    !normalized.startsWith("/api/processed-image") &&
    !SUPPORTED_EXTENSIONS.test(normalized) &&
    !normalized.includes("alicdn.com") &&
    !normalized.includes("geilicdn.com") &&
    !normalized.includes("postimg.cc")
  ) {
    rejections.push("unsupported_format");
  }

  const dimScore = dimensionScore(normalized);
  if (dimScore < 0) rejections.push("too_small");

  let score = extensionScore(normalized) + dimScore;
  const details = getImageQualityDetails(normalized);
  if (details?.score) score += Math.min(30, details.score / 4);
  if (rejections.length) score -= rejections.length * 25;

  return { url: normalized, score, rejections };
}

export function buildProductImageCandidates(
  sourceUrl: string,
  options?: {
    preferredSrc?: string;
    fallbacks?: string[];
    includeProcessedApi?: boolean;
  }
): string[] {
  const validation = validateImageUrl(sourceUrl);
  const normalized = validation.valid ? validation.normalized : "";
  const plan = normalized ? getProductImagePlan(normalized) : null;

  const ordered = [
    options?.preferredSrc,
    normalized || undefined,
    plan?.originalSrc,
    ...(options?.fallbacks ?? []),
    ...(plan?.fallbacks ?? []),
  ];

  if (options?.includeProcessedApi && normalized) {
    ordered.push(`/api/processed-image?url=${encodeURIComponent(normalized)}`);
  }

  const seen = new Set<string>();
  const unique: string[] = [];

  for (const url of ordered) {
    if (!url || seen.has(url)) continue;
    const candidate = scoreImageSource(url);
    if (candidate.rejections.includes("duplicate")) continue;
    if (
      candidate.rejections.includes("dead_url") &&
      !url.startsWith("/processed/") &&
      !url.startsWith("/api/processed-image")
    ) {
      continue;
    }
    seen.add(url);
    unique.push(url);
  }

  return unique.sort(
    (a, b) => scoreImageSource(b).score - scoreImageSource(a).score
  );
}

export function selectBestProductImageUrl(
  sourceUrl: string,
  options?: Parameters<typeof buildProductImageCandidates>[1]
): string | null {
  const candidates = buildProductImageCandidates(sourceUrl, options);
  return candidates[0] ?? null;
}

export function isAcceptableLoadedImage(
  width: number,
  height: number
): boolean {
  return hasPlausibleImageDimensions(width, height);
}
