#!/usr/bin/env node
/**
 * Probes catalog image URLs and writes dead URLs to src/data/dead-image-urls.json.
 * Run: node scripts/generate-dead-image-manifest.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, "../src/data/products.json");
const outPath = path.join(__dirname, "../src/data/dead-image-urls.json");
const CONCURRENCY = 20;
const ciMode = process.argv.includes("--ci");

const ALLOWED_HOSTS = new Set([
  "i.postimg.cc",
  "postimg.cc",
  "postimages.org",
  "i.postimages.org",
  "si.geilicdn.com",
  "cbu01.alicdn.com",
  "img.alicdn.com",
  "ae01.alicdn.com",
  "sc04.alicdn.com",
  "gd4.alicdn.com",
]);

function validateUrl(raw) {
  if (!raw) return false;
  try {
    const url = new URL(raw);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      ALLOWED_HOSTS.has(url.hostname.toLowerCase()) &&
      url.pathname &&
      url.pathname !== "/"
    );
  } catch {
    return false;
  }
}

async function probe(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "LitBuyFinds-DeadImageProbe/1.0",
        Range: "bytes=0-1023",
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return false;
    const type = res.headers.get("content-type") ?? "";
    if (type && !type.startsWith("image/")) return false;
    return true;
  } catch {
    return false;
  }
}

async function mapPool(items, limit, fn) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
}

async function main() {
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const urls = [...new Set(products.map((p) => p.image).filter(validateUrl))];

  console.log(`Probing ${urls.length} image URLs...`);

  const dead = [];
  let checked = 0;

  await mapPool(urls, CONCURRENCY, async (url) => {
    const ok = await probe(url);
    checked++;
    if (!ok) dead.push(url);
    if (checked % 200 === 0) {
      console.log(`  checked ${checked}/${urls.length}, dead so far: ${dead.length}`);
    }
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    probed: urls.length,
    deadCount: dead.length,
    urls: dead,
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`Done: ${dead.length} dead URLs → ${outPath}`);

  if (ciMode && dead.length > 10) {
    console.error(`CI fail: ${dead.length} dead image URLs (max 10)`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
