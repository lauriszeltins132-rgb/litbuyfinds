#!/usr/bin/env node
/**
 * Merge newest rows from the LitBuy spreadsheet "Latest Finds" tab into
 * src/data/products.json without removing existing products.
 *
 * Reads live names/prices via Google gviz, resolves affiliate_link values
 * from the public sheet edit HTML, and enriches image/qc data from
 * data/products.xlsx when available.
 *
 * Run: npm run merge:latest-finds
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const XLSX_PATH = path.join(ROOT, "data", "products.xlsx");
const PRODUCTS_PATH = path.join(ROOT, "src", "data", "products.json");

const SPREADSHEET_ID = "1uCskcK_kpAjJ82uAbHJ-do8jqLZ2_WBx4SRnhKDMmTA";
const LATEST_FINDS_GID = "1185828767";
const SHEET_NAME = "🔍Latest Finds 🔍";
const INVITE_SUFFIX = "inviteCode=SMKS";
const SHEET_META = {
  category: "Latest Finds",
  slug: "latest-finds",
  group: "featured",
  sheet: SHEET_NAME,
};

function normalize(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normName(value) {
  return normalize(value).toLowerCase();
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

  if (value.endsWith("inviteCode")) {
    value = `${value}=SMKS`;
  } else if (!value.includes("inviteCode=")) {
    value += value.includes("?") ? "&inviteCode=SMKS" : "?inviteCode=SMKS";
  } else if (!value.includes(INVITE_SUFFIX)) {
    value = value.replace(/inviteCode=[^&]+/, INVITE_SUFFIX);
  }

  return value;
}

function isValidProductName(name) {
  if (!name) return false;
  if (/^product$/i.test(name)) return false;
  if (/^link$/i.test(name)) return false;
  if (/^qc$/i.test(name)) return false;
  if (/^image$/i.test(name)) return false;
  if (/seller collaboration/i.test(name)) return false;
  if (/exchange rate/i.test(name)) return false;
  if (/^litbuy/i.test(name)) return false;
  if (/^use ctrl\+f/i.test(name)) return false;
  if (/^please do not/i.test(name)) return false;
  if (/^telegram/i.test(name)) return false;
  if (/^discord/i.test(name)) return false;
  if (/^this is a spreadsheet/i.test(name)) return false;
  if (/^most popular/i.test(name)) return false;
  if (/^🔥/.test(name) && /items/i.test(name)) return false;
  return name.length > 1;
}

function isUsableImage(url) {
  if (!url) return false;
  const value = url.toLowerCase();
  if (!/^https?:\/\//i.test(value)) return false;
  if (value.endsWith(".svg")) return false;
  if (value.includes("whatsapp")) return false;
  if (value.includes("chat-gpt-image")) return false;
  return (
    value.includes("postimg.cc") ||
    value.includes("geilicdn.com") ||
    value.includes("alicdn.com")
  );
}

function colLetter(col) {
  let s = "";
  let n = col + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function getCell(sheet, row, col) {
  return sheet[`${colLetter(col)}${row + 1}`];
}

function extractImage(cell) {
  if (!cell) return "";
  const formula = cell.f || "";
  const match =
    formula.match(/IMAGE\("([^"]+)"/i) || formula.match(/IMAGE\('([^']+)'/i);
  if (match) return match[1];
  const value = normalize(cell.v || cell.w);
  return /^https?:\/\//i.test(value) ? value : "";
}

function extractLink(cell) {
  if (!cell) return "";
  if (cell.l?.Target) return cell.l.Target;
  const value = normalize(cell.v);
  return /^https?:\/\//i.test(value) ? value : "";
}

function parsePrice(value, formatted = "") {
  if (value === "" || value === null || value === undefined) return null;

  const display = String(formatted ?? "").trim();
  const hasCurrency = /[$¥€]/.test(display);

  if (typeof value === "number" && !isNaN(value)) {
    return Math.round(value * 100) / 100;
  }

  const text = String(value).trim();
  if (/[a-zA-Z]/i.test(text) && !hasCurrency) return null;

  const source = hasCurrency ? display : text;
  const cleaned = source.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : Math.round(num * 100) / 100;
}

function findProductName(rows, row, linkCol) {
  for (let col = linkCol - 1; col >= Math.max(0, linkCol - 4); col--) {
    const name = normalize(rows[row]?.[col]);
    if (isValidProductName(name)) return name;
  }
  return "";
}

function findUsdPrice(sheet, rows, row, linkCol) {
  let dollarPrice = null;
  const numericUsd = [];

  for (let col = linkCol + 1; col <= linkCol + 8; col++) {
    const cell = getCell(sheet, row, col);
    const raw = rows[row]?.[col];
    const formatted = cell?.w ?? "";
    const formula = cell?.f ?? "";

    if (normalize(raw) === "QC") continue;
    if (extractImage(cell)) continue;
    if (extractLink(cell) && normalize(raw) === "LINK") continue;

    const price = parsePrice(raw, formatted);
    if (price === null) continue;

    if (formatted.includes("$") || formula.includes("/$")) {
      if (price >= 3 && price <= 500) {
        dollarPrice =
          dollarPrice === null ? price : Math.min(dollarPrice, price);
      }
      continue;
    }

    if (typeof raw === "number" && raw > 500) continue;
    if (price >= 3 && price <= 500) numericUsd.push(price);
  }

  if (dollarPrice !== null) return dollarPrice;
  if (numericUsd.length > 0) return Math.min(...numericUsd);
  return null;
}

function findImageAndQc(sheet, rows, row, linkCol) {
  let image = "";
  let qc_link = "";

  for (let col = linkCol + 1; col <= linkCol + 8; col++) {
    const cell = getCell(sheet, row, col);
    if (!image) {
      const extracted = extractImage(cell);
      if (extracted) image = extracted;
    }
    if (!qc_link && normalize(cell?.v) === "QC") {
      qc_link = extractLink(cell);
    }
  }

  return { image, qc_link };
}

function parseXlsxSheet(sheet, sheetName) {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");
  const products = [];

  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = getCell(sheet, row, col);
      const affiliate_link = extractLink(cell);
      if (!affiliate_link.includes("litbuy.com/product")) continue;

      const product_name = findProductName(rows, row, col);
      if (!isValidProductName(product_name)) continue;

      const price = findUsdPrice(sheet, rows, row, col);
      const { image, qc_link } = findImageAndQc(sheet, rows, row, col);

      products.push({
        product_name,
        price,
        affiliate_link,
        image,
        qc_link,
        sheet: sheetName,
      });
    }
  }

  return products;
}

function buildLinkIndex(xlsxProducts) {
  const byLink = new Map();
  for (const product of xlsxProducts) {
    const link = canonicalLink(product.affiliate_link);
    if (link) byLink.set(link, product);
  }
  return byLink;
}

async function fetchGoogleLatestFindsRows() {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${LATEST_FINDS_GID}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Sheets request failed (${response.status})`);
  }

  const raw = await response.text();
  const match = raw.match(/setResponse\((.*)\);?\s*$/s);
  if (!match) throw new Error("Could not parse Google Sheets response");

  const data = JSON.parse(match[1]);
  const rows = data.table?.rows ?? [];
  const parsed = [];
  const seen = new Set();

  for (const row of rows) {
    const cells = row.c ?? [];
    for (let start = 1; start < cells.length; start += 6) {
      const nameCell = cells[start];
      const linkCell = cells[start + 1];
      if (!nameCell || !linkCell) continue;
      if (normalize(linkCell.v) !== "LINK") continue;

      const product_name = normalize(nameCell.v);
      if (!isValidProductName(product_name)) continue;

      let price = null;
      const usdCell = cells[start + 3];
      if (usdCell) {
        const formatted = String(usdCell.f ?? "");
        const value = usdCell.v;
        if (typeof value === "number" && formatted.includes("$")) {
          price = Math.round(value * 100) / 100;
        }
      }

      const key = `${normName(product_name)}::${price ?? "null"}`;
      if (seen.has(key)) continue;
      seen.add(key);

      parsed.push({ product_name, price });
    }
  }

  return parsed;
}

async function fetchSheetEditLinksAndImages() {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${LATEST_FINDS_GID}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Sheets edit page failed (${response.status})`);
  }

  const html = await response.text();
  const links = [];
  const images = [];

  for (const match of html.matchAll(
    /litbuy\.com\/product\/weidian\/\d+\?inviteCode[^"'\\\s]*/gi
  )) {
    const normalized = normalizeLitbuyLink(match[0]);
    if (!normalized || links.includes(normalized)) continue;
    links.push(normalized);
  }

  for (const match of html.matchAll(
    /https?:\/\/i\.postimg\.cc\/[^"'\\\s\]]+\.(?:jpg|jpeg|png|webp)/gi
  )) {
    const image = match[0].split("]")[0].split("\\")[0];
    if (!isUsableImage(image) || images.includes(image)) continue;
    images.push(image);
  }

  return { links, images };
}

