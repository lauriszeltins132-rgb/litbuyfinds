"use client";

import {
  LITBUY_OFFER_DESCRIPTION,
  LITBUY_OFFER_HEADLINE,
} from "@/lib/constants";
import { useCoupon } from "@/context/CouponContext";
import CommunityLinks from "./CommunityLinks";
import RegisterLink from "./RegisterLink";

export default function CouponModal() {
  const { isOpen, closeCoupon } = useCoupon();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={closeCoupon}
      />

      <div className="coupon-enter panel-shell relative w-full max-w-sm overflow-hidden rounded-3xl border border-accent/30 p-8 text-center">
        <div className="glow-spot absolute inset-0" />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
            New user offer
          </p>

          <h2 className="mt-4 text-3xl font-black leading-tight text-foreground">
            {LITBUY_OFFER_HEADLINE}
          </h2>

          <p className="mt-3 text-sm text-muted">{LITBUY_OFFER_DESCRIPTION}</p>

          <RegisterLink
            location="coupon_modal"
            onClick={closeCoupon}
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-accent py-4 text-base font-black text-background hover:bg-accent-hover"
          >
            Register on LitBuy
          </RegisterLink>

          <button
            type="button"
            onClick={closeCoupon}
            className="mt-4 text-sm font-semibold text-muted transition-colors hover:text-accent"
          >
            Already have an account? Browse finds
          </button>

          <div className="mt-6">
            <CommunityLinks
              variant="inline"
              location="coupon_modal"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
}
