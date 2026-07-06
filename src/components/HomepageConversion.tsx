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
            {REGISTER_HEADER_CTA_LABEL}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Create a free LitBuy account for shipping coupons, QC access, and order tracking.
          </p>
          <a
            href={LITBUY_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-bold text-accent hover:underline"
          >
            Register on LitBuy →
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-surface/30 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Verified links
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Every buy button uses the stored Weidian or Taobao URL — no mystery redirects.
          </p>
          <Link
            href="/guides/how-to-use-litbuy-finds"
            className="mt-3 inline-block text-sm font-bold text-accent hover:underline"
          >
            How LitBuy Finds works →
          </Link>
        </div>
      </div>
    </section>
  );
}
