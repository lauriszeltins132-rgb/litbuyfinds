#!/usr/bin/env node
/**
 * Second-pass processor for catalog URLs not yet in processed-image-map.
 * Uses relaxed white-bg removal + corner-chroma fallback. Does NOT touch existing files.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, "../src/data/products.json");
const outDir = path.join(__dirname, "../public/processed");
const mapPath = path.join(__dirname, "../src/data/processed-image-map.json");

const CONCURRENCY = 12;
const MAX_DIMENSION = 900;
const MATTE = { r: 20, g: 20, b: 24 };

function hashUrl(url) {
  return crypto.createHash("sha256").update(url).digest("hex").slice(0, 20);
}

function flattenOntoMatte(data, width, height) {
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const si = i * 4;
    const a = data[si + 3];
    if (a >= 24) {
      out[si] = data[si];
      out[si + 1] = data[si + 1];
      out[si + 2] = data[si + 2];
      out[si + 3] = 255;
    } else {
      out[si] = MATTE.r;
      out[si + 1] = MATTE.g;
      out[si + 2] = MATTE.b;
      out[si + 3] = 255;
    }
  }
  return out;
}

function colorDist(r1, g1, b1, r2, g2, b2) {
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

function isBgPixel(r, g, b, threshold) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= threshold - 28 && max - min <= 52;
}

function cornerAvg(data, width, height) {
  const pts = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let r = 0,
    g = 0,
    b = 0;
  for (const [x, y] of pts) {
    const i = (y * width + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return { r: r / 4, g: g / 4, b: b / 4 };
}

function hasRemovableBackground(data, width, height) {
  const pts = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let whiteCorners = 0;
  for (const [x, y] of pts) {
    const i = (y * width + x) * 4;
    if (isBgPixel(data[i], data[i + 1], data[i + 2], 235)) whiteCorners++;
  }
  if (whiteCorners >= 1) return true;

  let bright = 0;
  let total = 0;
  const stepX = Math.max(1, Math.floor(width / 24));
  const stepY = Math.max(1, Math.floor(height / 24));
  for (let x = 0; x < width; x += stepX) {
    for (const y of [0, height - 1]) {
      const i = (y * width + x) * 4;
      total++;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      if (lum > 198) bright++;
    }
  }
  for (let y = 0; y < height; y += stepY) {
    for (const x of [0, width - 1]) {
      const i = (y * width + x) * 4;
      total++;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      if (lum > 198) bright++;
    }
  }
  return total > 0 && bright / total >= 0.18;
}

function removeEdgeBg(data, width, height, threshold) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const stack = [];

  const seed = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (isBgPixel(data[i], data[i + 1], data[i + 2], threshold)) {
      visited[idx] = 1;
      stack.push(idx);
    }
  };

  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seed(0, y);
    seed(width - 1, y);
  }

  while (stack.length) {
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
      if (isBgPixel(data[i], data[i + 1], data[i + 2], threshold)) {
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

function replaceEdgeBgWithMatte(data, width, height, threshold) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const stack = [];

  const seed = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (isBgPixel(data[i], data[i + 1], data[i + 2], threshold)) {
      visited[idx] = 1;
      stack.push(idx);
    }
  };

  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seed(0, y);
    seed(width - 1, y);
  }

  while (stack.length) {
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
      if (isBgPixel(data[i], data[i + 1], data[i + 2], threshold)) {
        visited[nidx] = 1;
        stack.push(nidx);
      }
    }
  }

  let replaced = 0;
  for (let idx = 0; idx < total; idx++) {
    if (!visited[idx]) continue;
    replaced++;
    const i = idx * 4;
    data[i] = MATTE.r;
    data[i + 1] = MATTE.g;
    data[i + 2] = MATTE.b;
    data[i + 3] = 255;
  }
  return replaced;
}

function chromaFromCorners(data, width, height) {
  const bg = cornerAvg(data, width, height);
  const tol = 42;
  const total = width * height;
  const visited = new Uint8Array(total);
  const stack = [];

  const seed = (x, y) => {
    const idx = y * width + x;
    const i = idx * 4;
    if (
      colorDist(data[i], data[i + 1], data[i + 2], bg.r, bg.g, bg.b) <= tol
    ) {
      visited[idx] = 1;
      stack.push(idx);
    }
  };

  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seed(0, y);
    seed(width - 1, y);
  }

  while (stack.length) {
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
      if (
        colorDist(data[i], data[i + 1], data[i + 2], bg.r, bg.g, bg.b) <= tol
      ) {
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

function contentRatio(data, width, height) {
  let opaque = 0;
  for (let i = 0; i < width * height; i++) {
    if (data[i * 4 + 3] > 40) opaque++;
  }
  return opaque / (width * height);
}

function getBounds(data, width, height) {
  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] < 40) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX <= minX) return null;
  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.03);
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const cropW = maxX - minX + 1 + pad * 2;
  const cropH = maxY - minY + 1 + pad * 2;
  return {
    left,
    top,
    width: Math.min(width - left, cropW),
    height: Math.min(height - top, cropH),
  };
}

async function writeProcessed(sharp, pixels, width, height, outFile) {
  const bounds = getBounds(pixels, width, height);
  let pipeline = sharp(Buffer.from(pixels), {
    raw: { width, height, channels: 4 },
  });
  if (
    bounds &&
    bounds.width > 2 &&
    bounds.height > 2 &&
    bounds.left + bounds.width <= width &&
    bounds.top + bounds.height <= height
  ) {
    pipeline = pipeline.extract(bounds);
  }
  const flat = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = flattenOntoMatte(flat.data, flat.info.width, flat.info.height);
  await sharp(out, {
    raw: { width: flat.info.width, height: flat.info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(outFile);
}

async function processOne(url, sharp) {
  const id = hashUrl(url);
  const outFile = path.join(outDir, `${id}.png`);
  if (fs.existsSync(outFile)) return null;

  const res = await fetch(url, {
    headers: { "User-Agent": "LitBuyFinds-ImageProcessor/3.0" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const input = Buffer.from(await res.arrayBuffer());
  const { data, info } = await sharp(input)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = new Uint8ClampedArray(data);

  const cutoutAttempts = [
    () => {
      const copy = new Uint8ClampedArray(pixels);
      const removed = removeEdgeBg(copy, width, height, 242);
      const ratio = removed / (width * height);
      if (ratio < 0.008 || ratio > 0.96) return null;
      if (contentRatio(copy, width, height) < 0.06) return null;
      return copy;
    },
    () => {
      const copy = new Uint8ClampedArray(pixels);
      const removed = removeEdgeBg(copy, width, height, 228);
      const ratio = removed / (width * height);
      if (ratio < 0.005 || ratio > 0.97) return null;
      if (contentRatio(copy, width, height) < 0.05) return null;
      return copy;
    },
    () => {
      const copy = new Uint8ClampedArray(pixels);
      chromaFromCorners(copy, width, height);
      if (contentRatio(copy, width, height) < 0.05) return null;
      return copy;
    },
    () => {
      const copy = new Uint8ClampedArray(pixels);
      const removed = removeEdgeBg(copy, width, height, 215);
      const ratio = removed / (width * height);
      if (ratio < 0.003 || ratio > 0.985) return null;
      if (contentRatio(copy, width, height) < 0.04) return null;
      return copy;
    },
  ];

  for (const attempt of cutoutAttempts) {
    const result = attempt();
    if (result) {
      await writeProcessed(sharp, result, width, height, outFile);
      return `/processed/${id}.png`;
    }
  }

  const matteAttempts = [248, 242, 235, 228];
  for (const threshold of matteAttempts) {
    const copy = new Uint8ClampedArray(pixels);
    const replaced = replaceEdgeBgWithMatte(copy, width, height, threshold);
    const ratio = replaced / (width * height);
    if (ratio < 0.008 || ratio > 0.98) continue;
    await writeProcessed(sharp, copy, width, height, outFile);
    return `/processed/${id}.png`;
  }

  await writeProcessed(sharp, new Uint8ClampedArray(pixels), width, height, outFile);
  return `/processed/${id}.png`;
}

async function mapPool(items, limit, fn) {
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: limit }, () => worker()));
}

async function main() {
  const sharp = (await import("sharp")).default;
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  const existing = map.urls ?? {};

  const pending = [
    ...new Set(products.map((p) => p.image).filter(Boolean)),
  ].filter((url) => !existing[url]);

  console.log(`Second pass: ${pending.length} URLs without processed images`);

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  await mapPool(pending, CONCURRENCY, async (url) => {
    try {
      const path = await processOne(url, sharp);
      if (path) {
        existing[url] = path;
        ok++;
        if (ok % 50 === 0) console.log(`  processed ${ok}...`);
      } else {
        skipped++;
      }
    } catch (error) {
      failed++;
      if (failed <= 8) {
        console.warn(`  fail: ${url.slice(-52)} — ${error.message}`);
      }
    }
  });

  map.generatedAt = new Date().toISOString();
  map.processed = Object.keys(existing).length;
  map.urls = existing;
  fs.writeFileSync(mapPath, JSON.stringify(map));

  console.log(`Done: ${ok} new, ${skipped} skipped, ${failed} failed → total ${map.processed}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
