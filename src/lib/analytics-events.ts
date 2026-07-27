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
  | "coupon_click"
  | "broken_image"
  | "search_submit"
  | "search_chip_click"
  | "save_click"
  | "category_click"
  | "brand_click"
  | "collection_click"
  | "popup_impression"
  | "popup_close";

export type ConversionPayload = {
  location?: string;
  productId?: string;
  productName?: string;
  brand?: string;
  category?: string;
  query?: string;
  href?: string;
  variant?: string;
};

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
  const data = cleanPayload(payload);
  track(event, data);
  sendToApi(event, payload);
}

export function trackProductContext(
  event: "buy_click" | "qc_click",
  product: Product,
  location: string
) {
  trackConversion(event, {
    location,
    productId: product.id,
    productName: product.product_name,
    brand: extractBrand(product.product_name) ?? undefined,
    category: product.category,
  });
}

export function trackRegisterClick(location: string) {
  trackConversion("register_click", { location });
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

export function trackCouponClick(location: string, href?: string) {
  trackConversion("coupon_click", { location, href });
}

export function trackBrokenImage(imageUrl: string, location: string) {
  trackConversion("broken_image", { location, productName: imageUrl.slice(0, 120) });
}
