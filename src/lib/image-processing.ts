import {
  getCatalogBrightBgTreatment,
  type BrightBgTreatment,
} from "./bright-bg";
import {
  getCachedImage,
  getCachedImageAsync,
  setCachedImage,
  type ProcessedImageEntry,
} from "./image-cache";
import { hasPlausibleImageDimensions, validateImageUrl } from "./image-url";

const MAX_DIMENSION = 1200;
const MIN_BACKGROUND_RATIO = 0.02;
const MAX_BACKGROUND_RATIO = 0.92;
const TRIM_PADDING_RATIO = 0.04;

function isBackgroundPixel(
  r: number,
  g: number,
  b: number,
  threshold: number
): boolean {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const spread = max - min;
  return min >= threshold - 20 && spread <= 40;
}

function cornersLookWhite(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number
): boolean {
  const points: [number, number][] = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let whiteCorners = 0;

  for (const [x, y] of points) {
    const i = (y * width + x) * 4;
    if (isBackgroundPixel(data[i], data[i + 1], data[i + 2], threshold)) {
      whiteCorners += 1;
    }
  }

  return whiteCorners >= 2;
}

function borderLooksBright(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number
): boolean {
  const samples: number[] = [];
  const stepX = Math.max(1, Math.floor(width / 24));
  const stepY = Math.max(1, Math.floor(height / 24));

  for (let x = 0; x < width; x += stepX) {
    for (const y of [0, height - 1]) {
      const i = (y * width + x) * 4;
      samples.push(data[i], data[i + 1], data[i + 2]);
    }
  }
  for (let y = 0; y < height; y += stepY) {
    for (const x of [0, width - 1]) {
      const i = (y * width + x) * 4;
      samples.push(data[i], data[i + 1], data[i + 2]);
    }
  }

  if (samples.length === 0) return false;

  let bright = 0;
  for (let i = 0; i < samples.length; i += 3) {
    if (isBackgroundPixel(samples[i], samples[i + 1], samples[i + 2], threshold)) {
      bright++;
    }
  }

  return bright / (samples.length / 3) >= 0.58;
}

function centerLooksBright(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number
): boolean {
  const x0 = Math.floor(width * 0.28);
  const x1 = Math.ceil(width * 0.72);
  const y0 = Math.floor(height * 0.28);
  const y1 = Math.ceil(height * 0.72);
  let bright = 0;
  let total = 0;

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 4;
      total++;
      if (isBackgroundPixel(data[i], data[i + 1], data[i + 2], threshold)) {
        bright++;
      }
    }
  }

  return total > 0 && bright / total >= 0.52;
}

function resolveTreatment(
  hasBrightBackground: boolean,
  lightOnLight: boolean,
  catalogTreatment: BrightBgTreatment
): BrightBgTreatment {
  if (!hasBrightBackground) return "none";
  if (lightOnLight || catalogTreatment === "vignette") return "vignette";
  if (catalogTreatment === "matte") return "matte";
  return "matte";
}

function removeEdgeBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number
): number {
  const total = width * height;
  const visited = new Uint8Array(total);
  const stack: number[] = [];

  const trySeed = (x: number, y: number) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (isBackgroundPixel(data[i], data[i + 1], data[i + 2], threshold)) {
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
    const idx = stack.pop()!;
    const x = idx % width;
    const y = (idx / width) | 0;

    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ] as [number, number][]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const nidx = ny * width + nx;
      if (visited[nidx]) continue;
      const i = nidx * 4;
      if (isBackgroundPixel(data[i], data[i + 1], data[i + 2], threshold)) {
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

function getContentBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number
) {
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

  const padX = Math.round((maxX - minX) * TRIM_PADDING_RATIO);
  const padY = Math.round((maxY - minY) * TRIM_PADDING_RATIO);

  return {
    x: Math.max(0, minX - padX),
    y: Math.max(0, minY - padY),
    w: Math.min(width, maxX - minX + 1 + padX * 2),
    h: Math.min(height, maxY - minY + 1 + padY * 2),
  };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

const PROBE_TIMEOUT_MS = 12_000;

export function probeImageLoad(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = window.setTimeout(() => {
      img.src = "";
      resolve(false);
    }, PROBE_TIMEOUT_MS);

    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      window.clearTimeout(timer);
      resolve(
        hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)
      );
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      resolve(false);
    };
    img.src = url;
  });
}

