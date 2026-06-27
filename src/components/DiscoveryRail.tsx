"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { useState } from "react";

type DiscoveryRailProps = {
  title: string;
  subtitle?: string;
  href: string;
  products: Product[];
  showTrendingScore?: boolean;
};

export default function DiscoveryRail({
  title,
  subtitle,
  href,
  products,
  showTrendingScore = false,
}: DiscoveryRailProps) {
  const [selected, setSelected] = useState<Product | null>(null);

  if (products.length === 0) return null;

  return (
    <section className="px-3 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-2.5 flex items-end justify-between gap-3 sm:mb-5 sm:gap-4">
            <div className="min-w-0">
              {title && (
                <h2 className="text-lg font-black leading-tight sm:text-2xl">{title}</h2>
              )}
              {subtitle && (
                <p className="mt-0.5 line-clamp-1 text-xs text-muted sm:mt-1 sm:line-clamp-none sm:text-sm">
                  {subtitle}
                </p>
              )}
            </div>
            <Link
              href={href}
              className="shrink-0 text-sm font-bold text-accent hover:underline"
            >
              View all →
            </Link>
          </div>
        )}

        <div className="discovery-rail -mx-0.5 flex gap-2.5 overflow-x-auto px-0.5 pb-1 sm:gap-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-[calc(50vw-1.25rem)] max-w-[178px] shrink-0 sm:w-[240px] sm:max-w-none"
            >
              <ProductCard
                product={product}
                onOpen={setSelected}
                compact
                showTrendingScore={showTrendingScore}
                priority={index < 4}
              />
            </div>
          ))}
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
