/**
 * Reads data/products.xlsx and writes src/data/products.json
 *
 * Uses link-centric parsing: finds every LitBuy hyperlink in the grid,
 * then reads the product name, price, image, and QC from nearby cells.
 *
 * Run: npm run convert-data
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const OUTPUT = path.join(ROOT, "src", "data", "products.json");

const SHEET_META = {
  "🔥Trending Now 🔥": { category: "Trending Now", slug: "trending-now", group: "featured" },
  "🔍Latest Finds 🔍": { category: "Latest Finds", slug: "latest-finds", group: "featured" },
  "👞SHOES👞": { category: "Shoes", slug: "shoes", group: "category" },
  "🥼Hoodies and Pants👖": { category: "Hoodies and Pants", slug: "hoodies-and-pants", group: "category" },
  "🧥Coats and Jackets🧥": { category: "Coats and Jackets", slug: "coats-and-jackets", group: "category" },
  "👕T-shirt and shorts🩳": { category: "T-shirt and Shorts", slug: "tshirts-and-shorts", group: "category" },
  "👜 Accessories👜": { category: "Accessories", slug: "accessories", group: "category" },
  "🎧Electronic products🎧": { category: "Electronic Products", slug: "electronics", group: "category" },
};

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

function normalize(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
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
  if (/^https?:\/\//i.test(value)) return value;
  return "";
}

function extractLink(cell) {
  if (!cell) return "";
  if (cell.l?.Target) return cell.l.Target;
  const value = normalize(cell.v);
  if (/^https?:\/\//i.test(value)) return value;
  return "";
}

function parsePrice(value) {
  if (value === "" || value === null || value === undefined) return null;
  if (typeof value === "number" && !isNaN(value)) {
    return Math.round(value * 100) / 100;
  }
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : Math.round(num * 100) / 100;
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
  if (/^us dollar/i.test(name)) return false;
  if (/^euro/i.test(name)) return false;
  if (/^telegram/i.test(name)) return false;
  if (/^discord/i.test(name)) return false;
  if (/^after-sales/i.test(name)) return false;
  if (/^best finds/i.test(name)) return false;
  if (/^this is a spreadsheet/i.test(name)) return false;
  if (/^most popular/i.test(name)) return false;
  if (/^🔥/.test(name) && /items/i.test(name)) return false;
  return name.length > 1;
}

function findProductName(rows, row, linkCol) {
  for (let col = linkCol - 1; col >= Math.max(0, linkCol - 4); col--) {
    const name = normalize(rows[row]?.[col]);
    if (isValidProductName(name)) return name;
  }
  return "";
}

function findUsdPrice(rows, row, linkCol) {
  const candidates = [];
  for (let col = linkCol + 1; col <= linkCol + 5; col++) {
    const price = parsePrice(rows[row]?.[col]);
    if (price !== null) candidates.push(price);
  }

  if (candidates.length === 0) return null;

  // USD is almost always the smallest value near the link cell.
  const usdCandidates = candidates.filter((price) => price > 0 && price <= 350);
  if (usdCandidates.length > 0) {
    return Math.min(...usdCandidates);
  }

  return candidates[candidates.length - 1];
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

function parseSheet(sheet, sheetName) {
  const meta = SHEET_META[sheetName] ?? {
    category: sheetName,
    slug: sheetName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    group: "category",
  };

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");
  const products = [];
  const seenInSheet = new Set();

  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = getCell(sheet, row, col);
      const affiliate_link = extractLink(cell);

      if (!affiliate_link.includes("litbuy.com")) continue;

      const product_name = findProductName(rows, row, col);
      if (!product_name) continue;

      const dedupeKey = `${row}:${col}:${affiliate_link}`;
      if (seenInSheet.has(dedupeKey)) continue;
      seenInSheet.add(dedupeKey);

      const price = findUsdPrice(rows, row, col);
      const { image, qc_link } = findImageAndQc(sheet, rows, row, col);

      products.push({
        product_name,
        category: meta.category,
        category_slug: meta.slug,
        sheet: sheetName,
        group: meta.group,
        price,
        affiliate_link,
        qc_link,
        image,
      });
    }
  }

  return products;
}

function findSpreadsheetFile() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((file) => /\.(xlsx|xls)$/i.test(file) && !file.startsWith("~$"));

  if (files.length === 0) {
    throw new Error(`No Excel file found in ${DATA_DIR}`);
  }

  return path.join(DATA_DIR, files[0]);
}

function main() {
  const inputPath = findSpreadsheetFile();
  console.log("Reading:", inputPath);

  const workbook = XLSX.readFile(inputPath);
  const allProducts = [];
  let id = 1;

  for (const sheetName of workbook.SheetNames) {
    const sheetProducts = parseSheet(workbook.Sheets[sheetName], sheetName);
    console.log(`  ${sheetName}: ${sheetProducts.length} products`);

    for (const product of sheetProducts) {
      allProducts.push({ id: String(id++), ...product });
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(allProducts, null, 2), "utf8");

  const uniqueUrls = new Set(
    allProducts.map((product) => product.affiliate_link).filter(Boolean)
  );

  console.log(`\nDone! Wrote ${allProducts.length} products to ${OUTPUT}`);
  console.log(`  With affiliate links: ${allProducts.filter((p) => p.affiliate_link).length}`);
  console.log(`  With images: ${allProducts.filter((p) => p.image).length}`);
  console.log(`  Unique LitBuy URLs: ${uniqueUrls.size}`);
}

main();
