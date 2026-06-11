const MAX_DIMENSION = 900;
const THRESHOLD = 242;
const MIN_REMOVED = 0.02;
const MAX_REMOVED = 0.94;
const TRIM_PAD = 0.03;

function isBackgroundPixel(r: number, g: number, b: number): boolean {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= THRESHOLD - 22 && max - min <= 44;
}

function borderLooksBright(data: Uint8Array, width: number, height: number): boolean {
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

function removeEdgeBackground(
  data: Uint8Array,
  width: number,
  height: number
): number {
  const total = width * height;
  const visited = new Uint8Array(total);
  const stack: number[] = [];

  const trySeed = (x: number, y: number) => {
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
    const idx = stack.pop()!;
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

function getContentBounds(data: Uint8Array, width: number, height: number) {
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

/** Remove edge-connected white background. Returns PNG buffer or null if skipped. */
export async function removeWhiteBackgroundFromBuffer(
  input: Buffer
): Promise<Buffer | null> {
  const sharp = (await import("sharp")).default;
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
  const pixels = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

  if (!borderLooksBright(pixels, width, height)) {
    return null;
  }

  const removed = removeEdgeBackground(pixels, width, height);
  const ratio = removed / (width * height);

  if (ratio < MIN_REMOVED || ratio > MAX_REMOVED) {
    return null;
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

  return pipeline.png({ compressionLevel: 9 }).toBuffer();
}
