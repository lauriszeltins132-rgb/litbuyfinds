import { getCatalogBrightBgTreatment } from "./bright-bg";
import { isDeadImageUrl } from "./dead-images";
import {
  getImageQualityDetails,
  type ImageQualityEntry,
} from "./image-quality";

export type ImageBackgroundKind =
  | "transparent"
  | "mostly_white"
  | "mostly_dark"
  | "photographic"
  | "broken";

export type ImageBackgroundAnalysis = {
  kind: ImageBackgroundKind;
  surfaceClass: string;
  needsSeparation: boolean;
  confidence: "high" | "medium" | "low";
};

const SURFACE_BY_KIND: Record<ImageBackgroundKind, string> = {
  transparent: "product-image-surface--transparent",
  mostly_white: "product-image-surface--light",
  mostly_dark: "product-image-surface--dark",
  photographic: "product-image-surface--neutral",
  broken: "product-image-surface--neutral",
};

function scoreFromDetails(
  details: ImageQualityEntry | null,
  sourceUrl: string
): { kind: ImageBackgroundKind; confidence: ImageBackgroundAnalysis["confidence"] } {
  if (!details || isDeadImageUrl(sourceUrl)) {
    return { kind: "broken", confidence: "high" };
  }

  if (details.issues?.includes("dead_url") || (details.score ?? 0) <= 0) {
    return { kind: "broken", confidence: "high" };
  }

  const transparency = details.transparencyRatio ?? 0;
  if (details.isTransparent && transparency > 0.12) {
    return { kind: "transparent", confidence: transparency > 0.2 ? "high" : "medium" };
  }

  const whiteBlank = details.whiteBlankRatio ?? 0;
  const borderBright = details.borderBrightRatio ?? 0;
  const emptySpace = details.emptySpaceRatio ?? 0;
  const brightTreatment = getCatalogBrightBgTreatment(sourceUrl);

  if (whiteBlank >= 0.18 || borderBright >= 0.22 || emptySpace >= 0.42) {
    return {
      kind: "mostly_white",
      confidence: whiteBlank >= 0.28 || borderBright >= 0.3 ? "high" : "medium",
    };
  }

  if (brightTreatment === "matte" || brightTreatment === "vignette") {
    return { kind: "mostly_white", confidence: "medium" };
  }

  if (details.issues?.includes("dark_border") || borderBright <= 0.08 && whiteBlank <= 0.02) {
    const fill = details.contentFillRatio ?? 0;
    if (fill >= 0.55 && !details.isScreenshotStyle) {
      return { kind: "mostly_dark", confidence: "medium" };
    }
  }

  return { kind: "photographic", confidence: "medium" };
}

export function classifyImageBackground(
  sourceUrl: string,
  options?: { isProcessedCutout?: boolean }
): ImageBackgroundAnalysis {
  if (!sourceUrl) {
    return {
      kind: "broken",
      surfaceClass: SURFACE_BY_KIND.broken,
      needsSeparation: false,
      confidence: "high",
    };
  }

  if (options?.isProcessedCutout || sourceUrl.startsWith("/processed/")) {
    return {
      kind: "transparent",
      surfaceClass: SURFACE_BY_KIND.transparent,
      needsSeparation: true,
      confidence: "high",
    };
  }

  const details = getImageQualityDetails(sourceUrl);
  const { kind, confidence } = scoreFromDetails(details, sourceUrl);

  return {
    kind,
    surfaceClass: SURFACE_BY_KIND[kind],
    needsSeparation: kind === "mostly_white" || kind === "transparent",
    confidence,
  };
}

export function getSurfaceClassForBackground(
  kind: ImageBackgroundKind,
  isProcessedCutout = false
): string {
  if (isProcessedCutout) return SURFACE_BY_KIND.transparent;
  return SURFACE_BY_KIND[kind];
}
