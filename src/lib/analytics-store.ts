import path from "path";
import type { ConversionEvent } from "./analytics-events";

type ProductClicks = {
  name: string;
  brand: string;
  clicks: number;
  saves: number;
};

type PlacementStats = {
  impressions: number;
  clicks: number;
};

type DayProduct = {
  name: string;
  clicks: number;
  spreadsheetBuys: number;
  productPageBuys: number;
};

type DayBucket = {
  spreadsheetPageViews: number;
  spreadsheetProductClicks: number;
  spreadsheetBuyClicks: number;
  productPageViews: number;
  productBuyClicks: number;
  signupClicks: number;
  invitePageViews: number;
  products: Record<string, DayProduct>;
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
  signupPlacements: Record<string, PlacementStats>;
  days?: Record<string, DayBucket>;
  updatedAt: string;
};

type EventBody = {
  event: ConversionEvent;
  location?: string;
  productId?: string;
  productName?: string;
  brand?: string;
  category?: string;
  href?: string;
  variant?: string;
  query?: string;
  agent?: string;
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
    signupPlacements: {},
    days: {},
    updatedAt: new Date().toISOString(),
  };
}

function emptyDay(): DayBucket {
  return {
    spreadsheetPageViews: 0,
    spreadsheetProductClicks: 0,
    spreadsheetBuyClicks: 0,
    productPageViews: 0,
    productBuyClicks: 0,
    signupClicks: 0,
    invitePageViews: 0,
    products: {},
  };
}

function dayKey(ts = Date.now()) {
  return new Date(ts).toISOString().slice(0, 10);
}

function currentDay(store: AnalyticsStore): DayBucket {
  if (!store.days) store.days = {};
  const key = dayKey();
  if (!store.days[key]) store.days[key] = emptyDay();
  const cutoff = Date.now() - 8 * 24 * 60 * 60 * 1000;
  for (const existing of Object.keys(store.days)) {
    const stamp = Date.parse(`${existing}T00:00:00.000Z`);
    if (Number.isFinite(stamp) && stamp < cutoff) delete store.days[existing];
  }
  return store.days[key];
}

function dayProduct(day: DayBucket, body: EventBody): DayProduct {
  const id = body.productId || "unknown";
  const existing = day.products[id] ?? {
    name: body.productName || "Find",
    clicks: 0,
    spreadsheetBuys: 0,
    productPageBuys: 0,
  };
  if (body.productName) existing.name = body.productName;
  day.products[id] = existing;
  return existing;
}

function recentDays(store: AnalyticsStore): DayBucket[] {
  const days = store.days ?? {};
  const buckets: DayBucket[] = [];
  for (let offset = 0; offset < 7; offset += 1) {
    const key = dayKey(Date.now() - offset * 24 * 60 * 60 * 1000);
    if (days[key]) buckets.push(days[key]);
  }
  return buckets;
}

function rate(part: number, whole: number) {
  if (whole <= 0) return 0;
  return Number(((part / whole) * 100).toFixed(2));
}

function bumpPlacement(
  store: AnalyticsStore,
  location: string | undefined,
  kind: "impressions" | "clicks"
) {
  if (!location) return;
  const existing = store.signupPlacements[location] ?? {
    impressions: 0,
    clicks: 0,
  };
  existing[kind] += 1;
  store.signupPlacements[location] = existing;
}

function getFs() {
  if (typeof window !== "undefined") return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("fs") as typeof import("fs");
  } catch {
    return null;
  }
}

function readFileStore(): AnalyticsStore | null {
  const fs = getFs();
  if (!fs) return null;
  try {
    if (!fs.existsSync(STORE_PATH)) return null;
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8")) as AnalyticsStore;
  } catch {
    return null;
  }
}

function writeFileStore(store: AnalyticsStore) {
  const fs = getFs();
  if (!fs) return;
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
  brand: string,
  kind: "clicks" | "saves" = "clicks"
) {
  const existing = store.products[productId];
  if (existing) {
    existing[kind] += 1;
    return;
  }
  store.products[productId] = {
    name: productName,
    brand,
    clicks: kind === "clicks" ? 1 : 0,
    saves: kind === "saves" ? 1 : 0,
  };
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
      bumpPlacement(store, body.location, "impressions");
      break;
    case "register_click":
      store.registerClicks += 1;
      bumpPlacement(store, body.location, "clicks");
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
    case "save_click":
      if (body.productId) {
        bumpProduct(
          store,
          body.productId,
          body.productName ?? "Saved item",
          body.brand ?? "Unknown",
          "saves"
        );
      }
      break;
    case "discord_click":
      store.discordClicks += 1;
      break;
    case "telegram_click":
      store.telegramClicks += 1;
      break;
    case "popup_impression":
      bumpPlacement(store, body.location, "impressions");
      break;
    case "popup_close":
      bumpPlacement(store, `${body.location}_close`, "clicks");
      break;
    case "spreadsheet_page_view":
      currentDay(store).spreadsheetPageViews += 1;
      break;
    case "spreadsheet_product_click": {
      const day = currentDay(store);
      day.spreadsheetProductClicks += 1;
      if (body.productId) dayProduct(day, body).clicks += 1;
      break;
    }
    case "spreadsheet_buy_click": {
      const day = currentDay(store);
      day.spreadsheetBuyClicks += 1;
      store.buyClicks += 1;
      if (body.productId) dayProduct(day, body).spreadsheetBuys += 1;
      if (body.productId && body.productName) {
        bumpProduct(store, body.productId, body.productName, body.brand ?? "Unknown");
      }
      break;
    }
    case "spreadsheet_qc_click":
      store.qcClicks += 1;
      break;
    case "product_page_view":
      currentDay(store).productPageViews += 1;
      break;
    case "product_buy_click": {
      const day = currentDay(store);
      day.productBuyClicks += 1;
      store.buyClicks += 1;
      if (body.productId) {
        const entry = dayProduct(day, body);
        entry.productPageBuys += 1;
        if (body.query === "spreadsheet") entry.spreadsheetBuys += 1;
      }
      if (body.productId && body.productName) {
        bumpProduct(store, body.productId, body.productName, body.brand ?? "Unknown");
      }
      break;
    }
    case "litbuy_signup_click":
      currentDay(store).signupClicks += 1;
      break;
    case "invite_page_view":
      currentDay(store).invitePageViews += 1;
      break;
    case "agent_changed":
      break;
    default:
      break;
  }

  store.updatedAt = new Date().toISOString();
  globalThis.__litbuyAnalyticsStore = store;
  writeFileStore(store);
}

