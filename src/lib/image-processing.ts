import {
  getCachedImage,
  getCachedImageAsync,
  setCachedImage,
} from "./image-cache";

const MAX_DIMENSION = 900;

function processImageData(
  data: Uint8ClampedArray,
  threshold: number
): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const spread = max - min;

    if (min >= threshold && spread <= 28) {
      const fade = (min - threshold) / (255 - threshold);
      data[i + 3] = Math.round(data[i + 3] * (1 - fade));
      continue;
    }

    if (min >= threshold - 18 && spread <= 42) {
      const fade = (min - (threshold - 18)) / 18;
      data[i + 3] = Math.round(data[i + 3] * (1 - fade * 0.9));
    }
  }
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

export async function removeWhiteBackground(
  imageUrl: string,
  threshold = 238
): Promise<string> {
  const cached = getCachedImage(imageUrl) ?? (await getCachedImageAsync(imageUrl));
  if (cached) return cached;

  const img = await loadImage(imageUrl);

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
    processImageData(imageData.data, threshold);
    ctx.putImageData(imageData, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    setCachedImage(imageUrl, dataUrl);
    return dataUrl;
  } catch {
    throw new Error("Canvas tainted");
  }
}
