"use client";

import Link from "next/link";
import { useCoupon } from "@/context/CouponContext";
import { BROWSE_FINDS_CTA_LABEL, REGISTER_MODAL_CTA_LABEL } from "@/lib/constants";
import PromoBanner from "./PromoBanner";
import RegisterLink from "./RegisterLink";

export default function CouponModal() {
  const { isOpen, closeCoupon } = useCoupon();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-3 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeCoupon}
      />

      <div className="coupon-enter panel-shell relative w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-surface">
        <button
          type="button"
          onClick={closeCoupon}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/80 text-sm text-muted backdrop-blur transition hover:border-accent/40 hover:text-foreground"
        >
          ×
        </button>

        <PromoBanner variant="modal" priority className="rounded-none border-0" />

        <div className="space-y-3 p-5 sm:p-6">
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
