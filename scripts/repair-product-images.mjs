#!/usr/bin/env node
/**
 * Repair missing or dead product images by re-parsing LitBuy spreadsheet tabs.
 *
 * Run: node scripts/repair-product-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PRODUCTS_PATH = path.join(ROOT, "src", "data", "products.json");
const PROCESSED_MAP_PATH = path.join(ROOT, "src", "data", "processed-image-map.json");
const DEAD_MANIFEST_PATH = path.join(ROOT, "src", "data", "dead-image-urls.json");

const SPREADSHEET_ID = "1uCskcK_kpAjJ82uAbHJ-do8jqLZ2_WBx4SRnhKDMmTA";

const SHEET_HTML_GIDS = [
  { name: "Trending Now", gid: "0" },
  { name: "Latest Finds", gid: "1185828767" },
];

function normalize(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function canonicalLink(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url.trim());
    return `${parsed.origin}${parsed.pathname}`.toLowerCase();
  } catch {
    return url.trim().toLowerCase().split("?")[0];
  }
}

function normalizeLitbuyLink(url) {
  let value = normalize(url);
  if (!value) return "";
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  if (!value.includes("litbuy.com/product/")) return "";
  if (!value.includes("inviteCode=")) {
    value += value.includes("?") ? "&inviteCode=SMKS" : "?inviteCode=SMKS";
  }
  return value.replace(/inviteCode=[^&]+/, "inviteCode=SMKS");
}

function isUsableImage(url) {
  if (!url) return false;
  const value = url.toLowerCase();
  if (!/^https?:\/\//i.test(value)) return false;
  return (
    value.includes("postimg.cc") ||
    value.includes("geilicdn.com") ||
    value.includes("alicdn.com")
  );
}

function sanitizeImageUrl(raw) {
  if (!raw) return "";
  let url = normalize(raw);
  if (url.startsWith("//")) url = `https:${url}`;
  url = url.replace(/(\.(?:png|jpe?g|webp|gif)).*$/i, "$1");
  return url;
}

function extractImageNear(text, startIndex) {
  const window = text.slice(startIndex, startIndex + 2500);
  const patterns = [
    /https?:\/\/i\.postimg\.cc\/[^\s,"\\]+/i,
    /https?:\/\/[^\s,"\\]*geilicdn\.com\/[^\s,"\\]+/i,
    /https?:\/\/[^\s,"\\]*alicdn\.com\/[^\s,"\\]+/i,
    /postimg\.cc\/([^\s,"\\]+\.(?:png|jpe?g|webp))/i,
  ];

  for (const pattern of patterns) {
    const match = window.match(pattern);
    if (!match) continue;
    const raw = match[0].startsWith("http")
      ? match[0]
      : `https://i.postimg.cc/${match[1]}`;
    const cleaned = sanitizeImageUrl(raw);
    if (isUsableImage(cleaned)) return cleaned;
  }
  return "";
}

function parseRowAlignedSheetHtml(html) {
  const pairs = new Map();
  const needle = "litbuy.com/product/weidian/";
  const suffixes = ["?inviteCode\\\\u003dSMKS", "?inviteCode\\\\u003dSMK"];
  let idx = 0;

  while (true) {
    const start = html.indexOf(needle, idx);
    if (start < 0) break;

    let end = -1;
    for (const suffix of suffixes) {
      const found = html.indexOf(suffix, start);
      if (found >= 0 && (end < 0 || found < end)) end = found;
    }
    if (end < 0) {
      idx = start + 1;
      continue;
    }

    const weidianId = html.slice(start + needle.length, end);
    const affiliate_link = normalizeLitbuyLink(
      `https://litbuy.com/product/weidian/${weidianId}?inviteCode=SMKS`
    );
    const after = html.slice(start, start + 1500);
    const imgMatch = after.match(/postimg\.cc\/([^\\"]+\.(?:png|jpg|jpeg|webp))/i);
    const image = imgMatch ? `https://i.postimg.cc/${imgMatch[1]}` : "";

    if (affiliate_link && isUsableImage(image)) {
      pairs.set(canonicalLink(affiliate_link), image);
    }

    idx = end + 8;
  }

  return pairs;
}

function parseLinkImagePairsFromHtml(html) {
  const pairs = new Map();
  const needle = "litbuy.com/product/";
  let idx = 0;

  while (true) {
    const start = html.indexOf(needle, idx);
    if (start < 0) break;

    const slice = html.slice(start, start + 2200);
    const platformMatch = slice.match(/litbuy\.com\/product\/(weidian|taobao)\/(\d+)/i);
    if (!platformMatch) {
      idx = start + 1;
      continue;
    }

    const affiliate_link = normalizeLitbuyLink(
      `https://litbuy.com/product/${platformMatch[1]}/${platformMatch[2]}?inviteCode=SMKS`
    );
    const image = extractImageNear(html, start);

    if (affiliate_link && image) {
      const key = canonicalLink(affiliate_link);
      if (!pairs.has(key)) pairs.set(key, image);
    }

    idx = start + needle.length;
  }

  return pairs;
}

async function fetchSheetHtml(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${gid}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sheet HTML gid=${gid} failed (${response.status})`);
  }
  return response.text();
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function main() {
  const processedMap = loadJson(PROCESSED_MAP_PATH).urls ?? {};
  const deadManifest = loadJson(DEAD_MANIFEST_PATH);
  const deadSet = new Set(deadManifest.urls ?? []);

  const imageByLink = new Map();

  for (const sheet of SHEET_HTML_GIDS) {
    process.stdout.write(`Fetching ${sheet.name} HTML… `);
    const html = await fetchSheetHtml(sheet.gid);
    const loosePairs = parseLinkImagePairsFromHtml(html);
    const alignedPairs = parseRowAlignedSheetHtml(html);
    for (const map of [loosePairs, alignedPairs]) {
      for (const [link, image] of map) {
        if (!imageByLink.has(link)) imageByLink.set(link, image);
      }
    }
    console.log(`${imageByLink.size} indexed links`);
  }

  const products = loadJson(PRODUCTS_PATH);
  let repairedImages = 0;

  for (const product of products) {
    const key = canonicalLink(product.affiliate_link);
    const candidate = imageByLink.get(key);
    const hasProcessed = product.image && Boolean(processedMap[product.image]);
    const isDead = product.image && deadSet.has(product.image) && !hasProcessed;

    if ((!product.image || isDead) && candidate) {
      product.image = candidate;
      repairedImages++;
      if (deadSet.has(candidate)) deadSet.delete(candidate);
    }
  }

  deadManifest.urls = [...deadSet].sort();
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf8");
  fs.writeFileSync(DEAD_MANIFEST_PATH, JSON.stringify(deadManifest, null, 2), "utf8");

  console.log("\nRepair complete:");
  console.log(`  Images updated: ${repairedImages}`);
  console.log(`  Sheet image index size: ${imageByLink.size}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
