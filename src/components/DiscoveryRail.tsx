"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { Product } from "@/lib/types";
import { dedupeListingRail } from "@/lib/listing-dedupe";
import ContentFreshness from "@/components/ContentFreshness";
import type { ContentFreshnessVariant } from "@/lib/freshness-dates";
import ProductCard from "./ProductCard";
import { useState } from "react";

const ProductModal = dynamic(() => import("./ProductModal"), { ssr: false });

type DiscoveryRailProps = {
  title: string;
  subtitle?: string;
  href: string;
  products: Product[];
  showTrendingScore?: boolean;
  /** Only the first rail should preload card images. */
  preloadImages?: boolean;
  freshness?: ContentFreshnessVariant;
  /** Tighter vertical spacing for above-the-fold rails. */
  tight?: boolean;
};

export default function DiscoveryRail({
  title,
  subtitle,
  href,
  products,
  showTrendingScore = false,
  preloadImages = false,
  freshness,
  tight = false,
}: DiscoveryRailProps) {
  const [selected, setSelected] = useState<Product | null>(null);
  const railProducts = dedupeListingRail(products);

  if (railProducts.length === 0) return null;

  return (
    <section
      className={`discovery-section px-3 sm:px-6 ${tight ? "py-3 sm:py-5" : "py-5 sm:py-8"}`}
    >
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="discovery-section__header flex items-end justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              {title && (
                <h2 className="text-lg font-black leading-tight tracking-tight sm:text-2xl">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-0.5 line-clamp-1 text-xs text-muted sm:mt-1 sm:line-clamp-none sm:text-sm">
                  {subtitle}
                </p>
              )}
              {freshness ? (
                <div className="mt-1 hidden sm:block">
                  <ContentFreshness variant={freshness} />
                </div>
              ) : null}
            </div>
            <Link
              href={href}
              className="shrink-0 rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-bold text-accent shadow-sm transition hover:border-accent/35 sm:text-sm"
            >
              View all →
            </Link>
          </div>
        )}

        <div className="discovery-rail -mx-0.5 flex gap-2.5 overflow-x-auto px-0.5 pb-1 sm:gap-4">
          {railProducts.map((product, index) => (
            <div
              key={product.id}
              className="discovery-rail__item w-[calc(50vw-1.25rem)] max-w-[178px] shrink-0 sm:w-[240px] sm:max-w-none"
            >
              <ProductCard
                product={product}
                onOpen={setSelected}
                compact
                showTrendingScore={showTrendingScore}
                priority={preloadImages && index < 2}
              />
            </div>
          ))}
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
