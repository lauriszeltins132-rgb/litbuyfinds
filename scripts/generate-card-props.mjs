#!/usr/bin/env node
/**
 * Pre-build card display props (avoids bundling products.json + image manifests on the client).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "src/data");

const products = JSON.parse(
  fs.readFileSync(path.join(dataDir, "products.json"), "utf8")
);
const qualityManifest = JSON.parse(
  fs.readFileSync(path.join(dataDir, "image-quality-manifest.json"), "utf8")
);
const processedMap = JSON.parse(
  fs.readFileSync(path.join(dataDir, "processed-image-map.json"), "utf8")
);
const damagedManifest = JSON.parse(
  fs.readFileSync(path.join(dataDir, "damaged-processed-manifest.json"), "utf8")
);
const deadManifest = JSON.parse(
  fs.readFileSync(path.join(dataDir, "dead-image-urls.json"), "utf8")
);
const brightBgManifest = JSON.parse(
  fs.readFileSync(path.join(dataDir, "bright-bg-manifest.json"), "utf8")
);

const damagedUrls = new Set(damagedManifest.urls ?? []);
const damagedPaths = new Set(damagedManifest.paths ?? []);
const deadUrls = new Set(deadManifest.urls ?? []);
const processedUrls = processedMap.urls ?? {};
const qualityUrls = qualityManifest.urls ?? {};
const brightBgUrls = brightBgManifest.urls ?? {};

const FORCE_ORIGINAL = new Set([
  "https://i.postimg.cc/zzMm64y4/1.png",
]);

function hasExactPrice(price) {
  return typeof price === "number" && Number.isFinite(price) && price > 0;
}

function getQualityDetails(url) {
  return qualityUrls[url] ?? null;
}

function getImageQualityScore(url) {
  if (!url || deadUrls.has(url)) return 0;
  return qualityUrls[url]?.score ?? 62;
}

function isProcessedCutoutBlocked(sourceUrl, processedPath, details) {
  if (FORCE_ORIGINAL.has(sourceUrl)) return true;
  if (damagedUrls.has(sourceUrl)) return true;
  if (processedPath && damagedPaths.has(processedPath)) return true;
  if (details?.issues?.includes("damaged_cutout")) return true;
  return false;
}

function isNaturalProductPhoto(sourceUrl, details) {
  if (!details) return false;
  if (details.issues?.includes("dead_url") && (details.score ?? 0) <= 0) {
    return false;
  }
  if (details.isScreenshotStyle) return true;
  if (details.isTransparent && (details.transparencyRatio ?? 0) > 0.15) {
    return true;
  }
  if (brightBgUrls[sourceUrl] === "none") {
    const whiteBlank = details.whiteBlankRatio ?? 0;
    const border = details.borderBrightRatio ?? 0;
    if (whiteBlank < 0.03 && border < 0.05) return true;
  }
  return false;
}

function resolveImage(sourceUrl) {
  const processedPath = processedUrls[sourceUrl];
  const details = getQualityDetails(sourceUrl);
  const cutoutUnsafe = isProcessedCutoutBlocked(
    sourceUrl,
    processedPath,
    details
  );
  const useProcessed =
    processedPath &&
    !cutoutUnsafe &&
    !isNaturalProductPhoto(sourceUrl, details);

  const fill = details?.contentFillRatio;
  let fc = "b";
  if (fill != null) {
    if (fill < 0.32) fc = "s";
    else if (fill >= 0.52) fc = "d";
  }

  let displaySrc = sourceUrl;
  const fallbacks = [];
  if (useProcessed) {
    displaySrc = processedPath;
    fallbacks.push(sourceUrl);
  } else if (processedPath && !cutoutUnsafe) {
    fallbacks.push(processedPath);
  }

  return {
    src: displaySrc,
    fb: fallbacks,
    fc,
    pm: displaySrc.startsWith("/processed/") ? 1 : 0,
  };
}

function trendingScore(product, trendingIndex = 999) {
  let score = getImageQualityScore(product.image);
  if (product.category_slug === "trending-now") {
    score += 30 - Math.min(trendingIndex, 29);
  }
  if (product.category_slug === "latest-finds") score += 15;
  if (hasExactPrice(product.price) && product.price <= 30) score += 10;
  if (hasExactPrice(product.price) && product.price <= 50) score += 5;
  return Math.min(99, Math.max(55, score));
}

function qualityTotal(product) {
  const imageScore = getImageQualityScore(product.image);
  const qc = product.qc_link ? 100 : 0;
  const id = Number(product.id);
  const recency = Number.isFinite(id) ? Math.min(100, Math.round((id / 3200) * 100)) : 30;
  return Math.round(imageScore * 0.58 + qc * 0.12 + recency * 0.1 + 20);
}

function buildRecencyPool(catalog) {
  const latest = catalog
    .filter((p) => p.category_slug === "latest-finds")
    .sort((a, b) => Number(b.id) - Number(a.id));
  const recentCatalog = catalog
    .filter(
      (p) =>
        p.group === "category" &&
        p.category_slug !== "latest-finds" &&
        Number(p.id) >= 2700
    )
    .sort((a, b) => Number(b.id) - Number(a.id));

  const seen = new Set();
  const merged = [];
  for (const product of [...latest, ...recentCatalog]) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    merged.push(product);
  }
  return merged;
}

function buildFreshness(product, recencyRank) {
  if (product.category_slug === "latest-finds") return "r";
  if (recencyRank === null) return null;
  if (recencyRank < 12) return "r";
  if (recencyRank < 36) return "w";
  if (recencyRank < 96) return "i";
  return null;
}

function buildBadges(product, ctx, trendingThreshold) {
  const badges = [];
  const heat = trendingScore(product, ctx.trendingIndex.get(product.id) ?? 999);
  const breakdown = qualityTotal(product);

  if (product.qc_link) badges.push({ kind: "qc", priority: 6 });
  if (product.manual_badges?.length) {
    for (const kind of product.manual_badges) {
      badges.push({ kind, priority: 0 });
    }
  }
  if (ctx.editorsPick.has(product.id)) {
    badges.push({ kind: "editors-pick", priority: 1 });
  }
  if (heat >= trendingThreshold) {
    badges.push({ kind: "trending", priority: 2 });
  }
  if (ctx.popular.has(product.id)) {
    badges.push({ kind: "popular", priority: 3 });
  }
  if (product.category_slug === "latest-finds" || ctx.recent.has(product.id)) {
    badges.push({ kind: "new", priority: 4 });
  }
  if (hasExactPrice(product.price)) {
    if (product.price <= 20) {
      badges.push({ kind: "budget-pick", priority: 5 });
    } else if (product.price <= 45 && breakdown >= 74 && product.qc_link) {
      badges.push({ kind: "best-value", priority: 5 });
    }
  }
  if (breakdown >= 84 && product.qc_link && product.image) {
    badges.push({ kind: "top-quality", priority: 7 });
  }

  const seen = new Set();
  return badges
    .sort((a, b) => a.priority - b.priority)
    .filter((badge) => {
      if (seen.has(badge.kind)) return false;
      seen.add(badge.kind);
      return true;
    })
    .slice(0, 2)
    .map((badge) => badge.kind);
}

function main() {
  const catalog = products.filter((p) => p.image && String(p.image).trim());
  const trendingProducts = catalog.filter((p) => p.category_slug === "trending-now");
  const trendingIndex = new Map(
    trendingProducts.map((p, index) => [p.id, index])
  );

  const editorsPick = new Set(
    [...catalog]
      .filter((p) => p.qc_link && getImageQualityScore(p.image) >= 70)
      .sort((a, b) => qualityTotal(b) - qualityTotal(a))
      .slice(0, 48)
      .map((p) => p.id)
  );

  const popular = new Set(
    [...catalog]
      .filter((p) => editorsPick.has(p.id) && trendingScore(p) >= 62)
      .sort((a, b) => trendingScore(b) - trendingScore(a))
      .slice(0, 24)
      .map((p) => p.id)
  );

  const recencyPool = buildRecencyPool(catalog);
  const recent = new Set(recencyPool.slice(0, 36).map((p) => p.id));
  const recencyRankById = new Map(
    recencyPool.map((product, index) => [product.id, index])
  );

  const ctx = { editorsPick, popular, recent, trendingIndex };
  const cardProps = {};
  let withQc = 0;
  let processedCount = 0;

  for (const product of catalog) {
    if (product.qc_link) withQc += 1;
    const image = resolveImage(product.image);
    if (image.pm === 1) processedCount += 1;
    const entry = { ...image };

    const b = buildBadges(product, ctx, 74);
    const bt = buildBadges(product, ctx, 68);
    if (b.length) entry.b = b;
    if (bt.length && JSON.stringify(bt) !== JSON.stringify(b)) entry.bt = bt;

    const freshness = buildFreshness(
      product,
      recencyRankById.get(product.id) ?? null
    );
    if (freshness) entry.f = freshness;

    cardProps[product.id] = entry;
  }

  const popularRank = [...catalog]
    .sort((a, b) => trendingScore(b) - trendingScore(a))
    .slice(0, 120)
    .map((p) => p.id);

  fs.writeFileSync(
    path.join(dataDir, "card-props.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), p: cardProps })
  );

  fs.writeFileSync(
    path.join(dataDir, "popular-rank.json"),
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      ids: popularRank,
    })
  );

  const batchMislabelTitles = [];
  const byTitle = new Map();
  for (const product of products) {
    const title = product.product_name.trim();
    const parts = title.split(/\s+/).filter(Boolean);
    if (parts.length !== 2) continue;
    const type = parts[1].toLowerCase();
    const generic =
      /^(bag|bags|backpack|shoe|shoes|sneaker|sneakers|jacket|jackets|hoodie|hoodies|hat|hats|cap|caps|tee|tees|t-shirt|belt|belts|watch|watches|glasses|sunglasses|pants|shorts|vest|vests|coat|coats|parka|boot|boots|sandals|slide|slides|runner|runners|trainer|trainers|footwear|accessories|find|set|perfume|sweater|sweaters|polo|polos|shirt|shirts|top|tops|scarf|scarves|wallet|wallets|ring|rings|necklace|necklaces|bracelet|bracelets)$/.test(
        type
      );
    if (!generic) continue;
    const link = product.affiliate_link.trim().toLowerCase();
    const links = byTitle.get(title) ?? new Set();
    links.add(link);
    byTitle.set(title, links);
  }
  for (const [title, links] of byTitle.entries()) {
    if (links.size >= 2) batchMislabelTitles.push(title);
  }
  fs.writeFileSync(
    path.join(dataDir, "batch-mislabel-titles.json"),
    JSON.stringify({ titles: batchMislabelTitles })
  );

  const navPath = path.join(dataDir, "site-navigation.json");
  const nav = JSON.parse(fs.readFileSync(navPath, "utf8"));
  nav.catalogStats = {
    withQc,
    total: catalog.length,
  };
  fs.writeFileSync(navPath, JSON.stringify(nav));

  console.log(
    `Card props → ${Object.keys(cardProps).length} products, ${processedCount} processed cutouts, QC count → ${withQc}`
  );
}

main();
