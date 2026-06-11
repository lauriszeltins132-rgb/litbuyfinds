"use client";

import { useCoupon } from "@/context/CouponContext";

export default function FloatingCouponButton() {
  const { isOpen, openCoupon } = useCoupon();

  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={openCoupon}
      className="fixed bottom-20 right-4 z-[90] rounded-full border border-border bg-background/90 px-4 py-2.5 text-xs font-bold text-muted shadow-lg backdrop-blur transition hover:border-accent/40 hover:text-accent sm:bottom-6 sm:right-6"
    >
      Agent signup
    </button>
  );
}
