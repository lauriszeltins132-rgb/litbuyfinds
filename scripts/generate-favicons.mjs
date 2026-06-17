#!/usr/bin/env node
/**
 * Generates favicon PNG/ICO assets from public/icon-source.svg
 * Run: node scripts/generate-favicons.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const appDir = join(root, "src", "app");

const svg = readFileSync(join(publicDir, "icon-source.svg"));

const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-48x48.png", size: 48 },
  { name: "favicon-192x192.png", size: 192 },
  { name: "favicon-512x512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

const pngBuffers = {};

for (const { name, size } of sizes) {
  const buffer = await sharp(svg)
    .resize(size, size, {
      fit: "contain",
      background: { r: 5, g: 5, b: 6, alpha: 1 },
    })
    .png()
    .toBuffer();

  const outPath = join(publicDir, name);
  writeFileSync(outPath, buffer);
  if (size <= 48) pngBuffers[size] = buffer;
  console.log(`created ${name}`);
}

const icoBuffer = await pngToIco([
  pngBuffers[16],
  pngBuffers[32],
  pngBuffers[48],
]);

writeFileSync(join(publicDir, "favicon.ico"), icoBuffer);
writeFileSync(join(appDir, "favicon.ico"), icoBuffer);
console.log("created favicon.ico (public + src/app)");

await sharp(svg)
  .resize(32, 32, {
    fit: "contain",
    background: { r: 5, g: 5, b: 6, alpha: 1 },
  })
  .png()
  .toFile(join(appDir, "icon.png"));
console.log("created src/app/icon.png");

await sharp(svg)
  .resize(180, 180, {
    fit: "contain",
    background: { r: 5, g: 5, b: 6, alpha: 1 },
  })
  .png()
  .toFile(join(appDir, "apple-icon.png"));
console.log("created src/app/apple-icon.png");
