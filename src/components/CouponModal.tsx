"use client";

import Link from "next/link";
import { useCoupon } from "@/context/CouponContext";
import {
  BROWSE_FINDS_CTA_LABEL,
  LITBUY_ACCOUNT_BENEFITS,
  REGISTER_MODAL_CTA_LABEL,
} from "@/lib/constants";
import RegisterLink from "./RegisterLink";

export default function CouponModal() {
  const { isOpen, closeCoupon } = useCoupon();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-3 sm:items-end sm:justify-end sm:p-6">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={closeCoupon}
      />

      <div className="coupon-enter panel-shell relative w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-surface p-5 sm:p-6">
        <button
          type="button"
          onClick={closeCoupon}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/80 text-sm text-muted backdrop-blur hover:text-foreground"
        >
          ×
        </button>

        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
          LitBuy account
        </p>
        <h2 className="mt-2 text-xl font-black text-foreground">
          Get 30% Off Shipping
        </h2>
        <ul className="mt-4 space-y-2">
          {LITBUY_ACCOUNT_BENEFITS.map((benefit) => (
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
            onClick={closeCoupon}
            className="inline-flex w-full items-center justify-center rounded-full bg-accent py-3.5 text-sm font-black text-background transition hover:bg-accent-hover"
          >
            {REGISTER_MODAL_CTA_LABEL}
          </RegisterLink>

          <Link
            href="/#browse"
            onClick={closeCoupon}
            className="inline-flex w-full items-center justify-center rounded-full border border-border-strong py-3 text-sm font-bold text-foreground transition hover:border-accent/40 hover:text-accent"
          >
            {BROWSE_FINDS_CTA_LABEL}
          </Link>
        </div>
      </div>
    </div>
  );
}
