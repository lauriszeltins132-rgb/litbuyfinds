#!/usr/bin/env node
/**
 * Scans every catalog image and classifies bright-background treatment.
 * Output: src/data/bright-bg-manifest.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, "../src/data/products.json");
const outPath = path.join(__dirname, "../src/data/bright-bg-manifest.json");

const CONCURRENCY = 16;
const SAMPLE = 96;

function isBrightPixel(r, g, b, threshold = 228) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= threshold - 24 && max - min <= 48;
}

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

async function classifyImage(url, sharp) {
  const res = await fetch(url, {
    headers: { "User-Agent": "LitBuyFinds-ImageAudit/1.0" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const { data, info } = await sharp(buffer)
    .resize(SAMPLE, SAMPLE, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const border = [];
  const center = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const edge =
        x === 0 ||
        y === 0 ||
        x === width - 1 ||
        y === height - 1 ||
        x < width * 0.08 ||
        y < height * 0.08 ||
        x > width * 0.92 ||
        y > height * 0.92;
      const inner =
        x > width * 0.28 &&
        x < width * 0.72 &&
        y > height * 0.28 &&
        y < height * 0.72;

      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (edge) border.push(r, g, b);
      if (inner) center.push(r, g, b);
    }
  }

  let borderBright = 0;
  for (let i = 0; i < border.length; i += 3) {
    if (isBrightPixel(border[i], border[i + 1], border[i + 2])) borderBright++;
  }
  const borderRatio = borderBright / (border.length / 3);

  let centerLum = 0;
  for (let i = 0; i < center.length; i += 3) {
    centerLum += luminance(center[i], center[i + 1], center[i + 2]);
  }
  const avgCenterLum = center.length ? centerLum / (center.length / 3) : 0;

  if (borderRatio < 0.28) {
    return "none";
  }

  if (avgCenterLum >= 182 && borderRatio >= 0.4) {
    return "vignette";
  }

  return "matte";
}

async function mapPool(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
}

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("sharp is required to generate bright-bg manifest");
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const urls = [...new Set(products.map((p) => p.image).filter(Boolean))];

  console.log(`Scanning ${urls.length} unique image URLs...`);

  const manifest = {};
  let failed = 0;
  let matte = 0;
  let vignette = 0;

  await mapPool(urls, CONCURRENCY, async (url) => {
    try {
      const treatment = await classifyImage(url, sharp);
      manifest[url] = treatment;
      if (treatment === "matte") matte++;
      if (treatment === "vignette") vignette++;
    } catch {
      failed++;
    }
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    scanned: urls.length,
    failed,
    matte,
    vignette,
    urls: manifest,
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 0));
  console.log(
    `Bright-bg manifest: ${matte} matte, ${vignette} vignette, ${failed} failed → ${outPath}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
