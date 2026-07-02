#!/usr/bin/env node
/**
 * Merge newest rows from the LitBuy spreadsheet "Latest Finds" tab into
 * src/data/products.json without removing existing products.
 *
 * Uses row-aligned parsing from the live sheet HTML so names, prices,
 * images, and affiliate links stay matched.
 *
 * Run: npm run merge:latest-finds
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PRODUCTS_PATH = path.join(ROOT, "src", "data", "products.json");

const SPREADSHEET_ID = "1uCskcK_kpAjJ82uAbHJ-do8jqLZ2_WBx4SRnhKDMmTA";
const LATEST_FINDS_GID = "1185828767";
const SHEET_META = {
  category: "Latest Finds",
  slug: "latest-finds",
  group: "featured",
  sheet: "🔍Latest Finds 🔍",
};

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

function isSocialAsset(image = "", name = "") {
  const haystack = `${image} ${name}`.toLowerCase();
  return (
    haystack.includes("whatsapp") ||
    haystack.includes("telegram") ||
    haystack.includes("discord.gg")
  );
}

function isUsableImage(url) {
  if (!url) return false;
  const value = url.toLowerCase();
  if (!/^https?:\/\//i.test(value)) return false;
  if (value.endsWith(".svg")) return false;
  if (isSocialAsset(value)) return false;
  return (
    value.includes("postimg.cc") ||
    value.includes("geilicdn.com") ||
    value.includes("alicdn.com")
  );
}

function isValidProductName(name) {
  const value = normalize(name);
  if (!value || value.length < 2) return false;
  if (/^(link|qc|product|image)$/i.test(value)) return false;
  if (/^latest finds/i.test(value)) return false;
  if (/^fashion bottoms$/i.test(value)) return false;
  if (isSocialAsset("", value)) return false;
  return true;
}

function nameFromImage(url) {
  const file = url.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
  if (!file || isSocialAsset(file)) return "";

  return file
    .replace(/[-_]+/g, " ")
    .replace(/\s+\d+$/, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function parseUsdPrice(nums) {
  const fractional = nums.find(
    (value) =>
      value >= 3 &&
      value <= 150 &&
      Math.abs(value - Math.round(value)) > 0.001
  );
  if (fractional != null) return Math.round(fractional * 100) / 100;
  return null;
}

function parseLatestFindsSheetHtml(html) {
  const needle = "litbuy.com/product/weidian/";
  const suffix = "?inviteCode\\\\u003dSMKS";
  const products = [];
  let idx = 0;

  while (true) {
    const start = html.indexOf(needle, idx);
    if (start < 0) break;
    const end = html.indexOf(suffix, start);
    if (end < 0) {
      idx = start + 1;
      continue;
    }

    const weidianId = html.slice(start + needle.length, end);
    const affiliate_link = normalizeLitbuyLink(
      `https://litbuy.com/product/weidian/${weidianId}?inviteCode=SMKS`
    );
    const before = html.slice(Math.max(0, start - 1800), start);
    const after = html.slice(start, start + 1500);

    const inlineNames = [...before.matchAll(/\[2,\\"([^\\"]{2,100})\\"\]/g)].map(
      (match) => normalize(match[1])
    );
    const invalidName =
      /^(LINK|QC|PRODUCT|Litbuy|IMAGE|SHOES|SCARF|USE CTRL|This is a|seller)/i;

    const imgMatch = after.match(/postimg\.cc\/([^\\"]+\.(?:png|jpg|jpeg|webp))/i);
    const image = imgMatch ? `https://i.postimg.cc/${imgMatch[1]}` : "";

    let product_name =
      [...inlineNames].reverse().find((name) => name && !invalidName.test(name)) ||
      nameFromImage(image);

    const nums = [...after.matchAll(/\\"3\\":(\d+(?:\.\d+)?)/g)].map((match) =>
      parseFloat(match[1])
    );
    const price = parseUsdPrice(nums);

    products.push({
      product_name: normalize(product_name),
      price,
      affiliate_link,
      image,
      qc_link: "",
    });

    idx = end + suffix.length;
  }

  return products;
}

async function fetchSheetHtml() {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${LATEST_FINDS_GID}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Sheets edit page failed (${response.status})`);
  }
  return response.text();
}

function dedupeByLink(products) {
  const seen = new Set();
  const deduped = [];
  for (const product of products) {
    const key = canonicalLink(product.affiliate_link);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(product);
  }
  return deduped;
}

function nextId(existing) {
  const max = existing.reduce(
    (highest, product) => Math.max(highest, Number(product.id) || 0),
    0
  );
  return String(max + 1);
}

async function main() {
  console.log("Fetching Latest Finds sheet model…");
  const html = await fetchSheetHtml();
  const parsed = dedupeByLink(parseLatestFindsSheetHtml(html)).filter(
    (row) =>
      isValidProductName(row.product_name) &&
      isUsableImage(row.image) &&
      !isSocialAsset(row.image, row.product_name)
  );

  console.log(`  Parsed ${parsed.length} row-aligned products`);

  const existing = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const existingLinks = new Set(
    existing.map((product) => canonicalLink(product.affiliate_link))
  );

  const candidates = parsed.filter(
    (row) => !existingLinks.has(canonicalLink(row.affiliate_link))
  );

  if (candidates.length === 0) {
    console.log("\nNo new Latest Finds products to add.");
    return;
  }

  let idCounter = Number(nextId(existing));
  const merged = [
    ...existing,
    ...candidates.map((row) => ({
      id: String(idCounter++),
      product_name: row.product_name,
      category: SHEET_META.category,
      category_slug: SHEET_META.slug,
      sheet: SHEET_META.sheet,
      group: SHEET_META.group,
      price: row.price,
      affiliate_link: row.affiliate_link,
      qc_link: row.qc_link ?? "",
      image: row.image,
    })),
  ];

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(merged, null, 2), "utf8");

  console.log(`\nAdded ${candidates.length} new Latest Finds products.`);
  console.log(`  Catalog total: ${merged.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
