"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

const ProductModal = dynamic(() => import("./ProductModal"), { ssr: false });

type ProductGridProps = {
  products: Product[];
  emptyMessage?: string;
};

export default function ProductGrid({
  products,
  emptyMessage = "No products match your filters.",
}: ProductGridProps) {
  const [selected, setSelected] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-20 text-center">
        <p className="text-lg font-bold text-foreground">Nothing matched</p>
        <p className="mt-2 max-w-md text-sm text-muted">{emptyMessage}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/trending"
            className="rounded-full border border-border px-4 py-2 text-sm font-bold hover:border-accent/40 hover:text-accent"
          >
            Trending
          </Link>
          <Link
            href="/new-finds"
            className="rounded-full border border-border px-4 py-2 text-sm font-bold hover:border-accent/40 hover:text-accent"
          >
            New finds
          </Link>
          <Link
            href="/best-under-30"
            className="rounded-full border border-border px-4 py-2 text-sm font-bold hover:border-accent/40 hover:text-accent"
          >
            Under $30
          </Link>
          <Link
            href="/categories/shoes"
            className="rounded-full border border-border px-4 py-2 text-sm font-bold hover:border-accent/40 hover:text-accent"
          >
            Shoes
          </Link>
          <Link
            href="/brands/nike"
            className="rounded-full border border-border px-4 py-2 text-sm font-bold hover:border-accent/40 hover:text-accent"
          >
            Nike
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="product-grid grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpen={setSelected}
            showTrendingScore
            priority={index < 4}
          />
        ))}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