function cacheResult(
  normalized: string,
  src: string,
  hasBrightBackground: boolean,
  processedToPng: boolean,
  treatment: BrightBgTreatment
): ProcessedImageEntry {
  const entry: ProcessedImageEntry = {
    src,
    hasBrightBackground,
    processedToPng,
    treatment: processedToPng ? "none" : treatment,
  };
  setCachedImage(normalized, entry);
  return entry;
}

export async function processProductImage(
  imageUrl: string,
  threshold = 245
): Promise<ProcessedImageEntry> {
  const { valid, normalized } = validateImageUrl(imageUrl);
  if (!valid) {
    throw new Error("Invalid image URL");
  }

  const catalogTreatment = getCatalogBrightBgTreatment(normalized);

  const cached =
    getCachedImage(normalized) ?? (await getCachedImageAsync(normalized));
  if (cached) return cached;

  let img: HTMLImageElement;
  try {
    img = await loadImage(normalized);
  } catch {
    if (catalogTreatment !== "none") {
      return cacheResult(
        normalized,
        normalized,
        true,
        false,
        catalogTreatment
      );
    }
    throw new Error("Image load failed");
  }

  let width = img.naturalWidth;
  let height = img.naturalHeight;

  if (!width || !height) {
    throw new Error("Invalid image dimensions");
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.drawImage(img, 0, 0, width, height);

  try {
    const imageData = ctx.getImageData(0, 0, width, height);

    const hasBrightBackground =
      catalogTreatment !== "none" ||
      cornersLookWhite(imageData.data, width, height, threshold) ||
      borderLooksBright(imageData.data, width, height, threshold);
    const lightOnLight =
      hasBrightBackground &&
      centerLooksBright(imageData.data, width, height, threshold);
    const treatment = resolveTreatment(
      hasBrightBackground,
      lightOnLight,
      catalogTreatment
    );

    if (!hasBrightBackground) {
      return cacheResult(normalized, normalized, false, false, "none");
    }

    if (treatment === "vignette") {
      return cacheResult(normalized, normalized, true, false, "vignette");
    }

    const removed = removeEdgeBackground(
      imageData.data,
      width,
      height,
      threshold
    );
    const ratio = removed / (width * height);

    if (ratio < MIN_BACKGROUND_RATIO || ratio > MAX_BACKGROUND_RATIO) {
      return cacheResult(normalized, normalized, true, false, treatment);
    }

    const bounds = getContentBounds(imageData.data, width, height);
    ctx.putImageData(imageData, 0, 0);

    if (bounds && bounds.w < width * 0.98 && bounds.h < height * 0.98) {
      const trimmed = ctx.getImageData(bounds.x, bounds.y, bounds.w, bounds.h);
      canvas.width = bounds.w;
      canvas.height = bounds.h;
      ctx.putImageData(trimmed, 0, 0);
    }

    const dataUrl = canvas.toDataURL("image/png");
    return cacheResult(normalized, dataUrl, true, true, "none");
  } catch {
    if (catalogTreatment !== "none") {
      return cacheResult(
        normalized,
        normalized,
        true,
        false,
        catalogTreatment
      );
    }
    throw new Error("Canvas tainted");
  }
}

/** @deprecated Use processProductImage */
export async function removeWhiteBackground(
  imageUrl: string,
  threshold = 245
): Promise<string> {
  const result = await processProductImage(imageUrl, threshold);
  return result.src;
}