function loadXlsxProducts() {
  if (!fs.existsSync(XLSX_PATH)) return [];
  const workbook = XLSX.readFile(XLSX_PATH);
  const all = [];
  for (const sheetName of workbook.SheetNames) {
    all.push(...parseXlsxSheet(workbook.Sheets[sheetName], sheetName));
  }
  return all;
}

function nextId(existing) {
  const max = existing.reduce(
    (highest, product) => Math.max(highest, Number(product.id) || 0),
    0
  );
  return String(max + 1);
}

async function main() {
  console.log("Fetching Latest Finds rows from Google Sheets…");
  const googleRows = await fetchGoogleLatestFindsRows();
  console.log(`  Unique live rows: ${googleRows.length}`);

  console.log("Resolving affiliate links from sheet HTML…");
  const { links, images } = await fetchSheetEditLinksAndImages();
  console.log(`  Embedded LitBuy links: ${links.length}`);
  console.log(`  Embedded image URLs: ${images.length}`);

  const xlsxProducts = loadXlsxProducts();
  const xlsxByLink = buildLinkIndex(xlsxProducts);
  console.log(`  XLSX enrichment pool: ${xlsxProducts.length}`);

  const existing = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const existingLinks = new Set(
    existing.map((product) => canonicalLink(product.affiliate_link))
  );

  const candidates = [];
  const pairCount = Math.min(googleRows.length, links.length);

  for (let index = 0; index < pairCount; index++) {
    const row = googleRows[index];
    const affiliate_link = links[index];
    const link = canonicalLink(affiliate_link);
    if (!link || existingLinks.has(link)) continue;

    const enrichment = xlsxByLink.get(link);
    const image =
      (isUsableImage(images[index]) ? images[index] : "") ||
      enrichment?.image ||
      "";

    candidates.push({
      product_name: row.product_name,
      category: SHEET_META.category,
      category_slug: SHEET_META.slug,
      sheet: SHEET_META.sheet,
      group: SHEET_META.group,
      price: row.price ?? enrichment?.price ?? null,
      affiliate_link,
      qc_link: enrichment?.qc_link ?? "",
      image,
    });
    existingLinks.add(link);
  }

  if (candidates.length === 0) {
    console.log("\nNo new Latest Finds products to add.");
    return;
  }

  let idCounter = Number(nextId(existing));
  const merged = [
    ...existing,
    ...candidates.map((product) => ({
      id: String(idCounter++),
      ...product,
    })),
  ];

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(merged, null, 2), "utf8");

  console.log(`\nAdded ${candidates.length} new Latest Finds products.`);
  console.log(`  Catalog total: ${merged.length}`);
  if (googleRows.length > links.length) {
    console.log(
      `  Note: ${googleRows.length - links.length} sheet rows had no embedded link in HTML.`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
