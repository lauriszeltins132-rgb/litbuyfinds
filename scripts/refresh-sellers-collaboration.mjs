#!/usr/bin/env node
/**
 * Refresh sellers-collaboration.json from Weidian item IDs.
 *
 * Reads weidianId (or sourceUrl) entries from the existing config,
 * fetches title/price/image from Weidian, downloads images into
 * public/sellers-collaboration/ for reliable same-origin loading,
 * and rewrites the JSON.
 *
 * Run: node scripts/refresh-sellers-collaboration.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_PATH = path.join(ROOT, "src", "data", "sellers-collaboration.json");
const IMAGE_DIR = path.join(ROOT, "public", "sellers-collaboration");
const CNY_PER_USD = 6.5;

function cleanTitle(title) {
  return String(title || "")
    .replace(/\s*-\s*Sm\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractId(entry) {
  if (entry?.weidianId) return String(entry.weidianId);
  const match = String(entry?.sourceUrl || "").match(/itemID=(\d+)/i);
  return match?.[1] || "";
}

async function fetchOne(id) {
  const param = encodeURIComponent(JSON.stringify({ itemId: String(id) }));
  const url = `https://thor.weidian.com/detail/getItemSkuInfo/1.0?param=${param}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Referer: "https://weidian.com/",
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${id}`);
  const data = await res.json();
  if (!data?.status || data.status.code !== 0 || !data.result) {
    throw new Error(`API fail ${id}: ${JSON.stringify(data?.status)}`);
  }
  const r = data.result;
  const fen = Number(r.itemDiscountLowPrice || r.itemOriginalLowPrice || 0);
  const cny = fen > 0 ? fen / 100 : null;
  const usd =
    cny != null ? Math.round((cny / CNY_PER_USD) * 100) / 100 : null;
  const sourceImage =
    r.itemMainPic || r.attrList?.[0]?.attrValues?.[0]?.img || "";

  return {
    weidianId: String(id),
    sourceUrl: `https://weidian.com/item.html?itemID=${id}`,
    product_name: cleanTitle(r.itemTitle) || `Weidian find ${id}`,
    price_cny: cny,
    price: usd,
    sourceImage,
    qc_link: "",
  };
}

async function downloadImage(id, sourceImage) {
  if (!sourceImage) return "";
  const extMatch = sourceImage.match(/\.(jpe?g|png|webp)(?:$|\?)/i);
  const ext = (extMatch?.[1] || "jpg").toLowerCase().replace("jpeg", "jpg");
  const filename = `${id}.${ext}`;
  const dest = path.join(IMAGE_DIR, filename);
  const res = await fetch(sourceImage, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: "https://weidian.com/",
      Accept: "image/*",
    },
  });
  if (!res.ok) throw new Error(`image HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error(`image too small (${buf.length})`);
  fs.writeFileSync(dest, buf);
  return `/sellers-collaboration/${filename}`;
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(OUT_PATH, "utf8"));
  const ids = existing.products.map(extractId).filter(Boolean);
  if (ids.length === 0) {
    throw new Error("No weidian IDs found in sellers-collaboration.json");
  }

  fs.mkdirSync(IMAGE_DIR, { recursive: true });

  const products = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const item = await fetchOne(id);
    let image = item.sourceImage;
    try {
      image = (await downloadImage(id, item.sourceImage)) || item.sourceImage;
    } catch (err) {
      console.warn(`  image fallback for ${id}: ${err.message}`);
    }
    products.push({
      weidianId: item.weidianId,
      sourceUrl: item.sourceUrl,
      product_name: item.product_name,
      price_cny: item.price_cny,
      price: item.price,
      image,
      sourceImage: item.sourceImage,
      qc_link: item.qc_link,
    });
    console.log(
      `[${i + 1}/${ids.length}] ${id} $${item.price} ${item.product_name.slice(0, 50)}`
    );
    await new Promise((r) => setTimeout(r, 100));
  }

  const payload = {
    title: existing.title || "Other Sellers Collaboration",
    subtitle:
      existing.subtitle || "Sponsored seller picks and partner products",
    updatedAt: new Date().toISOString().slice(0, 10),
    products,
  };

  fs.writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${products.length} products → ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
