/**
 * Shared utilities for live Google Sheets → products.json imports.
 * Spreadsheet: 1uCskcK_kpAjJ82uAbHJ-do8jqLZ2_WBx4SRnhKDMmTA
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, "..");
export const PRODUCTS_PATH = path.join(ROOT, "src", "data", "products.json");

export const SPREADSHEET_ID = "1uCskcK_kpAjJ82uAbHJ-do8jqLZ2_WBx4SRnhKDMmTA";

/** Tab name → gid mapping (parsed from sheet bootstrap model). */
export const SPREADSHEET_SHEETS = [
  {
    sheet: "🔥Trending Now 🔥",
    gid: "470997016",
    category: "Trending Now",
    slug: "trending-now",
    group: "featured",
  },
  {
    sheet: "🔍Latest Finds 🔍",
    gid: "1185828767",
    category: "Latest Finds",
    slug: "latest-finds",
    group: "featured",
  },
  {
    sheet: "👞SHOES👞",
    gid: "623384649",
    category: "Shoes",
    slug: "shoes",
    group: "category",
  },
  {
    sheet: "🥼Hoodies and Pants👖",
    gid: "852587554",
    category: "Hoodies and Pants",
    slug: "hoodies-and-pants",
    group: "category",
  },
  {
    sheet: "🧥Coats and Jackets🧥",
    gid: "904819645",
    category: "Coats and Jackets",
    slug: "coats-and-jackets",
    group: "category",
  },
  {
    sheet: "👕T-shirt and shorts🩳",
    category: "T-shirt and Shorts",
    slug: "tshirts-and-shorts",
    group: "category",
    gid: "764098395",
  },
  {
    sheet: "👜 Accessories👜",
    gid: "1695680711",
    category: "Accessories",
    slug: "accessories",
    group: "category",
  },
  {
    sheet: "🎧Electronic products🎧",
    gid: "1234283086",
    category: "Electronic Products",
    slug: "electronics",
    group: "category",
  },
];

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

export function normalize(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function canonicalLink(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url.trim());
    return `${parsed.origin}${parsed.pathname}`.toLowerCase();
  } catch {
    return url.trim().toLowerCase().split("?")[0];
  }
}

export function normalizeLitbuyLink(url) {
  let value = normalize(url);
  if (!value) return "";
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  if (!value.includes("litbuy.com/product/")) return "";
  if (!value.includes("inviteCode=")) {
    value += value.includes("?") ? "&inviteCode=SMKS" : "?inviteCode=SMKS";
  }
  return value.replace(/inviteCode=[^&]+/, "inviteCode=SMKS");
}

export function isSocialAsset(image = "", name = "") {
  const haystack = `${image} ${name}`.toLowerCase();
  return (
    haystack.includes("whatsapp") ||
    haystack.includes("telegram") ||
    haystack.includes("discord.gg")
  );
}

