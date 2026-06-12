#!/usr/bin/env node
/**
 * Removes edge-connected white backgrounds and writes transparent PNGs to public/processed/.
 * Output: src/data/processed-image-map.json
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, "../src/data/products.json");
const outDir = path.join(__dirname, "../public/processed");
const mapPath = path.join(__dirname, "../src/data/processed-image-map.json");

const CONCURRENCY = 14;
const MAX_DIMENSION = 900;
const THRESHOLD = 242;
const MIN_REMOVED = 0.02;
const MAX_REMOVED = 0.94;
const TRIM_PAD = 0.03;
const MATTE = { r: 20, g: 20, b: 24 };

function flattenOntoMatte(data, width, height) {
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const si = i * 4;
    const a = data[si + 3] / 255;
    out[si] = Math.round(data[si] * a + MATTE.r * (1 - a));
    out[si + 1] = Math.round(data[si + 1] * a + MATTE.g * (1 - a));
    out[si + 2] = Math.round(data[si + 2] * a + MATTE.b * (1 - a));
    out[si + 3] = 255;
  }
  return out;
}

function isBackgroundPixel(r, g, b, threshold = THRESHOLD) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= threshold - 22 && max - min <= 44;
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

  const trySeed = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
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

function hashUrl(url) {
  return crypto.createHash("sha256").update(url).digest("hex").slice(0, 20);
}

async function processOne(url, sharp) {
  const id = hashUrl(url);
  const outFile = path.join(outDir, `${id}.png`);
  const publicPath = `/processed/${id}.png`;

  if (fs.existsSync(outFile)) {
    return { url, path: publicPath, cached: true };
  }

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
    return { url, path: null, skipped: true };
  }

  const removed = removeEdgeBackground(pixels, width, height);
  const ratio = removed / (width * height);

  if (ratio < MIN_REMOVED || ratio > MAX_REMOVED) {
    return { url, path: null, skipped: true };
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

  const flat = flattenOntoMatte(
    flattened.data,
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
    .png({ compressionLevel: 9, effort: 7 })
    .toFile(outFile);
  return { url, path: publicPath };
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
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  fs.mkdirSync(outDir, { recursive: true });

  const allUrls = [...new Set(products.map((p) => p.image).filter(Boolean))];

  console.log(`Scanning ${allUrls.length} unique image URLs for white backgrounds...`);

  let ok = 0;
  let skipped = 0;
  let failed = 0;
  let cached = 0;
  const map = {};

  const existing = fs.existsSync(mapPath)
    ? JSON.parse(fs.readFileSync(mapPath, "utf8")).urls ?? {}
    : {};
  Object.assign(map, existing);

  await mapPool(allUrls, CONCURRENCY, async (url) => {
    try {
      const result = await processOne(url, sharp);
      if (result.path) {
        map[url] = result.path;
        if (result.cached) cached++;
        else ok++;
      } else {
        skipped++;
      }
    } catch (error) {
      failed++;
      if (failed <= 5) {
        console.warn(`  fail: ${url.slice(-48)} — ${error.message}`);
      }
    }
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    processed: Object.keys(map).length,
    urls: map,
  };

  fs.writeFileSync(mapPath, JSON.stringify(payload));
  console.log(
    `Done: ${ok} new, ${cached} cached, ${skipped} skipped, ${failed} failed → ${mapPath}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
