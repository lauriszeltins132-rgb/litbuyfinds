import { isMattePixel } from "./catalog-matte.mjs";
import { isHollowWhiteGarmentCutout } from "./hollow-cutout.mjs";

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isBackgroundPixel(r, g, b) {
  if (isMattePixel(r, g, b, 12)) return true;
  const min = Math.min(r, g, b);
  return min >= 248;
}

function isProductPixel(r, g, b) {
  return !isBackgroundPixel(r, g, b);
}

/**
 * Score processed cutout artifacts. Higher = worse. Matte-aware for white cards.
 */
export function scoreProcessedCutout(data, width, height) {
  const innerL = Math.floor(width * 0.1);
  const innerR = Math.ceil(width * 0.9);
  const innerT = Math.floor(height * 0.1);
  const innerB = Math.ceil(height * 0.9);

  let productPixels = 0;
  let darkProduct = 0;
  let brightProduct = 0;
  let harshTransitions = 0;
  let speckle = 0;
  let leftProduct = 0;
  let rightProduct = 0;
  let leftDark = 0;
  let rightDark = 0;
  const midX = (innerL + innerR) / 2;

  for (let y = innerT; y < innerB; y++) {
    for (let x = innerL; x < innerR; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (!isProductPixel(r, g, b)) continue;

      productPixels++;
      const lum = luminance(r, g, b);
      if (lum < 72) darkProduct++;
      if (lum > 220) brightProduct++;

      if (x < midX) {
        leftProduct++;
        if (lum < 72) leftDark++;
      } else {
        rightProduct++;
        if (lum < 72) rightDark++;
      }

      for (const [nx, ny] of [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ]) {
        if (nx < innerL || ny < innerT || nx >= innerR || ny >= innerB) continue;
        const ni = (ny * width + nx) * 4;
        const nr = data[ni];
        const ng = data[ni + 1];
        const nb = data[ni + 2];
        if (!isProductPixel(nr, ng, nb)) continue;

        const nLum = luminance(nr, ng, nb);
        if (Math.abs(lum - nLum) > 150) harshTransitions++;
        if (lum > 210 && nLum < 60) speckle++;
        if (lum < 60 && nLum > 210) speckle++;
      }
    }
  }

  if (productPixels < 60) {
    return {
      bad: true,
      score: 1,
      reasons: ["too_few_product_pixels"],
      productPixels,
    };
  }

  const darkRatio = darkProduct / productPixels;
  const brightRatio = brightProduct / productPixels;
  const harshRatio = harshTransitions / Math.max(1, productPixels * 4);
  const speckleRatio = speckle / productPixels;
  const leftDarkRatio = leftProduct > 30 ? leftDark / leftProduct : 0;
  const rightDarkRatio = rightProduct > 30 ? rightDark / rightProduct : 0;
  const splitArtifact =
    leftProduct > 80 &&
    rightProduct > 80 &&
    Math.abs(leftDarkRatio - rightDarkRatio) > 0.42 &&
    (leftDarkRatio > 0.55 || rightDarkRatio > 0.55);

  const hollow = isHollowWhiteGarmentCutout(data, width, height);

  let score = 0;
  const reasons = [];

  if (hollow) {
    score += 0.9;
    reasons.push("hollow_white_garment");
  }
  if (darkRatio > 0.72 && brightRatio < 0.08) {
    score += 0.55;
    reasons.push("thresholded");
  }
  if (harshRatio > 0.14) {
    score += harshRatio * 2.2;
    reasons.push("harsh_edges");
  }
  if (speckleRatio > 0.1) {
    score += speckleRatio * 2.5;
    reasons.push("speckle");
  }
  if (splitArtifact) {
    score += 0.65;
    reasons.push("split_artifact");
  }
  if (darkRatio > 0.45 && speckleRatio > 0.06) {
    score += 0.35;
    reasons.push("noisy_dark");
  }

  const bad =
    hollow ||
    score >= 0.42 ||
    splitArtifact ||
    (darkRatio > 0.78 && harshRatio > 0.08) ||
    speckleRatio > 0.16;

  return {
    bad,
    score,
    reasons,
    productPixels,
    darkRatio,
    brightRatio,
    harshRatio,
    speckleRatio,
    splitArtifact,
    hollow,
  };
}

export function isBadProcessedCutout(data, width, height) {
  return scoreProcessedCutout(data, width, height).bad;
}

/** Apparel types where bg removal often damages the photo. */
export const RISKY_PRODUCT_PATTERN =
  /\b(vest|puffer|down jacket|down vest|goose|moncler|reflective|shiny|quilted|nylon|patent|leather jacket|fur|suede|coat|sweater|hoodie|jacket|parka)\b/i;

export function isRiskyProductName(name) {
  return Boolean(name && RISKY_PRODUCT_PATTERN.test(name));
}
