"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCoupon } from "@/context/CouponContext";
import { useConversion } from "@/context/ConversionContext";

/** Fallback only. Product scrolling and product views open the popup first. */
const FALLBACK_ACTIVE_MS = 75_000;
const EXIT_MIN_ACTIVE_MS = 8_000;
/** How far the user continues through a product rail after it is on screen. */
const BROWSE_INTO_PX = 320;

function isProductPage(path: string) {
  return path.startsWith("/find/");
}

function isDiscoveryPage(path: string) {
  if (path === "/" || path === "/finds" || path === "/litbuy-spreadsheet" || path === "/litbuy-finds") {
    return true;
  }
  if (path === "/collections" || path === "/brands" || path === "/categories") return true;
  if (
    path.startsWith("/finds/") ||
    path.startsWith("/collections/") ||
    path.startsWith("/brands/") ||
    path.startsWith("/categories/") ||
    path.startsWith("/category/")
  ) {
    return true;
  }
  return (
    path === "/trending" ||
    path.startsWith("/trending-") ||
    path === "/latest-finds" ||
    path === "/new-finds" ||
    path === "/recently-added" ||
    path === "/daily-drop"
  );
}

function allowsAutoPopup(path: string) {
  if (path === "/litbuy-coupons" || path.startsWith("/litbuy-coupons/")) return false;
  if (path === "/litbuy-invite-code" || path.startsWith("/litbuy-invite-code/")) return false;
  return isDiscoveryPage(path) || isProductPage(path);
}

function findProductSection(): Element | null {
  return document.querySelector(".discovery-rail, #catalog-product-grid, .product-card");
}

/**
 * Opens the existing coupon modal after the user starts browsing products.
 * Session and dismissal limits live in CouponContext.
 */
export default function OfferPopupTriggers() {
  const pathname = usePathname() || "/";
  const { openCoupon } = useCoupon();
  const { uniqueProductViews } = useConversion();
  const opened = useRef(false);
  const activeMs = useRef(0);
  const auto = allowsAutoPopup(pathname);

  function tryOpen(source: string) {
    if (!auto || opened.current) return;
    if (!openCoupon(source)) return;
    opened.current = true;
  }

  useEffect(() => {
    if (!auto) return;
    let last = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === "visible") {
        activeMs.current += now - last;
      }
      last = now;
      if (activeMs.current >= FALLBACK_ACTIVE_MS) {
        tryOpen("browse_time");
        window.clearInterval(timer);
      }
    }, 1000);
    return () => window.clearInterval(timer);
    // tryOpen reads the latest openCoupon. The timer is per page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCoupon, pathname, auto]);

  useEffect(() => {
    if (!auto) return;
    if (uniqueProductViews >= 2) tryOpen("product_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueProductViews, openCoupon, pathname, auto]);

  useEffect(() => {
    if (!auto || !isDiscoveryPage(pathname)) return;

    const onScroll = () => {
      const section = findProductSection();
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const intoSection = window.scrollY + window.innerHeight * 0.25 - sectionTop;
      if (intoSection >= BROWSE_INTO_PX) tryOpen("product_scroll");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCoupon, pathname, auto]);

  useEffect(() => {
    if (!auto) return;
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!desktop.matches) return;

    const onMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 8) return;
      const engaged =
        activeMs.current >= EXIT_MIN_ACTIVE_MS ||
        uniqueProductViews >= 2 ||
        window.scrollY >= 400;
      if (!engaged) return;
      tryOpen("exit_intent");
    };
    window.addEventListener("mouseout", onMouseOut);
    return () => window.removeEventListener("mouseout", onMouseOut);
  }, [openCoupon, uniqueProductViews, auto]);

  return null;
}
