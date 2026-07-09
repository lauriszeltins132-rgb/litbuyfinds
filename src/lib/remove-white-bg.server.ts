const MAX_DIMENSION = 900;
const MATTE = { r: 19, g: 19, b: 26 };

function isBgPixel(r: number, g: number, b: number, threshold: number): boolean {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= threshold - 28 && max - min <= 52;
}

function isMattePixel(r: number, g: number, b: number): boolean {
  return (
    Math.abs(r - MATTE.r) <= 6 &&
    Math.abs(g - MATTE.g) <= 6 &&
    Math.abs(b - MATTE.b) <= 6
  );
}

function replaceAllBrightWithMatte(
  data: Uint8Array,
  width: number,
  height: number,
  threshold: number
): number {
  let replaced = 0;
  for (let i = 0; i < width * height; i++) {
    const si = i * 4;
    const r = data[si];
    const g = data[si + 1];
    const b = data[si + 2];
    if (!isBgPixel(r, g, b, threshold)) continue;
    data[si] = MATTE.r;
    data[si + 1] = MATTE.g;
    data[si + 2] = MATTE.b;
    data[si + 3] = 255;
    replaced++;
  }
  return replaced;
}

function flattenOntoMatte(data: Uint8Array, width: number, height: number): Buffer {
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

function removeEdgeBg(
  data: Uint8Array,
  width: number,
  height: number,
  threshold: number
): number {
  const total = width * height;
  const visited = new Uint8Array(total);
  const stack: number[] = [];

  const seed = (x: number, y: number) => {
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

function replaceEdgeBgWithMatte(
  data: Uint8Array,
  width: number,
  height: number,
  threshold: number
): number {
  const total = width * height;
  const visited = new Uint8Array(total);
  const stack: number[] = [];

  const seed = (x: number, y: number) => {
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

function contentPixelRatio(data: Uint8Array, width: number, height: number): number {
  let content = 0;
  for (let i = 0; i < width * height; i++) {
    const si = i * 4;
    if (data[si + 3] < 40) continue;
    if (isMattePixel(data[si], data[si + 1], data[si + 2])) continue;
    content++;
  }
  return content / (width * height);
}

function getBounds(data: Uint8Array, width: number, height: number) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const si = (y * width + x) * 4;
      if (data[si + 3] < 40) continue;
      if (isMattePixel(data[si], data[si + 1], data[si + 2])) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX <= minX) return null;
  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.03);
  return {
    left: Math.max(0, minX - pad),
    top: Math.max(0, minY - pad),
    width: Math.min(width, maxX - minX + 1 + pad * 2),
    height: Math.min(height, maxY - minY + 1 + pad * 2),
  };
}

async function toFlatPng(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sharp: any,
  pixels: Uint8Array,
  width: number,
  height: number
): Promise<Buffer> {
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
  return sharp(out, {
    raw: { width: flat.info.width, height: flat.info.height, channels: 4 },
  })
    .modulate({ brightness: 1.04, saturation: 1.02 })
    .linear(1.06, -(255 * 0.03))
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function toOpaqueMattePng(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sharp: any,
  pixels: Uint8Array,
  width: number,
  height: number
): Promise<Buffer> {
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
  return pipeline
    .modulate({ brightness: 1.04, saturation: 1.02 })
    .linear(1.06, -(255 * 0.03))
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Remove white/light backgrounds and flatten onto opaque dark matte. */
export async function removeWhiteBackgroundFromBuffer(
  input: Buffer
): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  const { data, info } = await sharp(input)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

  const matteAttempts = [248, 242, 235, 228];
  for (const threshold of matteAttempts) {
    const copy = new Uint8Array(pixels);
    const replaced = replaceEdgeBgWithMatte(copy, width, height, threshold);
    const ratio = replaced / (width * height);
    if (ratio < 0.008 || ratio > 0.98) continue;
    if (contentPixelRatio(copy, width, height) < 0.04) continue;
    return toOpaqueMattePng(sharp, copy, width, height);
  }

  const cutoutAttempts = [242, 228, 215];
  for (const threshold of cutoutAttempts) {
    const copy = new Uint8Array(pixels);
    const removed = removeEdgeBg(copy, width, height, threshold);
    const ratio = removed / (width * height);
    if (ratio < 0.005 || ratio > 0.97) continue;
    if (contentPixelRatio(copy, width, height) < 0.04) continue;
    return toFlatPng(sharp, copy, width, height);
  }

  const aggressiveAttempts = [250, 245, 240, 235, 228, 220];
  for (const threshold of aggressiveAttempts) {
    const copy = new Uint8Array(pixels);
    const replaced = replaceAllBrightWithMatte(copy, width, height, threshold);
    const ratio = replaced / (width * height);
    if (ratio < 0.04 || ratio > 0.94) continue;
    if (contentPixelRatio(copy, width, height) < 0.05) continue;
    return toOpaqueMattePng(sharp, copy, width, height);
  }

  const fallback = new Uint8Array(pixels);
  replaceAllBrightWithMatte(fallback, width, height, 235);
  return toOpaqueMattePng(sharp, fallback, width, height);
}
