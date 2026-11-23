"use client";

import { useEffect, useRef } from "react";
import RegisterLink from "@/components/RegisterLink";
import { useCoupon } from "@/context/CouponContext";
import { trackContextual } from "@/lib/analytics-events";
import {
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

const CLAIM_LABEL = `Claim My ${LITBUY_SHIPPING_OFFER_PERCENT} Coupon`;

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
    trackContextual("coupon_modal_view", { location: source, query: source });
  }, [isOpen, source]);

  if (!isOpen) return null;

  function dismiss(reason: string) {
    trackContextual("coupon_modal_close", { location: reason, query: source });
    closeCoupon(reason);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-3 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60"
        onClick={() => dismiss("backdrop")}
      />

      <div
        className="coupon-enter relative max-h-[calc(100dvh-1.5rem)] w-full max-w-[26.5rem] overflow-y-auto rounded-[28px] bg-[#121411] shadow-[0_18px_44px_rgba(0,0,0,0.28)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-offer-title"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#24520c] via-[#3d7812] to-[#6eae1c] px-5 pb-5 pt-4 text-[#f4f7ef]">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -left-10 bottom-[-1.5rem] h-28 w-28 rounded-full bg-black/10"
          />
          <button
            type="button"
            onClick={() => dismiss("close")}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f7ef] text-lg leading-none text-[#142006]"
          >
            ×
          </button>
          <p className="relative text-[11px] font-bold uppercase tracking-[0.22em] text-[#f4f7ef]/80">
            Before you go
          </p>
          <div className="relative mt-1 flex items-end gap-3 pr-12">
            <p className="text-6xl font-black leading-none tracking-tight sm:text-7xl">
              {LITBUY_SHIPPING_OFFER_PERCENT}
            </p>
            <p className="pb-1 text-sm font-black uppercase leading-tight tracking-[0.14em] sm:text-base">
              Off
              <br />
              shipping
            </p>
          </div>
        </div>

        <div className="px-5 pb-4 pt-4 text-[#f4f7ef]">
          <h2 id="coupon-offer-title" className="text-xl font-black leading-tight">
            Claim your {LITBUY_SHIPPING_OFFER_PERCENT} coupon
          </h2>
          <p className="mt-1.5 text-sm leading-snug text-white/70">
            Create a free LitBuy account with invite code {LITBUY_INVITE_CODE} and
            unlock the current new-user offer.
          </p>

          <ul className="mt-3.5 space-y-2">
            {SUPPORTING_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2 text-sm text-white/90">
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-black text-[#142006]"
                  aria-hidden
                >
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <RegisterLink
            location="coupon_modal"
            onClick={() => {
              trackContextual("coupon_modal_signup_click", {
                location: source,
                query: source,
              });
              closeCoupon("signup");
            }}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-4 text-[15px] font-black text-[#142006] transition hover:bg-accent-hover"
          >
            {CLAIM_LABEL}
            <svg
              viewBox="0 0 20 20"
              aria-hidden
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h12M12 5l5 5-5 5" />
            </svg>
          </RegisterLink>
          <button
            type="button"
            onClick={() => dismiss("maybe_later")}
            className="mt-1.5 w-full py-1.5 text-sm font-medium text-white/45 hover:text-white/70"
          >
            Maybe later
          </button>
          <p className="mt-1 text-center text-[10px] leading-relaxed text-white/40">
            For eligible new LitBuy accounts. Offer applies to international shipping.
            Confirm live coupon terms and final total on LitBuy checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
