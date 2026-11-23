"use client";

import { useEffect, useRef } from "react";
import RegisterLink from "@/components/RegisterLink";
import { useCoupon } from "@/context/CouponContext";
import { trackContextual } from "@/lib/analytics-events";
import {
  LITBUY_CLAIM_COUPON_LABEL,
  LITBUY_COUPONS_OFFER,
  LITBUY_INVITE_CODE,
  LITBUY_SHIPPING_OFFER_PERCENT,
} from "@/lib/litbuy-coupons-page";

const SUPPORTING_BENEFITS = [
  `Up to ${LITBUY_SHIPPING_OFFER_PERCENT} off eligible international shipping`,
  `Welcome coupon pack up to ${LITBUY_COUPONS_OFFER.welcomePack}`,
  "QC photos before shipping",
  "Warehouse & order tracking",
] as const;

export default function CouponModal() {
  const { isOpen, source, closeCoupon } = useCoupon();
  const viewed = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      viewed.current = false;
      return;
    }
    if (viewed.current) return;
    viewed.current = true;
    trackContextual("coupon_modal_view", { location: source });
  }, [isOpen, source]);

  if (!isOpen) return null;

  function dismiss(reason: string) {
    trackContextual("coupon_modal_close", { location: reason });
    closeCoupon(reason);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-3 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/55"
        onClick={() => dismiss("backdrop")}
      />

      <div
        className="coupon-enter relative max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-panel shadow-[0_18px_50px_rgba(26,25,22,0.16)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-offer-title"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#9ed63a] via-accent to-[#5d9012] px-5 pb-6 pt-5 text-[#142006]">
          <button
            type="button"
            onClick={() => dismiss("close")}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-background text-base text-foreground"
          >
            ×
          </button>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em]">
            Special offer
          </p>
          <div className="mt-2 flex items-end gap-3 pr-12">
            <p className="text-7xl font-black leading-none tracking-tight sm:text-8xl">
              {LITBUY_SHIPPING_OFFER_PERCENT}
            </p>
            <p className="pb-1 text-lg font-black uppercase leading-tight tracking-tight sm:text-xl">
              Off
              <br />
              shipping
            </p>
          </div>
        </div>

        <div className="px-5 py-5">
          <h2
            id="coupon-offer-title"
            className="text-lg font-black leading-snug text-foreground"
          >
            Claim your {LITBUY_SHIPPING_OFFER_PERCENT} LitBuy shipping coupon
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Create a free LitBuy account with invite code {LITBUY_INVITE_CODE} and
            unlock the current new-user offer.
          </p>

          <ul className="mt-4 space-y-2">
            {SUPPORTING_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-sm font-medium text-foreground"
              >
                <span className="mt-0.5 text-accent" aria-hidden>
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[11px] leading-relaxed text-muted">
            Offer applies to eligible new LitBuy accounts. Confirm the live coupon
            and shipping total at LitBuy checkout.
          </p>

          <RegisterLink
            location="coupon_modal"
            onClick={() => {
              trackContextual("coupon_modal_signup_click", {
                location: source,
              });
              closeCoupon("signup");
            }}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-4 text-base font-black text-background transition hover:bg-accent-hover"
          >
            {LITBUY_CLAIM_COUPON_LABEL}
          </RegisterLink>
          <button
            type="button"
            onClick={() => dismiss("maybe_later")}
            className="mt-2 w-full py-2 text-sm font-semibold text-muted hover:text-foreground"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
