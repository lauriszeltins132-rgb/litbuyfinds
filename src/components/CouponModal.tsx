"use client";

import Link from "next/link";
import { useCoupon } from "@/context/CouponContext";
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

      <div className="panel-shell relative w-full max-w-sm overflow-hidden rounded-3xl border border-border p-6 text-center sm:p-8">
        <button
          type="button"
          onClick={closeCoupon}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm text-muted transition hover:border-accent/40 hover:text-foreground"
        >
          ×
        </button>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Trusted checkout
        </p>
        <h2 className="mt-3 text-xl font-black leading-tight text-foreground sm:text-2xl">
          Verified LitBuy agent links on every find
        </h2>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
          Browse QC references here, then confirm price and size on LitBuy before
          you buy.
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
          Continue browsing finds
        </button>

        <p className="mt-4 text-xs text-muted">
          New to agents?{" "}
          <Link
            href="/guides/beginner-guide-to-litbuy"
            onClick={closeCoupon}
            className="font-bold text-accent hover:underline"
          >
            Read the beginner guide
          </Link>
        </p>
      </div>
    </div>
  );
}
