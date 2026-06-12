"use client";

import { useEffect, useRef } from "react";
import { useCoupon } from "@/context/CouponContext";

const OPEN_DELAY_MS = 2400;

/** Opens the signup coupon modal once per session for new visitors. */
export default function CouponAutoOpen() {
  const { openCoupon } = useCoupon();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;

    const timer = window.setTimeout(() => {
      openCoupon();
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [openCoupon]);

  return null;
}