export function getProductEngagementScore(productId: string): number {
  const entry = getStore().products[productId];
  return entry?.clicks ?? 0;
}

export function getProductSaveScore(productId: string): number {
  const entry = getStore().products[productId];
  return entry?.saves ?? 0;
}

export function getProductCombinedEngagement(productId: string): number {
  return getProductEngagementScore(productId) + getProductSaveScore(productId);
}

export function getProductEngagementMap(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const [id, value] of Object.entries(getStore().products)) {
    map[id] = value.clicks;
  }
  return map;
}

export function getTopProductIds(limit = 12): string[] {
  return Object.entries(getStore().products)
    .sort(([, a], [, b]) => b.clicks - a.clicks)
    .slice(0, limit)
    .map(([id]) => id);
}

export function getProductEngagementStats(productId: string): {
  views: number;
  saves: number;
} {
  const entry = getStore().products[productId];
  return {
    views: entry?.clicks ?? 0,
    saves: entry?.saves ?? 0,
  };
}

export function isProductTrending(productId: string, limit = 24): boolean {
  return getTopProductIds(limit).includes(productId);
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

  const topSignupPlacements = Object.entries(store.signupPlacements)
    .map(([location, value]) => ({
      location,
      impressions: value.impressions,
      clicks: value.clicks,
      ctr:
        value.impressions > 0
          ? Number(((value.clicks / value.impressions) * 100).toFixed(2))
          : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 12);

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
    topSignupPlacements,
    salesFunnel: getSalesFunnel(store),
    updatedAt: store.updatedAt,
  };
}

export function getPopularSpreadsheetIds(limit = 12): string[] {
  const totals = new Map<string, number>();
  for (const day of recentDays(getStore())) {
    for (const [id, value] of Object.entries(day.products)) {
      if (value.spreadsheetBuys <= 0) continue;
      totals.set(id, (totals.get(id) ?? 0) + value.spreadsheetBuys);
    }
  }
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}

function getSalesFunnel(store: AnalyticsStore) {
  const days = recentDays(store);
  const totals = days.reduce(
    (sum, day) => ({
      spreadsheetPageViews: sum.spreadsheetPageViews + day.spreadsheetPageViews,
      spreadsheetProductClicks: sum.spreadsheetProductClicks + day.spreadsheetProductClicks,
      spreadsheetBuyClicks: sum.spreadsheetBuyClicks + day.spreadsheetBuyClicks,
      productPageViews: sum.productPageViews + day.productPageViews,
      productBuyClicks: sum.productBuyClicks + day.productBuyClicks,
      signupClicks: sum.signupClicks + day.signupClicks,
      invitePageViews: sum.invitePageViews + day.invitePageViews,
    }),
    {
      spreadsheetPageViews: 0,
      spreadsheetProductClicks: 0,
      spreadsheetBuyClicks: 0,
      productPageViews: 0,
      productBuyClicks: 0,
      signupClicks: 0,
      invitePageViews: 0,
    }
  );

  const products = new Map<string, DayProduct>();
  for (const day of days) {
    for (const [id, value] of Object.entries(day.products)) {
      const existing = products.get(id) ?? {
        name: value.name,
        clicks: 0,
        spreadsheetBuys: 0,
        productPageBuys: 0,
      };
      existing.name = value.name || existing.name;
      existing.clicks += value.clicks;
      existing.spreadsheetBuys += value.spreadsheetBuys;
      existing.productPageBuys += value.productPageBuys;
      products.set(id, existing);
    }
  }

  const topBuyProducts = [...products.entries()]
    .map(([id, value]) => {
      const buyClicks = value.spreadsheetBuys + value.productPageBuys;
      return {
        id,
        name: value.name,
        buyClicks,
        productClicks: value.clicks,
        buyCtr: rate(buyClicks, value.clicks),
      };
    })
    .filter((item) => item.buyClicks > 0)
    .sort((a, b) => b.buyClicks - a.buyClicks)
    .slice(0, 10);

  return {
    ...totals,
    productInteractionRate: rate(totals.spreadsheetProductClicks, totals.spreadsheetPageViews),
    spreadsheetBuyCtr: rate(totals.spreadsheetBuyClicks, totals.spreadsheetPageViews),
    productPageBuyRate: rate(totals.productBuyClicks, totals.productPageViews),
    signupClickRate: rate(totals.signupClicks, totals.invitePageViews),
    topBuyProducts,
  };
}
