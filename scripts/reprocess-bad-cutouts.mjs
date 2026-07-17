#!/usr/bin/env node
/**
 * Re-process cutouts that failed quality checks using gentler background removal.
 * Only targets bad cutouts where the CDN original is unavailable.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { flattenPixelsOntoMatte } from "./lib/catalog-matte.mjs";
import { scoreProcessedCutout } from "./lib/cutout-quality.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mapPath = path.join(root, "src/data/processed-image-map.json");
const damagedPath = path.join(root, "src/data/damaged-processed-manifest.json");
const deadPath = path.join(root, "src/data/dead-image-urls.json");
const outDir = path.join(root, "public/processed");

const CONCURRENCY = 10;
const MAX_DIMENSION = 900;
const THRESHOLD = 248;
const MIN_REMOVED = 0.015;
const MAX_REMOVED = 0.9;
const TRIM_PAD = 0.03;

function hashUrl(url) {
  return crypto.createHash("sha256").update(url).digest("hex").slice(0, 20);
}

function isBackgroundPixel(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= THRESHOLD - 18 && max - min <= 40;
}

function borderLooksBright(data, width, height) {
  let bright = 0;
  let total = 0;
  const stepX = Math.max(1, Math.floor(width / 20));
  const stepY = Math.max(1, Math.floor(height / 20));

  for (let x = 0; x < width; x += stepX) {
    for (const y of [0, height - 1]) {
      const i = (y * width + x) * 4;
      total++;
      if (isBackgroundPixel(data[i], data[i + 1], data[i + 2])) bright++;
    }
  }
  for (let y = 0; y < height; y += stepY) {
    for (const x of [0, width - 1]) {
      const i = (y * width + x) * 4;
      total++;
      if (isBackgroundPixel(data[i], data[i + 1], data[i + 2])) bright++;
    }
  }

  return total > 0 && bright / total >= 0.22;
}

function removeEdgeBackground(data, width, height) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const stack = [];

  const protectedCenter = (x, y) => {
    const cx0 = Math.floor(width * 0.18);
    const cx1 = Math.ceil(width * 0.82);
    const cy0 = Math.floor(height * 0.18);
    const cy1 = Math.ceil(height * 0.82);
    return x >= cx0 && x < cx1 && y >= cy0 && y < cy1;
  };

  const trySeed = (x, y) => {
    const idx = y * width + x;
    if (visited[idx] || protectedCenter(x, y)) return;
    const i = idx * 4;
    if (isBackgroundPixel(data[i], data[i + 1], data[i + 2])) {
      visited[idx] = 1;
      stack.push(idx);
    }
  };

  for (let x = 0; x < width; x++) {
    trySeed(x, 0);
    trySeed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y);
    trySeed(width - 1, y);
  }

  while (stack.length > 0) {
    const idx = stack.pop();
    const x = idx % width;
    const y = (idx / width) | 0;

    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      if (protectedCenter(nx, ny)) continue;
      const nidx = ny * width + nx;
      if (visited[nidx]) continue;
      const i = nidx * 4;
      if (isBackgroundPixel(data[i], data[i + 1], data[i + 2])) {
        visited[nidx] = 1;
        stack.push(nidx);
      }
    }
  }

  let removed = 0;
  for (let idx = 0; idx < total; idx++) {
    if (!visited[idx]) continue;
    removed++;
    data[idx * 4 + 3] = 0;
  }

  return removed;
}

function getContentBounds(data, width, height) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha < 12) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX <= minX || maxY <= minY) return null;

  const padX = Math.round((maxX - minX) * TRIM_PAD);
  const padY = Math.round((maxY - minY) * TRIM_PAD);

  return {
    left: Math.max(0, minX - padX),
    top: Math.max(0, minY - padY),
    width: Math.min(width, maxX - minX + 1 + padX * 2),
    height: Math.min(height, maxY - minY + 1 + padY * 2),
  };
}

async function processOne(url, sharp) {
  const id = hashUrl(url);
  const outFile = path.join(outDir, `${id}.png`);

  const res = await fetch(url, {
    headers: { "User-Agent": "LitBuyFinds-ImageProcessor/1.0" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const input = Buffer.from(await res.arrayBuffer());
  const base = sharp(input).rotate().resize(MAX_DIMENSION, MAX_DIMENSION, {
    fit: "inside",
    withoutEnlargement: true,
  });

  const { data, info } = await base
    .clone()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = new Uint8ClampedArray(data);

  if (!borderLooksBright(pixels, width, height)) {
    return { url, skipped: true };
  }

  const removed = removeEdgeBackground(pixels, width, height);
  const ratio = removed / (width * height);

  if (ratio < MIN_REMOVED || ratio > MAX_REMOVED) {
    return { url, skipped: true };
  }

  const bounds = getContentBounds(pixels, width, height);
  let pipeline = sharp(Buffer.from(pixels), {
    raw: { width, height, channels: 4 },
  });

  if (
    bounds &&
    bounds.width > 1 &&
    bounds.height > 1 &&
    bounds.left + bounds.width <= width &&
    bounds.top + bounds.height <= height
  ) {
    pipeline = pipeline.extract(bounds);
  }

  const flattened = await pipeline
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const flat = flattenPixelsOntoMatte(
    flattened.data,
    flattened.info.width,
    flattened.info.height
  );

  const quality = scoreProcessedCutout(
    flat,
    flattened.info.width,
    flattened.info.height
  );

  await sharp(flat, {
    raw: {
      width: flattened.info.width,
      height: flattened.info.height,
      channels: 4,
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(outFile);

  return { url, improved: !quality.bad, quality };
}

async function mapPool(items, limit, fn) {
  const results = [];
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
  const sharp = (await import("sharp")).default;
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8")).urls ?? {};
  const damaged = JSON.parse(fs.readFileSync(damagedPath, "utf8"));
  const deadUrls = new Set(
    (JSON.parse(fs.readFileSync(deadPath, "utf8")).urls ?? [])
  );
  const badCutouts = new Set(damaged.badCutoutUrls ?? []);

  const targets = [...badCutouts].filter((url) => deadUrls.has(url) && map[url]);
  console.log(`Re-processing ${targets.length} bad cutouts with dead CDN...`);

  let improved = 0;
  let failed = 0;

  await mapPool(targets, CONCURRENCY, async (url, index) => {
    try {
      const result = await processOne(url, sharp);
      if (result.improved) improved++;
      if ((index + 1) % 50 === 0) {
        console.log(`  ${index + 1}/${targets.length}...`);
      }
      return result;
    } catch (error) {
      failed++;
      return { url, error: error.message };
    }
  });

  console.log(`Done: ${improved} improved, ${failed} failed, ${targets.length} total`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
