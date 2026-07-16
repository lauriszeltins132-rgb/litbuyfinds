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
