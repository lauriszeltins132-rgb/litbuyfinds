#!/usr/bin/env node
/**
 * Scores catalog image quality for card curation and display rules.
 * Output: src/data/image-quality-manifest.json
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, "../src/data/products.json");
const mapPath = path.join(__dirname, "../src/data/processed-image-map.json");
const skipPath = path.join(__dirname, "../src/data/skip-cutout-urls.json");
const deadPath = path.join(__dirname, "../src/data/dead-image-urls.json");
const processedDir = path.join(__dirname, "../public/processed");
const outPath = path.join(__dirname, "../src/data/image-quality-manifest.json");

function hashUrl(url) {
  return crypto.createHash("sha256").update(url).digest("hex").slice(0, 20);
}

function isBrightBorderPixel(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= 200 && max - min <= 55;
}

function analyzePixels(data, width, height) {
  let bright = 0;
  let borderTotal = 0;
  const stepX = Math.max(1, Math.floor(width / 16));
  const stepY = Math.max(1, Math.floor(height / 16));

  for (let x = 0; x < width; x += stepX) {
    for (const y of [0, height - 1]) {
      const i = (y * width + x) * 4;
      borderTotal++;
      if (isBrightBorderPixel(data[i], data[i + 1], data[i + 2])) bright++;
    }
  }
  for (let y = 0; y < height; y += stepY) {
    for (const x of [0, width - 1]) {
      const i = (y * width + x) * 4;
      borderTotal++;
      if (isBrightBorderPixel(data[i], data[i + 1], data[i + 2])) bright++;
    }
  }

  const borderBrightRatio = borderTotal > 0 ? bright / borderTotal : 0;

  let transparent = 0;
  let opaque = 0;
  let brightBlank = 0;
  let sampledOpaque = 0;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  const sampleStep = Math.max(1, Math.floor((width * height) / 120_000));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (idx % sampleStep !== 0) continue;
      const i = idx * 4;
      const alpha = data[i + 3];
      if (alpha < 24) {
        transparent++;
      } else {
        opaque++;
        sampledOpaque++;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (isBrightBorderPixel(r, g, b)) brightBlank++;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const sampled = transparent + opaque;
  const transparencyRatio =
    sampled > 0 ? Number((transparent / sampled).toFixed(3)) : 0;
  const isTransparent = transparencyRatio > 0.12;

  let contentFillRatio = 0.5;
  if (maxX > minX && maxY > minY) {
    const contentW = maxX - minX + 1;
    const contentH = maxY - minY + 1;
    contentFillRatio = Number(
      Math.min(1, (contentW * contentH) / (width * height)).toFixed(3)
    );
  }
  const emptySpaceRatio = Number((1 - contentFillRatio).toFixed(3));
  const aspectRatio = Number((width / Math.max(height, 1)).toFixed(3));
  const whiteBlankRatio =
    sampledOpaque > 0
      ? Number((brightBlank / sampledOpaque).toFixed(3))
      : Number(emptySpaceRatio.toFixed(3));

  const isScreenshotStyle =
    (aspectRatio > 1.7 && (borderBrightRatio > 0.14 || whiteBlankRatio > 0.38)) ||
    (aspectRatio < 0.5 && emptySpaceRatio > 0.48) ||
    (contentFillRatio < 0.3 && borderBrightRatio > 0.1);

  return {
    borderBrightRatio: Number(borderBrightRatio.toFixed(3)),
    width,
    height,
    aspectRatio,
    contentFillRatio,
    transparencyRatio,
    emptySpaceRatio,
    whiteBlankRatio,
    isTransparent,
    isScreenshotStyle,
    needsMatte: isTransparent && borderBrightRatio < 0.15,
    enhance: borderBrightRatio > 0.08 && contentFillRatio < 0.65,
  };
}

function scoreMetrics(metrics, { hasProcessed, inSkip }) {
  const issues = [];
  let score = 100;
  const minDim = Math.min(metrics.width ?? 0, metrics.height ?? 0);

  if (inSkip) {
    score -= 38;
    issues.push("damaged_cutout");
  }

  if (metrics.borderBrightRatio >= 0.35) {
    score -= 42;
    issues.push("white_border");
  } else if (metrics.borderBrightRatio >= 0.2) {
    score -= 24;
    issues.push("white_border");
  } else if (metrics.borderBrightRatio >= 0.12) {
    score -= 10;
  }

  if (minDim < 180) {
    score -= 48;
    issues.push("low_resolution");
  } else if (minDim < 280) {
    score -= 32;
    issues.push("low_resolution");
  } else if (minDim < 400) {
    score -= 14;
  } else if (minDim >= 640) {
    score += 4;
  }

  if (metrics.contentFillRatio < 0.22) {
    score -= 36;
    issues.push("tiny_product");
  } else if (metrics.contentFillRatio < 0.38) {
    score -= 22;
    issues.push("excessive_empty_space");
  } else if (metrics.contentFillRatio < 0.5) {
    score -= 10;
  } else if (metrics.contentFillRatio >= 0.62) {
    score += 6;
  }

  const ar = metrics.aspectRatio ?? 1;
  if (ar < 0.38 || ar > 2.4) {
    score -= 18;
    issues.push("extreme_aspect_ratio");
  } else if (ar < 0.55 || ar > 1.85) {
    score -= 6;
  }

  if (metrics.isTransparent && !hasProcessed) {
    score -= 14;
    issues.push("transparent_cutout");
  }

  if (!hasProcessed) {
    score -= 18;
    issues.push("unprocessed");
  }

  if (metrics.isScreenshotStyle) {
    score -= 40;
    issues.push("screenshot_style");
  }

  if (metrics.whiteBlankRatio >= 0.55) {
    score -= 38;
    issues.push("white_blank");
  } else if (metrics.whiteBlankRatio >= 0.4) {
    score -= 28;
    issues.push("white_blank");
  } else if (metrics.whiteBlankRatio >= 0.3) {
    score -= 14;
  }

  return {
    ...metrics,
    score: Math.max(0, Math.min(100, Math.round(score))),
    issues,
  };
}

async function scoreProcessedFile(sharp, filePath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const metrics = analyzePixels(data, info.width, info.height);
  return scoreMetrics(metrics, { hasProcessed: true, inSkip: false });
}

async function main() {
  const sharp = (await import("sharp")).default;
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8")).urls ?? {};
  const skip = new Set(
    (JSON.parse(fs.readFileSync(skipPath, "utf8")).urls ?? [])
  );
  const dead = new Set(
    (JSON.parse(fs.readFileSync(deadPath, "utf8")).urls ?? [])
  );

  const urls = [...new Set(products.map((p) => p.image).filter(Boolean))];
  const scores = {};
  let poor = 0;

  for (const url of urls) {
    if (dead.has(url)) {
      scores[url] = { score: 0, issues: ["dead_url"] };
      poor++;
      continue;
    }

    const id = hashUrl(url);
    const file = path.join(processedDir, `${id}.png`);
    const hasProcessed = Boolean(map[url]) && fs.existsSync(file);

    if (fs.existsSync(file)) {
      const processed = await scoreProcessedFile(sharp, file);
      if (skip.has(url)) {
        processed.score = Math.max(0, processed.score - 20);
        processed.issues.push("damaged_cutout");
      }
      scores[url] = processed;
    } else {
      const fallback = scoreMetrics(
        {
          borderBrightRatio: 0.08,
          width: 480,
          height: 480,
          aspectRatio: 1,
          contentFillRatio: 0.45,
          transparencyRatio: 0,
          emptySpaceRatio: 0.55,
          whiteBlankRatio: 0.42,
          isTransparent: false,
          isScreenshotStyle: false,
          needsMatte: false,
          enhance: true,
        },
        { hasProcessed: false, inSkip: skip.has(url) }
      );
      scores[url] = fallback;
    }

    if (scores[url].score < CARD_DISPLAY_MIN) poor++;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    poorCount: poor,
    cardDisplayMinScore: CARD_DISPLAY_MIN,
    urls: scores,
  };

  fs.writeFileSync(outPath, JSON.stringify(payload));
  console.log(
    `Image quality manifest: ${urls.length} URLs, ${poor} below card threshold (${CARD_DISPLAY_MIN}) → ${outPath}`
  );
}

const CARD_DISPLAY_MIN = 42;

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
