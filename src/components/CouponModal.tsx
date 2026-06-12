"use client";

import { useCoupon } from "@/context/CouponContext";
import { REGISTER_CTA_LABEL } from "@/lib/constants";
import RegisterLink from "./RegisterLink";

const BENEFITS = [
  "30% shipping coupon",
  "Access to QC photos",
  "Track your orders",
  "Faster checkout",
] as const;

export default function CouponModal() {
  const { isOpen, closeCoupon } = useCoupon();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={closeCoupon}
      />

      <div className="coupon-enter panel-shell relative w-full max-w-md overflow-hidden rounded-3xl border border-accent/20 p-6 text-center sm:p-8">
        <button
          type="button"
          onClick={closeCoupon}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm text-muted transition hover:border-accent/40 hover:text-foreground"
        >
          ×
        </button>

        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-2xl font-black text-accent"
          aria-hidden
        >
          30%
        </div>

        <h2 className="mt-5 text-2xl font-black leading-tight text-foreground sm:text-3xl">
          Get 30% Off Shipping
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
          New LitBuy users can claim an exclusive shipping discount.
        </p>

        <ul className="mx-auto mt-6 max-w-xs space-y-2.5 text-left text-sm text-foreground/90">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5">
              <span className="mt-0.5 text-accent" aria-hidden>
                ✓
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <RegisterLink
          location="coupon_modal"
          onClick={closeCoupon}
          className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-accent py-3.5 text-sm font-black text-background transition hover:bg-accent-hover"
        >
          {REGISTER_CTA_LABEL}
        </RegisterLink>

        <button
          type="button"
          onClick={closeCoupon}
          className="mt-4 text-xs font-semibold text-muted transition-colors hover:text-foreground"
        >
          Already have an account?{" "}
          <span className="text-accent">Browse finds</span>
        </button>
      </div>
    </div>
  );
}
