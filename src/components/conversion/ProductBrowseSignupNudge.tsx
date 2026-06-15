"use client";

import Link from "next/link";
import RegisterLink from "@/components/RegisterLink";
import { useConversion } from "@/context/ConversionContext";
import {
  CONVERSION_DISMISS_KEYS,
  PRODUCT_VIEW_NUDGE_THRESHOLD,
} from "@/lib/conversion";
import { BROWSE_FINDS_CTA_LABEL, REGISTER_MODAL_CTA_LABEL } from "@/lib/constants";

export default function ProductBrowseSignupNudge() {
  const { uniqueProductViews, isNudgeDismissed, dismissNudge } = useConversion();

  if (uniqueProductViews < PRODUCT_VIEW_NUDGE_THRESHOLD) return null;
  if (isNudgeDismissed(CONVERSION_DISMISS_KEYS.browseNudge)) return null;

  return (
    <section className="conversion-browse-nudge" aria-label="Signup suggestion">
      <div className="conversion-browse-nudge__card">
        <button
          type="button"
          aria-label="Dismiss"
          className="conversion-browse-nudge__close"
          onClick={() => dismissNudge(CONVERSION_DISMISS_KEYS.browseNudge)}
        >
          ×
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
          Ready to buy?
        </p>
        <p className="mt-1 text-sm font-black text-foreground">
          You&apos;ve explored {uniqueProductViews} finds — unlock verified links
          &amp; QC photos
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          LitBuy accounts get warehouse QC, order tracking, shipping discounts,
          and saved favorites.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <RegisterLink
            location="browse_nudge_20_products"
            className="inline-flex rounded-full bg-accent px-4 py-2 text-xs font-black text-background hover:bg-accent-hover"
          >
            {REGISTER_MODAL_CTA_LABEL}
          </RegisterLink>
          <Link
            href="/#browse"
            className="inline-flex rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground hover:border-accent/40"
          >
            {BROWSE_FINDS_CTA_LABEL}
          </Link>
        </div>
      </div>
    </section>
  );
}
