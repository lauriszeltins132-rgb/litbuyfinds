"use client";

import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/lib/types";

type HomepageLatestFindsGridProps = {
  products: Product[];
};

/** Marketplace-style product grid for homepage discovery — existing cards only. */
export default function HomepageLatestFindsGrid({
  products,
}: HomepageLatestFindsGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="discovery-section px-3 py-5 sm:px-6 sm:py-8">
      <div className="discovery-section__panel mx-auto max-w-7xl">
        <div className="discovery-section__header mb-4 flex items-end justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h2 className="discovery-section__title text-lg font-black leading-tight tracking-tight sm:text-2xl">
              Latest LitBuy Finds
            </h2>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted sm:mt-1 sm:line-clamp-none sm:text-sm">
              Fresh spreadsheet imports — browse like a marketplace catalog
            </p>
          </div>
          <Link
            href="/latest-finds"
            className="discovery-section__cta shrink-0 rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-bold text-accent shadow-sm transition hover:border-accent/35 sm:text-sm"
          >
            View all →
          </Link>
        </div>

        <ProductGrid products={products} priorityCount={4} />
      </div>
    </section>
  );
}
