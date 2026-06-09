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
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              {title && <h2 className="text-xl font-black sm:text-2xl">{title}</h2>}
              {subtitle && (
                <p className="mt-1 text-sm text-muted">{subtitle}</p>
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

        <div className="discovery-rail -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {products.map((product) => (
            <div key={product.id} className="w-[220px] shrink-0 sm:w-[240px]">
              <ProductCard
                product={product}
                onOpen={setSelected}
                compact
                showTrendingScore={showTrendingScore}
              />
            </div>
          ))}
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
