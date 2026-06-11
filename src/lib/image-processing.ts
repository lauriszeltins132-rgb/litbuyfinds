import {
  getCachedImage,
  getCachedImageAsync,
  setCachedImage,
} from "./image-cache";
import { hasPlausibleImageDimensions, validateImageUrl } from "./image-url";

const MAX_DIMENSION = 900;
const MIN_BACKGROUND_RATIO = 0.02;
const MAX_BACKGROUND_RATIO = 0.78;

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

/**
 * Remove only edge-connected near-white background pixels.
 * Interior light fabric (sweaters, vests, etc.) is left untouched.
 */
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

    const neighbors: [number, number][] = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    for (const [nx, ny] of neighbors) {
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

/** Returns true only when the URL resolves to a real, usable image. */
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

export async function removeWhiteBackground(
  imageUrl: string,
  threshold = 245
): Promise<string> {
  const { valid, normalized } = validateImageUrl(imageUrl);
  if (!valid) {
    throw new Error("Invalid image URL");
  }

  const cached =
    getCachedImage(normalized) ?? (await getCachedImageAsync(normalized));
  if (cached) return cached;

  const img = await loadImage(normalized);

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
    const removed = removeEdgeBackground(
      imageData.data,
      width,
      height,
      threshold
    );
    const ratio = removed / (width * height);

    if (ratio < MIN_BACKGROUND_RATIO || ratio > MAX_BACKGROUND_RATIO) {
      setCachedImage(normalized, normalized);
      return normalized;
    }

    ctx.putImageData(imageData, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    setCachedImage(normalized, dataUrl);
    return dataUrl;
  } catch {
    throw new Error("Canvas tainted");
  }
}
