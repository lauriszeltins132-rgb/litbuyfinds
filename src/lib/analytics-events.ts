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
  | "telegram_click";

export type ConversionPayload = {
  location?: string;
  productId?: string;
  productName?: string;
  brand?: string;
  category?: string;
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

export function trackDiscordClick(location: string) {
  trackConversion("discord_click", { location });
}

export function trackTelegramClick(location: string) {
  trackConversion("telegram_click", { location });
}
