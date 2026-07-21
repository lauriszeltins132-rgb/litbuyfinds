"use client";

import AiProductCard from "@/components/ai/AiProductCard";
import type { PublicProduct } from "@/lib/ai/schemas";

type AiProductGridProps = {
  products: PublicProduct[];
  title?: string;
};

export default function AiProductGrid({ products, title }: AiProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="mt-3">
      {title ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
          {title}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {products.map((product) => (
          <AiProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
