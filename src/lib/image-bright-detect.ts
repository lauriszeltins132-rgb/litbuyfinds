import type { BrightBgTreatment } from "./bright-bg";

function isBrightPixel(r: number, g: number, b: number, threshold = 220): boolean {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= threshold - 28 && max - min <= 52;
}

function luminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Client-side fallback when catalog metadata misses a bright-background image. */
export function detectBrightFromElement(
  img: HTMLImageElement
): BrightBgTreatment | null {
  try {
    const size = 56;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0, size, size);
    const { data, width, height } = ctx.getImageData(0, 0, size, size);

    let borderBright = 0;
    let borderTotal = 0;
    let centerLum = 0;
    let centerTotal = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const edge =
          x < width * 0.1 ||
          y < height * 0.1 ||
          x > width * 0.9 ||
          y > height * 0.9;
        const inner =
          x > width * 0.3 &&
          x < width * 0.7 &&
          y > height * 0.3 &&
          y < height * 0.7;
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (edge) {
          borderTotal++;
          if (isBrightPixel(r, g, b)) borderBright++;
        }
        if (inner) {
          centerTotal++;
          centerLum += luminance(r, g, b);
        }
      }
    }

    if (!borderTotal) return null;

    const borderRatio = borderBright / borderTotal;
    const avgCenterLum = centerTotal ? centerLum / centerTotal : 0;

    if (borderRatio < 0.28) return null;
    if (avgCenterLum >= 188 && borderRatio >= 0.45) return "vignette";
    return "matte";
  } catch {
    return null;
  }
}
