import skipData from "@/data/skip-cutout-urls.json";

type SkipCutoutManifest = {
  urls: string[];
};

const skipSet = new Set((skipData as SkipCutoutManifest).urls ?? []);

/** Product types where aggressive bg removal often damages the photo. */
const RISKY_NAME_PATTERN =
  /\b(vest|puffer|down jacket|down vest|goose|moncler|reflective|shiny|quilted|nylon|patent|leather jacket|fur|suede)\b/i;

export function shouldSkipCutout(sourceUrl: string, productName?: string): boolean {
  if (!sourceUrl) return true;
  if (skipSet.has(sourceUrl)) return true;
  if (productName && RISKY_NAME_PATTERN.test(productName)) return true;
  return false;
}

export function scoreCutoutFromImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number
): number {
  let opaque = 0;
  let whiteInside = 0;
  let harshTransitions = 0;
  let darkOpaque = 0;
  let speckle = 0;

  const innerL = Math.floor(width * 0.1);
  const innerR = Math.ceil(width * 0.9);
  const innerT = Math.floor(height * 0.1);
  const innerB = Math.ceil(height * 0.9);

  const lum = (r: number, g: number, b: number) =>
    0.2126 * r + 0.7152 * g + 0.0722 * b;
  const isWhite = (r: number, g: number, b: number) =>
    r >= 238 && g >= 238 && b >= 238;
  const isDark = (r: number, g: number, b: number) => lum(r, g, b) < 72;

  for (let y = innerT; y < innerB; y++) {
    for (let x = innerL; x < innerR; x++) {
      const i = (y * width + x) * 4;
      const a = data[i + 3];
      if (a < 160) continue;

      opaque++;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (isDark(r, g, b)) darkOpaque++;
      if (isWhite(r, g, b)) whiteInside++;

      for (const [nx, ny] of [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ]) {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const ni = (ny * width + nx) * 4;
        const na = data[ni + 3];
        const nr = data[ni];
        const ng = data[ni + 1];
        const nb = data[ni + 2];
        const l = lum(r, g, b);
        const nl = na < 40 ? 0 : lum(nr, ng, nb);
        if (Math.abs(l - nl) > 165) harshTransitions++;
        if (a > 200 && na < 40 && l > 200) speckle++;
      }
    }
  }

  if (opaque < 40) return 1;

  const whiteRatio = whiteInside / opaque;
  const darkRatio = darkOpaque / opaque;
  const harshRatio = harshTransitions / (opaque * 4);
  const speckleRatio = speckle / opaque;

  let score = 0;
  if (whiteRatio > 0.035) score += whiteRatio * 4;
  if (darkRatio > 0.3 && whiteRatio > 0.02) score += 0.45;
  if (darkRatio > 0.88 && whiteRatio > 0.0015) score += 0.55;
  if (harshRatio > 0.12) score += harshRatio * 2;
  if (speckleRatio > 0.08) score += speckleRatio * 3;

  return score;
}

export function cutoutLooksDamaged(
  data: Uint8ClampedArray,
  width: number,
  height: number
): boolean {
  const score = scoreCutoutFromImageData(data, width, height);
  return score >= 0.42;
}
