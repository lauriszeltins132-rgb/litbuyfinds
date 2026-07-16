/** Opaque matte behind processed cutouts — must match --color-background in globals.css */
export const CATALOG_MATTE = { r: 238, g: 240, b: 232 }; // #EEF0E8
export const LEGACY_DARK_MATTE = { r: 20, g: 20, b: 24 }; // #141418

export function isLegacyMattePixel(r, g, b, tolerance = 8) {
  return (
    Math.abs(r - LEGACY_DARK_MATTE.r) <= tolerance &&
    Math.abs(g - LEGACY_DARK_MATTE.g) <= tolerance &&
    Math.abs(b - LEGACY_DARK_MATTE.b) <= tolerance
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

export function replaceLegacyMattePixels(data, matte = CATALOG_MATTE, tolerance = 8) {
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    if (isLegacyMattePixel(r, g, b, tolerance)) {
      out[i] = matte.r;
      out[i + 1] = matte.g;
      out[i + 2] = matte.b;
      out[i + 3] = 255;
    }
  }
  return out;
}
