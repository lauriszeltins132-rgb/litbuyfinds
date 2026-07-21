"use client";

import Link from "next/link";
import type { PublicProduct } from "@/lib/ai/schemas";
import { formatProductPrice } from "@/lib/pricing";
import { track } from "@vercel/analytics";
import ProductCardImage from "@/components/ProductCardImage";

type AiProductCardProps = {
  product: PublicProduct;
};

export default function AiProductCard({ product }: AiProductCardProps) {
  const priceLabel =
    product.price != null ? formatProductPrice(product.price, "USD") : "Price TBA";

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-panel shadow-sm">
      <Link
        href={`/find/${product.slug}`}
        className="block"
        onClick={() =>
          track("ai_product_clicked", {
            productId: product.id,
            category: product.categorySlug,
          })
        }
      >
        <div className="product-image-shell product-image-shell--card relative aspect-square overflow-hidden bg-white">
          <ProductCardImage
            src={product.imageUrl}
            alt={product.name}
            fillClass="product-float-asset--fill-balanced"
          />
        </div>
        <div className="space-y-1 p-3">
          {product.brand ? (
            <p className="text-[10px] font-bold uppercase tracking-wide text-accent">
              {product.brand}
            </p>
          ) : null}
          <h3 className="line-clamp-2 text-sm font-bold text-foreground">
            {product.name}
          </h3>
          <p className="text-sm font-black text-foreground">{priceLabel}</p>
          <p className="text-[11px] text-muted">{product.category}</p>
          {product.matchReason ? (
            <p className="text-[11px] leading-snug text-muted">
              {product.matchReason}
            </p>
          ) : null}
        </div>
      </Link>
      {product.affiliateUrl ? (
        <div className="border-t border-border p-2">
          <a
            href={product.affiliateUrl}
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full bg-accent px-3 py-2 text-xs font-bold text-background hover:opacity-90"
            onClick={() =>
              track("ai_affiliate_link_clicked", { productId: product.id })
            }
          >
            Buy with LitBuy
          </a>
        </div>
      ) : null}
    </article>
  );
}
