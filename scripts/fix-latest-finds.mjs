#!/usr/bin/env node
/**
 * Re-sync Latest Finds products from the live Google Sheet with correct
 * row-aligned names, prices, images, and affiliate links.
 *
 * Run: npm run fix:latest-finds
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

function normalizeProductName(name) {
  const value = normalize(name);
  const walletMatch = value.match(/^wallet\s+(.+)$/i);
  if (walletMatch) {
    return `${normalize(walletMatch[1])} Wallet`;
  }
  return value;
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

    const nums = [...after.matchAll(/\\"3\\":(\d+(?:\.\d+)?)/g)].map((match) =>
      parseFloat(match[1])
    );
    const usd = parseUsdPrice(nums);
    const price = usd;

    products.push({
      product_name: normalizeProductName(
        [...inlineNames].reverse().find((name) => name && !invalidName.test(name)) ||
          nameFromImage(image)
      ),
      price,
      affiliate_link,
      image,
      qc_link: "",
    });

    idx = end + suffix.length;
  }

  return products;
}

async function fetchGvizPriceQueues() {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${LATEST_FINDS_GID}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Sheets gviz request failed (${response.status})`);
  }

  const raw = await response.text();
  const match = raw.match(/setResponse\((.*)\);?\s*$/s);
  if (!match) throw new Error("Could not parse Google Sheets gviz response");

  const data = JSON.parse(match[1]);
  const rows = data.table?.rows ?? [];
  const queues = new Map();

  for (const row of rows) {
    const cells = row.c ?? [];
    for (let index = 0; index < cells.length; index++) {
      if (cells[index]?.v !== "LINK") continue;

      const name = normalizeProductName(cells[index - 1]?.v);
      if (!isValidProductName(name)) continue;

      const usdCell = cells[index + 2];
      let price = null;
      if (
        usdCell &&
        typeof usdCell.v === "number" &&
        String(usdCell.f ?? "").includes("$")
      ) {
        price = Math.round(usdCell.v * 100) / 100;
      }

      const key = name.toLowerCase();
      if (!queues.has(key)) queues.set(key, []);
      queues.get(key).push(price);
    }
  }

  return queues;
}

function enrichPriceFromGviz(row, queues) {
  if (row.price != null) return row.price;
  const key = row.product_name.toLowerCase();
  const queue = queues.get(key);
  if (!queue || queue.length === 0) return null;
  return queue.shift() ?? null;
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

function buildSheetProduct(row) {
  return {
    product_name: row.product_name,
    category: SHEET_META.category,
    category_slug: SHEET_META.slug,
    sheet: SHEET_META.sheet,
    group: SHEET_META.group,
    price: row.price,
    affiliate_link: row.affiliate_link,
    qc_link: row.qc_link ?? "",
    image: row.image,
  };
}

async function main() {
  console.log("Fetching Latest Finds sheet model…");
  const [html, priceQueues] = await Promise.all([
    fetchSheetHtml(),
    fetchGvizPriceQueues(),
  ]);

  const parsed = dedupeByLink(parseLatestFindsSheetHtml(html))
    .map((row) => ({
      ...row,
      price: enrichPriceFromGviz(row, priceQueues),
    }))
    .filter(
      (row) =>
        isValidProductName(row.product_name) &&
        isUsableImage(row.image) &&
        !isSocialAsset(row.image, row.product_name)
    );

  console.log(`  Parsed ${parsed.length} row-aligned products`);

  const existing = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const sheetByLink = new Map(
    parsed.map((row) => [canonicalLink(row.affiliate_link), row])
  );

  let updated = 0;
  let removed = 0;
  let keptLegacy = 0;

  const repaired = [];

  for (const product of existing) {
    const key = canonicalLink(product.affiliate_link);
    const row = sheetByLink.get(key);

    if (product.category_slug !== SHEET_META.slug) {
      repaired.push(product);
      continue;
    }

    if (row) {
      repaired.push({
        ...product,
        ...buildSheetProduct(row),
      });
      sheetByLink.delete(key);
      updated++;
      continue;
    }

    if (
      Number(product.id) >= 2974 ||
      isSocialAsset(product.image, product.product_name) ||
      !isValidProductName(product.product_name) ||
      !isUsableImage(product.image)
    ) {
      removed++;
      continue;
    }

    repaired.push(product);
    keptLegacy++;
  }

  let nextId =
    repaired.reduce((max, product) => Math.max(max, Number(product.id) || 0), 0) + 1;
  const existingLinks = new Set(
    repaired.map((product) => canonicalLink(product.affiliate_link))
  );

  let added = 0;
  for (const row of parsed) {
    const key = canonicalLink(row.affiliate_link);
    if (!key || existingLinks.has(key)) continue;
    repaired.push({
      id: String(nextId++),
      ...buildSheetProduct(row),
    });
    existingLinks.add(key);
    added++;
  }

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(repaired, null, 2), "utf8");

  console.log("\nLatest Finds repair complete:");
  console.log(`  Updated: ${updated}`);
  console.log(`  Added: ${added}`);
  console.log(`  Removed bad rows: ${removed}`);
  console.log(`  Kept legacy latest-finds: ${keptLegacy}`);
  console.log(`  Catalog total: ${repaired.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