export function isUsableImage(url) {
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

export function isValidProductName(name) {
  const value = normalize(name);
  if (!value || value.length < 2) return false;
  if (/^(link|qc|product|image)$/i.test(value)) return false;
  if (/^latest finds/i.test(value)) return false;
  if (/^fashion bottoms$/i.test(value)) return false;
  if (/^use ctrl\+f/i.test(value)) return false;
  if (/^seller collaboration/i.test(value)) return false;
  if (/^this is a spreadsheet/i.test(value)) return false;
  if (isSocialAsset("", value)) return false;
  return true;
}

export function normalizeProductName(name) {
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

function parseUsdPrice(nums) {
  const fractional = nums.find(
    (value) =>
      value >= 3 &&
      value <= 350 &&
      Math.abs(value - Math.round(value)) > 0.001
  );
  if (fractional != null) return Math.round(fractional * 100) / 100;

  const whole = nums.find((value) => value >= 3 && value <= 350);
  if (whole != null) return Math.round(whole * 100) / 100;
  return null;
}

/**
 * Parse LitBuy product rows from the embedded Google Sheets model HTML.
 * Supports weidian + taobao affiliate links.
 */
export function parseSheetHtml(html) {
  const products = [];
  const needles = [
    "litbuy.com/product/weidian/",
    "litbuy.com/product/taobao/",
  ];
  const suffixes = [
    "?inviteCode\\\\u003dSMKS",
    "?inviteCode\\\\u003dSMK",
    "&inviteCode\\\\u003dSMKS",
  ];

  for (const needle of needles) {
    const platform = needle.includes("weidian") ? "weidian" : "taobao";
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

      const listingId = html.slice(start + needle.length, end);
      if (!/^\d+$/.test(listingId)) {
        idx = start + 1;
        continue;
      }

      const affiliate_link = normalizeLitbuyLink(
        `https://litbuy.com/product/${platform}/${listingId}?inviteCode=SMKS`
      );
      const before = html.slice(Math.max(0, start - 1800), start);
      const after = html.slice(start, start + 1800);

      const inlineNames = [
        ...before.matchAll(/\[2,\\"([^\\"]{2,120})\\"\]/g),
      ].map((match) => normalizeProductName(match[1]));

      const invalidName =
        /^(LINK|QC|PRODUCT|Litbuy|IMAGE|SHOES|SCARF|USE CTRL|This is a|seller|TELEGRAM|discord)/i;

      let image = extractImageNear(html, start);
      if (!image) {
        const imgMatch = after.match(
          /postimg\.cc\/([^\\"]+\.(?:png|jpg|jpeg|webp))/i
        );
        image = imgMatch ? `https://i.postimg.cc/${imgMatch[1]}` : "";
      }

      const product_name =
        [...inlineNames].reverse().find((name) => name && !invalidName.test(name)) ||
        nameFromImage(image);

      const nums = [...after.matchAll(/\\"3\\":(\d+(?:\.\d+)?)/g)].map((match) =>
        parseFloat(match[1])
      );
      const price = parseUsdPrice(nums);

      let qc_link = "";
      const qcMatch = after.match(
        /qcphotos\.com\/[^\s"\\]+|imgur\.com\/[^\s"\\]+/i
      );
      if (qcMatch) {
        const candidate = qcMatch[0].startsWith("http")
          ? qcMatch[0]
          : `https://${qcMatch[0]}`;
        if (/^https?:\/\//i.test(candidate)) qc_link = candidate;
      }

      products.push({
        product_name: normalizeProductName(product_name),
        price,
        affiliate_link,
        image: sanitizeImageUrl(image),
        qc_link,
      });

      idx = end + 8;
    }
  }

  return products;
}

export function dedupeByLink(products) {
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

export function validateImportRow(row) {
  if (!normalizeLitbuyLink(row.affiliate_link)) {
    return { ok: false, reason: "invalid_link" };
  }
  if (!isValidProductName(row.product_name)) {
    return { ok: false, reason: "invalid_name" };
  }
  if (!isUsableImage(row.image)) {
    return { ok: false, reason: "missing_image" };
  }
  if (isSocialAsset(row.image, row.product_name)) {
    return { ok: false, reason: "social_asset" };
  }
  return { ok: true };
}

export async function fetchSheetHtml(gid, { retries = 5, delayMs = 2500 } = {}) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${gid}`;

  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url, {
      headers: FETCH_HEADERS,
      redirect: "manual",
    });

    let html = await response.text();
    const linkCount = [...html.matchAll(/litbuy\.com\/product\//gi)].length;

    if (html.length > 400_000 && linkCount > 0) {
      return html;
    }

    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get("location");
      if (location && !location.includes("htmlview")) {
        const follow = await fetch(
          location.startsWith("http")
            ? location
            : `https://docs.google.com${location}`,
          { headers: FETCH_HEADERS, redirect: "follow" }
        );
        html = await follow.text();
        if (html.length > 400_000 && html.includes("litbuy.com/product/")) {
          return html;
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
  }

  throw new Error(
    `Could not fetch sheet model HTML for gid=${gid} (rate-limited or unavailable)`
  );
}

export async function fetchGvizPriceQueues(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
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
      const label = normalize(cells[index]?.v);
      if (label !== "LINK" && !label.includes("Litbuy")) continue;

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

export function enrichPriceFromGviz(row, queues) {
  if (row.price != null) return row.price;
  const key = row.product_name.toLowerCase();
  const queue = queues.get(key);
  if (!queue || queue.length === 0) return null;
  return queue.shift() ?? null;
}

export function nextProductId(existing) {
  const max = existing.reduce(
    (highest, product) => Math.max(highest, Number(product.id) || 0),
    0
  );
  return String(max + 1);
}

export function loadProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
}

export function saveProducts(products) {
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf8");
}

export function buildCatalogProduct(row, sheetMeta, id) {
  return {
    id,
    product_name: row.product_name,
    category: sheetMeta.category,
    category_slug: sheetMeta.slug,
    sheet: sheetMeta.sheet,
    group: sheetMeta.group,
    price: row.price,
    affiliate_link: row.affiliate_link,
    qc_link: row.qc_link ?? "",
    image: row.image,
  };
}
