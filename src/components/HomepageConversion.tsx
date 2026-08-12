import Link from "next/link";
import { LITBUY_SIGNUP_URL, REGISTER_HEADER_CTA_LABEL } from "@/lib/constants";

export default function HomepageConversion() {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface/30 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
            New to LitBuy?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Learn how agents, QC photos, and haul shipping work before your first order.
          </p>
          <Link
            href="/guides/beginner-guide-to-litbuy"
            className="mt-3 inline-block text-sm font-bold text-accent hover:underline"
          >
            Beginner guide →
          </Link>
        </div>

        <div className="rounded-2xl border border-accent/25 bg-accent/5 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Rep finds database
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Search thousands of QC-linked rep products from the LitBuy spreadsheet catalog — sneakers,
            streetwear, and daily drops.
          </p>
          <Link
            href="/latest-finds"
            className="mt-3 inline-block text-sm font-bold text-accent hover:underline"
          >
            Browse latest finds →
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-surface/30 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
            {REGISTER_HEADER_CTA_LABEL}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Create a free LitBuy account for shipping coupons, QC access, and order tracking.
          </p>
          <Link
            href="/litbuy-coupons"
            className="mt-3 inline-block text-sm font-bold text-accent hover:underline"
          >
            LitBuy coupons →
          </Link>
          <a
            href={LITBUY_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-2 block text-sm font-semibold text-muted hover:text-accent"
          >
            Register on LitBuy →
          </a>
        </div>
      </div>
    </section>
  );
}
