import { getProductEngagementScore, getProductSaveScore } from "./analytics-engagement";
import { getPremiumBrandBoost } from "./curation";
import {
  getEditorialBrandBoost,
  isHomepageFashionProduct,
  isScreenshotStyleProduct,
  passesHomepageVisualPresentation,
} from "./homepage-curation";
import {
  getImageQualityDetails,
  getImageQualityScore,
  HOMEPAGE_MIN_SCORE,
} from "./image-quality";
import { hasExactPrice } from "./pricing";
import { resolveProductDisplayImage } from "./product-image-presentation";
import { validateProduct } from "./product-validation";
import { isUsableImageUrl } from "./image-url";
import {
  dedupeListingProducts,
  getListingDedupeKey,
} from "./listing-dedupe";
import { getEffectiveProductTitle } from "./product-title-quality";
import { seededShuffle } from "./rotation-seeds";
import type { Product } from "./types";

const LOW_PRIORITY_PATTERN =
  /\b(hat|cap|beanie|beret|scarf|belt|glove|sock)\b/i;

const VISUAL_CATEGORY_BOOST: Record<string, number> = {
  shoes: 14,
  "coats-and-jackets": 12,
  "hoodies-and-pants": 8,
  "tshirts-and-shorts": 4,
};

/** 0–100 — strict image score for homepage curation. */
export function computeImageQualityScore(product: Product): number {
  if (!product.image) return 0;

  const details = getImageQualityDetails(product.image);
  const resolved = resolveProductDisplayImage(product);
  let score = getImageQualityScore(product.image);

  if (resolved?.isProcessed) score += 8;
  else if ((details?.borderBrightRatio ?? 0) > 0.1) score -= 20;

  if (details?.issues) {
    if (details.issues.includes("tiny_product")) score -= 35;
    if (details.issues.includes("excessive_empty_space")) score -= 28;
    if (details.issues.includes("transparent_cutout")) score -= 18;
    if (details.issues.includes("white_border")) score -= 40;
    if (details.issues.includes("low_resolution")) score -= 22;
    if (details.issues.includes("extreme_aspect_ratio")) score -= 20;
    if (details.issues.includes("damaged_cutout")) score -= 35;
    if (details.issues.includes("unprocessed")) score -= 12;
    if (details.issues.includes("screenshot_style")) score -= 45;
    if (details.issues.includes("white_blank")) score -= 35;
  }

  if (details) {
    const fill = details.contentFillRatio ?? 0.5;
    const empty = details.emptySpaceRatio ?? 1 - fill;
    const whiteBlank = details.whiteBlankRatio ?? empty;
    const border = details.borderBrightRatio ?? 0;

    if (fill >= 0.62) score += 10;
    else if (fill < 0.38) score -= 28;
    else if (fill < 0.48) score -= 14;

    if (empty > 0.55) score -= 30;
    else if (empty > 0.4) score -= 22;

    if (whiteBlank > 0.5) score -= 35;
    else if (whiteBlank > 0.4) score -= 25;

    if (border > 0.3) score -= 35;
    else if (border > 0.18) score -= 22;
    else if (border > 0.1) score -= 10;

    const minDim = Math.min(details.width ?? 0, details.height ?? 0);
    if (minDim >= 640) score += 6;
    else if (minDim < 240) score -= 18;

    if (details.isScreenshotStyle) score -= 45;
  }

  if (isScreenshotStyleProduct(product)) score -= 40;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/** Primary homepage ranking signal — visual appeal over engagement. */
export function computeVisualAppealScore(product: Product): number {
  const details = getImageQualityDetails(product.image);
  if (!details) return 35;

  let score = 58;
  const fill = details.contentFillRatio ?? 0.5;
  const empty = details.emptySpaceRatio ?? 1 - fill;
  const whiteBlank = details.whiteBlankRatio ?? empty;
  const border = details.borderBrightRatio ?? 0;
  const resolved = resolveProductDisplayImage(product);

  if (fill >= 0.6) score += 22;
  else if (fill >= 0.5) score += 12;
  else if (fill < 0.38) score -= 30;

  if (empty > 0.55) score -= 35;
  else if (empty > 0.4) score -= 28;

  if (whiteBlank > 0.45) score -= 32;
  else if (whiteBlank > 0.35) score -= 18;

  if (border > 0.25) score -= 30;
  else if (border > 0.15) score -= 20;

  if ((details.transparencyRatio ?? 0) > 0.2 && !resolved?.isProcessed) {
    score -= 22;
  }

  if (resolved?.isProcessed) score += 10;

  if (VISUAL_CATEGORY_BOOST[product.category_slug]) {
    score += VISUAL_CATEGORY_BOOST[product.category_slug];
  }

  score += getEditorialBrandBoost(product);

  if (LOW_PRIORITY_PATTERN.test(product.product_name)) score -= 22;

  if (isScreenshotStyleProduct(product)) score -= 50;
  if (!isHomepageFashionProduct(product)) score -= 60;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeEngagement(count: number, scale = 10): number {
  if (count <= 0) return 0;
  return Math.min(100, Math.round(Math.log1p(count) * scale));
}

function computeRecencyScore(product: Product): number {
  const id = Number(product.id);
  if (!Number.isFinite(id)) return 30;

  const idNorm = Math.min(100, Math.round((id / 3200) * 100));
  if (product.category_slug === "latest-finds") return Math.max(idNorm, 75);
  if (product.category_slug === "trending-now") return Math.max(idNorm, 65);
  return idNorm;
}

function computePopularityScore(product: Product, analyticsRank = 99): number {
  let score = getPremiumBrandBoost(product.product_name) * 0.25;
  score += validateProduct(product).confidence * 20;
  if (product.category_slug === "trending-now") score += 10;
  if (analyticsRank >= 0 && analyticsRank < 15) {
    score += Math.max(0, 18 - analyticsRank);
  }
  return Math.max(0, Math.min(100, Math.round(score)));
}

export type ProductQualityBreakdown = {
  total: number;
  imageQuality: number;
  visualAppeal: number;
  clicks: number;
  saves: number;
  qc: number;
  recency: number;
  popularity: number;
};

/**
 * Visual-first homepage score.
 * Visual appeal and image quality dominate; engagement is a tiebreaker.
 */
export function getProductQualityScore(
  product: Product,
  options: { analyticsRank?: number } = {}
): number {
  return getProductQualityBreakdown(product, options).total;
}

export function getProductQualityBreakdown(
  product: Product,
  options: { analyticsRank?: number } = {}
): ProductQualityBreakdown {
  const imageQuality = computeImageQualityScore(product);
  const visualAppeal = computeVisualAppealScore(product);
  const clicks = normalizeEngagement(getProductEngagementScore(product.id));
  const saves = normalizeEngagement(getProductSaveScore(product.id), 12);
  const qc = product.qc_link ? 100 : 0;
  const recency = computeRecencyScore(product);
  const popularity = computePopularityScore(product, options.analyticsRank);

  const total = Math.round(
    visualAppeal * 0.45 +
      imageQuality * 0.3 +
      qc * 0.08 +
      clicks * 0.06 +
      saves * 0.04 +
      recency * 0.04 +
      popularity * 0.03
  );

  return {
    total: Math.max(0, Math.min(100, total)),
    imageQuality,
    visualAppeal,
    clicks,
    saves,
    qc,
    recency,
    popularity,
  };
}

export function passesHomepageImageThreshold(product: Product): boolean {
  return computeImageQualityScore(product) >= HOMEPAGE_MIN_SCORE;
}

/** Strict homepage gate — fashion only, premium presentation required. */
export function isHomepageCuratedEligible(product: Product): boolean {
  if (!isUsableImageUrl(product.image) || !hasExactPrice(product.price)) return false;
  if (!isHomepageFashionProduct(product)) return false;
  if (!passesHomepageVisualPresentation(product)) return false;
  if (!passesHomepageImageThreshold(product)) return false;

  const validation = validateProduct(product);
  if (validation.confidence < 0.5) return false;

  const visual = computeVisualAppealScore(product);
  if (visual < 65) return false;

  const image = computeImageQualityScore(product);
  if (image < HOMEPAGE_MIN_SCORE) return false;

  const details = getImageQualityDetails(product.image);
  const resolved = resolveProductDisplayImage(product);
  if (
    !resolved?.isProcessed &&
    ((details?.borderBrightRatio ?? 0) > 0.12 ||
      (details?.whiteBlankRatio ?? 0) > 0.32)
  ) {
    return false;
  }

  const boost = getPremiumBrandBoost(product.product_name);
  const engagement =
    getProductEngagementScore(product.id) + getProductSaveScore(product.id);
  const isLowPriority = LOW_PRIORITY_PATTERN.test(product.product_name);

  if (isLowPriority && boost < 85 && engagement < 3 && visual < 72) return false;

  return true;
}

export function compareProductQualityScore(a: Product, b: Product): number {
  const visualDiff = computeVisualAppealScore(b) - computeVisualAppealScore(a);
  if (visualDiff !== 0) return visualDiff;
  const imageDiff = computeImageQualityScore(b) - computeImageQualityScore(a);
  if (imageDiff !== 0) return imageDiff;
  return getProductQualityScore(b) - getProductQualityScore(a);
}

export function sortByProductQuality(
  items: Product[],
  options: { analyticsRankById?: Map<string, number> } = {}
): Product[] {
  return [...items].sort((a, b) => {
    const aRank = options.analyticsRankById?.get(a.id) ?? 99;
    const bRank = options.analyticsRankById?.get(b.id) ?? 99;
    const diff =
      getProductQualityScore(b, { analyticsRank: bRank }) -
      getProductQualityScore(a, { analyticsRank: aRank });
    if (diff !== 0) return diff;
    return compareProductQualityScore(a, b);
  });
}

/** Keep rails visually consistent — drop weak outliers. */
export function filterVisualTier(
  products: Product[],
  maxGapFromTop = 8
): Product[] {
  if (products.length === 0) return [];

  const scored = products.map((product) => ({
    product,
    visual: computeVisualAppealScore(product),
    image: computeImageQualityScore(product),
  }));

  scored.sort((a, b) => b.visual - a.visual || b.image - a.image);

  const topVisual = scored[0]?.visual ?? 0;
  const floor = Math.max(62, topVisual - maxGapFromTop);

  return scored
    .filter((entry) => entry.visual >= floor && entry.image >= HOMEPAGE_MIN_SCORE - 2)
    .map((entry) => entry.product);
}

export function pickFeaturedProducts(
  pool: Product[],
  limit: number,
  used: Set<string>,
  periodSeed: number,
  salt: string,
  options: {
    predicate?: (product: Product) => boolean;
    analyticsRankById?: Map<string, number>;
    preferEditorial?: boolean;
    usedListingKeys?: Set<string>;
  } = {}
): Product[] {
  const eligible = dedupeListingProducts(
    pool.filter(
      (product) =>
        isHomepageCuratedEligible(product) &&
        !used.has(product.id) &&
        (!options.usedListingKeys ||
          !options.usedListingKeys.has(getListingDedupeKey(product))) &&
        (!options.predicate || options.predicate(product))
    )
  );

  const ranked = [...eligible].sort((a, b) => {
    const aVisual = computeVisualAppealScore(a);
    const bVisual = computeVisualAppealScore(b);
    if (bVisual !== aVisual) return bVisual - aVisual;

    const aImage = computeImageQualityScore(a);
    const bImage = computeImageQualityScore(b);
    if (bImage !== aImage) return bImage - aImage;

    const aRank = options.analyticsRankById?.get(a.id) ?? 99;
    const bRank = options.analyticsRankById?.get(b.id) ?? 99;
    const scoreDiff =
      getProductQualityScore(b, { analyticsRank: bRank }) -
      getProductQualityScore(a, { analyticsRank: aRank });
    if (scoreDiff !== 0) return scoreDiff;

    return Number(b.id) - Number(a.id);
  });

  let tiered = filterVisualTier(dedupeListingProducts(ranked));
  if (tiered.length === 0) return [];

  const rotationDepth = Math.min(
    tiered.length,
    Math.max(limit * 5, limit + 24, 36)
  );
  const rotationPool = tiered.slice(0, rotationDepth);
  tiered = seededShuffle(rotationPool, periodSeed, salt, (product) => product.id);

  if (options.preferEditorial !== false && tiered.length > limit) {
    const editorial = tiered.filter((p) => getEditorialBrandBoost(p) > 0);
    const rest = tiered.filter((p) => getEditorialBrandBoost(p) === 0);
    const editorialQuota = Math.min(
      editorial.length,
      Math.max(Math.ceil(limit * 0.65), limit - 3)
    );
    tiered = [...editorial.slice(0, editorialQuota), ...rest];
    const seen = new Set<string>();
    tiered = tiered.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }

  const seenIds = new Set<string>();
  const seenListingKeys = new Set<string>();
  const seenTitles = new Set<string>();
  const deduped: Product[] = [];

  for (const product of tiered) {
    if (seenIds.has(product.id)) continue;

    const listingKey = getListingDedupeKey(product);
    if (seenListingKeys.has(listingKey)) continue;

    const titleKey = getEffectiveProductTitle(product).trim().toLowerCase();
    if (seenTitles.has(titleKey)) continue;

    seenIds.add(product.id);
    seenListingKeys.add(listingKey);
    seenTitles.add(titleKey);
    deduped.push(product);
    if (deduped.length >= limit) break;
  }

  return deduped;
}
