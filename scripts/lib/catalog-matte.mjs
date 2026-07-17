/** Opaque matte behind processed cutouts — must match --color-background in globals.css */
export const CATALOG_MATTE = { r: 242, g: 241, b: 237 }; // #F2F1ED

export const KNOWN_MATTES = [
  { r: 20, g: 20, b: 24 }, // legacy dark #141418
  { r: 238, g: 240, b: 232 }, // previous sage #EEF0E8
  CATALOG_MATTE,
];

export function isMattePixel(r, g, b, tolerance = 10) {
  return KNOWN_MATTES.some(
    (matte) =>
      Math.abs(r - matte.r) <= tolerance &&
      Math.abs(g - matte.g) <= tolerance &&
      Math.abs(b - matte.b) <= tolerance
  );
}

export function flattenPixelsOntoMatte(data, width, height, matte = CATALOG_MATTE) {
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
      out[si] = matte.r;
      out[si + 1] = matte.g;
      out[si + 2] = matte.b;
      out[si + 3] = 255;
    }
  }
  return out;
}

export function replaceMattePixels(data, matte = CATALOG_MATTE, tolerance = 10) {
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    if (isMattePixel(r, g, b, tolerance)) {
      out[i] = matte.r;
      out[i + 1] = matte.g;
      out[i + 2] = matte.b;
      out[i + 3] = 255;
    }
  }
  return out;
}

/** Studio sweep / catalog whites that read brighter than the page matte. */
export function isStudioBackgroundPixel(r, g, b, a = 255) {
  if (a < 24) return true;
  if (isMattePixel(r, g, b, 14)) return true;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  if (max - min > 34) return false;
  if (min >= 246) return true;
  if (min >= 228 && max <= 252) return true;
  return false;
}

/**
 * Flood-fill studio whites from image edges onto the catalog matte.
 * Keeps product pixels while removing leftover white boxes in cutouts.
 */
export function flattenStudioBackgroundToMatte(
  data,
  width,
  height,
  matte = CATALOG_MATTE
) {
  const out = Buffer.from(data);
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (!isStudioBackgroundPixel(out[i], out[i + 1], out[i + 2], out[i + 3])) {
      return;
    }
    visited[idx] = 1;
    queue[tail++] = idx;
  };

  for (let x = 0; x < width; x++) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  while (head < tail) {
    const idx = queue[head++];
    const i = idx * 4;
    out[i] = matte.r;
    out[i + 1] = matte.g;
    out[i + 2] = matte.b;
    out[i + 3] = 255;

    const x = idx % width;
    const y = (idx - x) / width;
    tryPush(x - 1, y);
    tryPush(x + 1, y);
    tryPush(x, y - 1);
    tryPush(x, y + 1);
  }

  return out;
}

/** Normalize legacy mattes and leftover studio whites to the active catalog matte. */
export function normalizeProcessedBackground(data, width, height, matte = CATALOG_MATTE) {
  const rematted = replaceMattePixels(data, matte, 14);
  return flattenStudioBackgroundToMatte(rematted, width, height, matte);
}
