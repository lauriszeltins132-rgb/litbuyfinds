#!/usr/bin/env node
/**
 * Scores catalog image quality for homepage curation.
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

async function scoreProcessedFile(sharp, filePath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  let bright = 0;
  let total = 0;
  const stepX = Math.max(1, Math.floor(width / 16));
  const stepY = Math.max(1, Math.floor(height / 16));

  for (let x = 0; x < width; x += stepX) {
    for (const y of [0, height - 1]) {
      const i = (y * width + x) * 4;
      total++;
      if (isBrightBorderPixel(data[i], data[i + 1], data[i + 2])) bright++;
    }
  }
  for (let y = 0; y < height; y += stepY) {
    for (const x of [0, width - 1]) {
      const i = (y * width + x) * 4;
      total++;
      if (isBrightBorderPixel(data[i], data[i + 1], data[i + 2])) bright++;
    }
  }

  const borderBrightRatio = total > 0 ? bright / total : 0;
  const meta = await sharp(filePath).metadata();
  const minDim = Math.min(meta.width ?? 0, meta.height ?? 0);

  let score = 100;
  if (borderBrightRatio >= 0.35) score -= 45;
  else if (borderBrightRatio >= 0.2) score -= 25;
  else if (borderBrightRatio >= 0.12) score -= 12;
  if (minDim < 280) score -= 35;
  else if (minDim < 400) score -= 15;

  return {
    score: Math.max(0, Math.min(100, score)),
    borderBrightRatio: Number(borderBrightRatio.toFixed(3)),
    width: meta.width,
    height: meta.height,
  };
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

    let score = 72;
    const issues = [];

    if (skip.has(url)) {
      score -= 40;
      issues.push("damaged_cutout");
    }

    const id = hashUrl(url);
    const file = path.join(processedDir, `${id}.png`);
    if (fs.existsSync(file)) {
      const processed = await scoreProcessedFile(sharp, file);
      score = Math.round((score + processed.score) / 2);
      if (processed.borderBrightRatio >= 0.2) issues.push("white_border");
      if ((processed.width ?? 0) < 400) issues.push("low_resolution");
      scores[url] = { ...processed, score, issues };
    } else {
      score -= 25;
      issues.push("unprocessed");
      scores[url] = { score: Math.max(0, score), issues };
    }

    if (scores[url].score < 70) poor++;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    poorCount: poor,
    urls: scores,
  };

  fs.writeFileSync(outPath, JSON.stringify(payload));
  console.log(
    `Image quality manifest: ${urls.length} URLs, ${poor} below homepage threshold → ${outPath}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
