"use client";

import { useEffect, useRef } from "react";
import { useCoupon } from "@/context/CouponContext";
import { useConversion } from "@/context/ConversionContext";

const ACTIVE_MS = 25_000;
const EXIT_MIN_ACTIVE_MS = 8_000;
const SCROLL_PX = 1600;

/**
 * Opens the existing coupon modal after engagement. One automatic open per
 * session; dismissal cooldown lives in CouponContext.
 */
export default function OfferPopupTriggers() {
  const { openCoupon } = useCoupon();
  const { uniqueProductViews } = useConversion();
  const opened = useRef(false);
  const activeMs = useRef(0);

  function tryOpen(source: string) {
    if (opened.current) return;
    if (!openCoupon(source)) return;
    opened.current = true;
  }

  useEffect(() => {
    let last = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === "visible") {
        activeMs.current += now - last;
      }
      last = now;
      if (activeMs.current >= ACTIVE_MS) {
        tryOpen("browse_time");
        window.clearInterval(timer);
      }
    }, 1000);
    return () => window.clearInterval(timer);
    // tryOpen closes over the latest openCoupon via ref pattern below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCoupon]);

  useEffect(() => {
    if (uniqueProductViews >= 2) tryOpen("product_views");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueProductViews, openCoupon]);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = height > 0 ? scrolled / height : 0;
      if (scrolled >= SCROLL_PX || ratio >= 0.45) tryOpen("scroll");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCoupon]);

  useEffect(() => {
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
  }, [openCoupon, uniqueProductViews]);

  return null;
}
