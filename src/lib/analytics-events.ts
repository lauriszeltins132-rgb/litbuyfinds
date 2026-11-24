import { track } from "@vercel/analytics";
import { extractBrand } from "./brands";
import type { Product } from "./types";

export type ConversionEvent =
  | "page_view"
  | "product_view"
  | "register_impression"
  | "register_click"
  | "buy_click"
  | "qc_click"
  | "discord_click"
  | "telegram_click"
  | "broken_image"
  | "search_submit"
  | "search_chip_click"
  | "save_click"
  | "category_click"
  | "brand_click"
  | "collection_click"
  | "popup_impression"
  | "popup_close"
  | "spreadsheet_page_view"
  | "spreadsheet_product_click"
  | "spreadsheet_buy_click"
  | "spreadsheet_qc_click"
  | "product_page_view"
  | "product_buy_click"
  | "agent_changed"
  | "invite_page_view"
  | "litbuy_signup_click";

export type ConversionPayload = {
  location?: string;
  productId?: string;
  productName?: string;
  brand?: string;
  category?: string;
  query?: string;
  href?: string;
  variant?: string;
  agent?: string;
};

const COMPACT_VERCEL_EVENTS = new Set<ConversionEvent>([
  "spreadsheet_page_view",
  "spreadsheet_product_click",
  "spreadsheet_buy_click",
  "spreadsheet_qc_click",
  "product_page_view",
  "product_buy_click",
  "agent_changed",
  "invite_page_view",
  "litbuy_signup_click",
]);

/** Vercel Pro custom events stay on two properties: product_id and location. */
function vercelPayload(event: ConversionEvent, payload: ConversionPayload) {
  if (!COMPACT_VERCEL_EVENTS.has(event)) return cleanPayload(payload);
  const compact: Record<string, string> = {};
  if (payload.location) compact.location = payload.location;
  if (payload.productId) compact.product_id = payload.productId;
  return compact;
}

function cleanPayload(payload: ConversionPayload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  );
}

function sendToApi(event: ConversionEvent, payload: ConversionPayload) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({ event, ...cleanPayload(payload), ts: Date.now() });
  const blob = new Blob([body], { type: "application/json" });

  if (navigator.sendBeacon?.("/api/analytics/event", blob)) return;

  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function trackConversion(
  event: ConversionEvent,
  payload: ConversionPayload = {}
) {
  try {
    track(event, vercelPayload(event, payload));
  } catch {
    // Vendor analytics must not block the page or the first-party event.
  }
  sendToApi(event, payload);
}

const SPREADSHEET_SOURCE_KEY = "litbuy-sales-source";

export function markSpreadsheetBrowse() {
  try {
    sessionStorage.setItem(SPREADSHEET_SOURCE_KEY, "spreadsheet");
  } catch {
    // ignore
  }
}

export function spreadsheetBrowseQuery(): string | undefined {
  try {
    return sessionStorage.getItem(SPREADSHEET_SOURCE_KEY) === "spreadsheet"
      ? "spreadsheet"
      : undefined;
  } catch {
    return undefined;
  }
}

export function trackProductContext(
  event: "buy_click" | "qc_click" | "spreadsheet_product_click" | "spreadsheet_buy_click" | "spreadsheet_qc_click" | "product_buy_click",
  product: Product,
  location: string,
  extra: ConversionPayload = {}
) {
  trackConversion(event, {
    location,
    productId: product.id,
    productName: product.product_name,
    brand: extractBrand(product.product_name) ?? undefined,
    category: product.category,
    href: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...extra,
  });
}

export function trackRegisterClick(location: string) {
  trackConversion("register_click", { location });
  trackConversion("litbuy_signup_click", { location });
}

export function trackRegisterImpression(location: string) {
  const key = `reg-imp-${location}`;
  if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(key)) return;
  sessionStorage?.setItem(key, "1");
  trackConversion("register_impression", { location });
}

export function trackSearchSubmit(query: string, location: string) {
  trackConversion("search_submit", { location, query });
}

export function trackSearchChipClick(query: string, location: string) {
  trackConversion("search_chip_click", { location, query });
}

export function trackSaveClick(productId: string, location: string) {
  trackConversion("save_click", { location, productId });
}

export function trackCategoryClick(href: string, location: string) {
  trackConversion("category_click", { location, href });
}

export function trackBrandClick(href: string, location: string) {
  trackConversion("brand_click", { location, href });
}

export function trackCollectionClick(href: string, location: string) {
  trackConversion("collection_click", { location, href });
}

export function trackPopupImpression(location: string, variant: string) {
  const key = `popup-imp-${location}-${variant}`;
  if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(key)) return;
  sessionStorage?.setItem(key, "1");
  trackConversion("popup_impression", { location, variant });
}

export function trackPopupClose(location: string, variant: string) {
  trackConversion("popup_close", { location, variant });
}

export function getMobilePopupCtaVariant(): "a" | "b" {
  if (typeof sessionStorage === "undefined") return "a";
  const stored = sessionStorage.getItem("litbuy-mobile-popup-cta");
  if (stored === "a" || stored === "b") return stored;
  const variant = Math.random() < 0.5 ? "a" : "b";
  sessionStorage.setItem("litbuy-mobile-popup-cta", variant);
  return variant;
}

export function trackDiscordClick(location: string) {
  trackConversion("discord_click", { location });
}

export function trackTelegramClick(location: string) {
  trackConversion("telegram_click", { location });
}

export function trackBrokenImage(imageUrl: string, location: string) {
  trackConversion("broken_image", { location, productName: imageUrl.slice(0, 120) });
}
