"use client";

import { useEffect, useRef } from "react";
import RegisterLink from "@/components/RegisterLink";
import { useCoupon } from "@/context/CouponContext";
import { trackContextual } from "@/lib/analytics-events";
import { LITBUY_COUPONS_OFFER } from "@/lib/litbuy-coupons-page";

const SUPPORTING_BENEFITS = [
  "QC photos",
  "Warehouse and order tracking",
  "Save finds",
  "Compare sellers",
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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => dismiss("backdrop")}
      />

      <div
        className="coupon-enter panel-shell relative max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-border/80 bg-surface p-5 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-offer-title"
      >
        <button
          type="button"
          onClick={() => dismiss("close")}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background/80 text-sm text-muted backdrop-blur hover:text-foreground"
        >
          ×
        </button>

        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
          Special offer
        </p>
        <p className="mt-3 text-4xl font-black tracking-tight text-foreground">
          {LITBUY_COUPONS_OFFER.shippingDiscount}
        </p>
        <h2 id="coupon-offer-title" className="mt-1 text-xl font-black text-foreground">
          LitBuy international shipping
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Create a free LitBuy account and claim the current offer. Eligible new
          accounts can also see a welcome coupon pack of up to{" "}
          {LITBUY_COUPONS_OFFER.welcomePack}. {LITBUY_COUPONS_OFFER.disclaimer}{" "}
          The shipping offer does not change the item price.
        </p>
        <ul className="mt-4 space-y-2">
          {SUPPORTING_BENEFITS.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-2 text-sm text-foreground/90"
            >
              <span className="text-accent" aria-hidden>
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-3">
          <RegisterLink
            location="coupon_modal"
            onClick={() => {
              trackContextual("coupon_modal_signup_click", {
                location: source,
              });
              closeCoupon("signup");
            }}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-4 py-3.5 text-sm font-black text-background transition hover:bg-accent-hover"
          >
            Claim the current offer
          </RegisterLink>
          <button
            type="button"
            onClick={() => dismiss("maybe_later")}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border-strong py-3 text-sm font-bold text-foreground transition hover:border-accent/40 hover:text-accent"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
