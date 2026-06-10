"use client";

import { useCoupon } from "@/context/CouponContext";
import { trackRegisterClick } from "@/lib/analytics-events";

export default function FloatingCouponButton() {
  const { isOpen, openCoupon } = useCoupon();

  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={() => {
        trackRegisterClick("floating_coupon");
        openCoupon();
      }}
      className="pulse-ring fixed bottom-20 right-4 z-[90] rounded-full bg-accent px-5 py-3 text-sm font-black text-background shadow-[0_0_30px_rgba(212,255,60,0.25)] transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
    >
      Register
    </button>
  );
}
