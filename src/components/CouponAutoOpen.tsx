"use client";

import { useEffect, useRef } from "react";
import { useCoupon } from "@/context/CouponContext";
import { useConversion } from "@/context/ConversionContext";
import { COUPON_AUTOOPEN_VIEW_THRESHOLD } from "@/lib/conversion";

const OPEN_DELAY_MS = 1200;

/** Opens signup modal after meaningful browsing — not on first page load. */
export default function CouponAutoOpen() {
  const { openCoupon } = useCoupon();
  const { uniqueProductViews } = useConversion();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    if (uniqueProductViews < COUPON_AUTOOPEN_VIEW_THRESHOLD) return;

    triggered.current = true;
    const timer = window.setTimeout(() => {
      openCoupon();
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [openCoupon, uniqueProductViews]);

  return null;
}
