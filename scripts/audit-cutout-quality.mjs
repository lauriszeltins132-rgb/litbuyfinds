#!/usr/bin/env node
/**
 * Scores pre-built cutout PNGs and writes URLs that should skip cutout display.
 * Output: src/data/skip-cutout-urls.json
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mapPath = path.join(__dirname, "../src/data/processed-image-map.json");
const processedDir = path.join(__dirname, "../public/processed");
const outPath = path.join(__dirname, "../src/data/skip-cutout-urls.json");

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isWhitePixel(r, g, b) {
  return r >= 238 && g >= 238 && b >= 238;
}

function isDarkPixel(r, g, b) {
  return luminance(r, g, b) < 72;
}

/** Higher = more likely the cutout damaged the product. */
function scoreCutoutArtifacts(data, width, height) {
  let opaque = 0;
  let whiteInside = 0;
  let harshTransitions = 0;
  let darkOpaque = 0;
  let speckle = 0;

  const innerL = Math.floor(width * 0.1);
  const innerR = Math.ceil(width * 0.9);
  const innerT = Math.floor(height * 0.1);
  const innerB = Math.ceil(height * 0.9);

  for (let y = innerT; y < innerB; y++) {
    for (let x = innerL; x < innerR; x++) {
      const i = (y * width + x) * 4;
      const a = data[i + 3];
      if (a < 160) continue;

      opaque++;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (isDarkPixel(r, g, b)) darkOpaque++;
      if (isWhitePixel(r, g, b)) whiteInside++;

      const neighbors = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const ni = (ny * width + nx) * 4;
        const na = data[ni + 3];
        const nr = data[ni];
        const ng = data[ni + 1];
        const nb = data[ni + 2];

        const lum = luminance(r, g, b);
        const nLum = na < 40 ? 0 : luminance(nr, ng, nb);

        if (Math.abs(lum - nLum) > 165) harshTransitions++;

        if (a > 200 && na < 40 && lum > 200) speckle++;
        if (a > 200 && na > 200 && isWhitePixel(r, g, b) !== isWhitePixel(nr, ng, nb)) {
          speckle++;
        }
      }
    }
  }

  if (opaque < 80) {
    return { bad: true, reason: "too_few_opaque_pixels", score: 1 };
  }

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

  const bad =
    score >= 0.42 ||
    (darkRatio > 0.38 && whiteRatio > 0.025) ||
    (darkRatio > 0.88 && whiteRatio > 0.0015) ||
    whiteRatio > 0.09 ||
    speckleRatio > 0.14;

  return {
    bad,
    score,
    whiteRatio,
    darkRatio,
    harshRatio,
    speckleRatio,
  };
}

async function main() {
  const sharp = (await import("sharp")).default;
  const mapData = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  const urls = mapData.urls ?? {};

  const skip = [];
  const samples = [];

  for (const [sourceUrl, publicPath] of Object.entries(urls)) {
    const filePath = path.join(processedDir, path.basename(publicPath));
    if (!fs.existsSync(filePath)) continue;

    const { data, info } = await sharp(filePath)
      .resize(160, 160, { fit: "inside" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const result = scoreCutoutArtifacts(data, info.width, info.height);
    if (result.bad) {
      skip.push(sourceUrl);
      if (samples.length < 12) {
        samples.push({ url: sourceUrl.slice(-48), ...result });
      }
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    audited: Object.keys(urls).length,
    skipCount: skip.length,
    urls: skip,
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`Audited ${payload.audited} cutouts → ${skip.length} flagged`);
  if (samples.length) {
    console.log("Sample flags:", samples.slice(0, 5));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
