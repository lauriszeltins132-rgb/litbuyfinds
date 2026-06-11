"use client";

import {
  LITBUY_OFFER_DESCRIPTION,
  LITBUY_OFFER_HEADLINE,
} from "@/lib/constants";
import { useCoupon } from "@/context/CouponContext";
import OfferVisual from "./OfferVisual";
import RegisterLink from "./RegisterLink";

export default function CouponModal() {
  const { isOpen, closeCoupon } = useCoupon();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeCoupon}
      />

      <div className="coupon-enter panel-shell relative w-full max-w-sm overflow-hidden rounded-3xl border border-border p-6 text-center sm:p-8">
        <button
          type="button"
          onClick={closeCoupon}
          aria-label="Close offer"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm text-muted transition hover:border-accent/40 hover:text-foreground"
        >
          ×
        </button>

        <OfferVisual compact className="mx-auto" />

        <div className="relative mt-6">
          <h2 className="text-2xl font-black leading-tight text-foreground sm:text-[1.65rem]">
            {LITBUY_OFFER_HEADLINE}
          </h2>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {LITBUY_OFFER_DESCRIPTION}
          </p>

          <RegisterLink
            location="coupon_modal"
            onClick={closeCoupon}
            className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-accent py-3.5 text-sm font-black text-background transition hover:bg-accent-hover"
          >
            Register on LitBuy
          </RegisterLink>

          <button
            type="button"
            onClick={closeCoupon}
            className="mt-4 text-xs font-semibold text-muted transition-colors hover:text-accent"
          >
            Already have an account? Browse finds
          </button>
        </div>
      </div>
    </div>
  );
}
