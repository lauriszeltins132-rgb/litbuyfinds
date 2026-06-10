import fs from "fs";
import path from "path";
import type { ConversionEvent } from "./analytics-events";

type ProductClicks = {
  name: string;
  brand: string;
  clicks: number;
};

export type AnalyticsStore = {
  pageViews: number;
  productViews: number;
  registerImpressions: number;
  registerClicks: number;
  buyClicks: number;
  qcClicks: number;
  discordClicks: number;
  telegramClicks: number;
  products: Record<string, ProductClicks>;
  brands: Record<string, number>;
  updatedAt: string;
};

type EventBody = {
  event: ConversionEvent;
  location?: string;
  productId?: string;
  productName?: string;
  brand?: string;
  category?: string;
};

const STORE_PATH = path.join(process.cwd(), "data/analytics-stats.json");

declare global {
  var __litbuyAnalyticsStore: AnalyticsStore | undefined;
}

function emptyStore(): AnalyticsStore {
  return {
    pageViews: 0,
    productViews: 0,
    registerImpressions: 0,
    registerClicks: 0,
    buyClicks: 0,
    qcClicks: 0,
    discordClicks: 0,
    telegramClicks: 0,
    products: {},
    brands: {},
    updatedAt: new Date().toISOString(),
  };
}

function readFileStore(): AnalyticsStore | null {
  try {
    if (!fs.existsSync(STORE_PATH)) return null;
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8")) as AnalyticsStore;
  } catch {
    return null;
  }
}

function writeFileStore(store: AnalyticsStore) {
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
  } catch {
    // read-only filesystem on serverless — memory store still works
  }
}

export function getStore(): AnalyticsStore {
  if (!globalThis.__litbuyAnalyticsStore) {
    globalThis.__litbuyAnalyticsStore = readFileStore() ?? emptyStore();
  }
  return globalThis.__litbuyAnalyticsStore;
}

function bumpProduct(
  store: AnalyticsStore,
  productId: string,
  productName: string,
  brand: string
) {
  const existing = store.products[productId];
  if (existing) {
    existing.clicks += 1;
    return;
  }
  store.products[productId] = { name: productName, brand, clicks: 1 };
}

function bumpBrand(store: AnalyticsStore, brand?: string) {
  if (!brand) return;
  store.brands[brand] = (store.brands[brand] ?? 0) + 1;
}

export function recordEvent(body: EventBody) {
  const store = getStore();

  switch (body.event) {
    case "page_view":
      store.pageViews += 1;
      break;
    case "product_view":
      store.productViews += 1;
      if (body.productId && body.productName) {
        bumpProduct(store, body.productId, body.productName, body.brand ?? "Unknown");
      }
      break;
    case "register_impression":
      store.registerImpressions += 1;
      break;
    case "register_click":
      store.registerClicks += 1;
      break;
    case "buy_click":
      store.buyClicks += 1;
      if (body.productId && body.productName) {
        bumpProduct(store, body.productId, body.productName, body.brand ?? "Unknown");
      }
      bumpBrand(store, body.brand);
      break;
    case "qc_click":
      store.qcClicks += 1;
      if (body.productId && body.productName) {
        bumpProduct(store, body.productId, body.productName, body.brand ?? "Unknown");
      }
      bumpBrand(store, body.brand);
      break;
    case "discord_click":
      store.discordClicks += 1;
      break;
    case "telegram_click":
      store.telegramClicks += 1;
      break;
    default:
      break;
  }

  store.updatedAt = new Date().toISOString();
  globalThis.__litbuyAnalyticsStore = store;
  writeFileStore(store);
}

export function getAnalyticsSummary() {
  const store = getStore();

  const topProducts = Object.entries(store.products)
    .map(([id, value]) => ({
      id,
      name: value.name,
      brand: value.brand,
      clicks: value.clicks,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  const topBrands = Object.entries(store.brands)
    .map(([name, clicks]) => ({ name, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  const registerDenominator =
    store.registerImpressions > 0 ? store.registerImpressions : store.pageViews;
  const registerCtr =
    registerDenominator > 0
      ? Number(((store.registerClicks / registerDenominator) * 100).toFixed(2))
      : 0;

  const buyCtr =
    store.productViews > 0
      ? Number(((store.buyClicks / store.productViews) * 100).toFixed(2))
      : 0;

  return {
    totals: {
      pageViews: store.pageViews,
      productViews: store.productViews,
      registerImpressions: store.registerImpressions,
      registerClicks: store.registerClicks,
      buyClicks: store.buyClicks,
      qcClicks: store.qcClicks,
      discordClicks: store.discordClicks,
      telegramClicks: store.telegramClicks,
    },
    topProducts,
    topBrands,
    registerCtr,
    buyCtr,
    updatedAt: store.updatedAt,
  };
}
