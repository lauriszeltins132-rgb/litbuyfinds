"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { getDisplayProductName, getDisplayBrand } from "@/lib/product-validation";
import { formatProductPrice, getPriceStatus } from "@/lib/pricing";
import { getTrendingScore } from "@/lib/discovery";
import { getProductSource } from "@/lib/filters";
import { getProductHref } from "@/lib/slugs";
import { usePreferences } from "@/context/PreferencesContext";
import { useWishlist } from "@/context/WishlistContext";
import { trackProductContext } from "@/lib/analytics-events";
import LitBuyMicroCta from "./LitBuyMicroCta";
import ProductImage from "./ProductImage";

type ProductCardProps = {
  product: Product;
  onOpen?: (product: Product) => void;
  compact?: boolean;
  showTrendingScore?: boolean;
};

async function shareProduct(product: Product) {
  const url = `${window.location.origin}${getProductHref(product)}`;
  if (navigator.share) {
    await navigator.share({
      title: product.product_name,
      text: `Check out this find on LitBuy Finds`,
      url,
    });
    return;
  }
  await navigator.clipboard.writeText(url);
}

export default function ProductCard({
  product,
  onOpen,
  compact = false,
  showTrendingScore = false,
}: ProductCardProps) {
  const { currency } = usePreferences();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [copied, setCopied] = useState(false);
  const saved = isInWishlist(product.id);
  const displayName = getDisplayProductName(product);
  const brand = getDisplayBrand(product);
  const source = getProductSource(product.affiliate_link);
  const productHref = getProductHref(product);
  const heatScore = getTrendingScore(product);

  async function handleCopy() {
    const url = `${window.location.origin}${productHref}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function openProduct() {
    if (onOpen) onOpen(product);
  }

  const iconBtn =
    "flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent sm:h-8 sm:w-8";

  return (
    <article
      className={`product-card group flex flex-col overflow-hidden rounded-xl border border-border bg-panel transition-all duration-300 active:scale-[0.99] sm:rounded-2xl sm:hover:-translate-y-1 sm:hover:border-accent/30 sm:hover:shadow-[0_12px_40px_rgba(212,255,60,0.08)] ${
        compact ? "text-[12px] sm:text-[13px]" : ""
      }`}
    >
      <Link
        href={productHref}
        className="product-image-shell product-image-shell--card product-image-hover relative block aspect-square overflow-hidden"
      >
        <ProductImage
          src={product.image}
          alt={displayName}
          productName={displayName}
          variant="card"
          productHref={productHref}
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {(showTrendingScore ? heatScore >= 68 : heatScore >= 74) && (
            <span className="rounded-full border border-accent/35 bg-background/85 px-2 py-0.5 text-[10px] font-bold text-accent backdrop-blur">
              {heatScore} hot
            </span>
          )}
          {product.qc_link && (
            <span className="rounded-full border border-accent/25 bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent backdrop-blur">
              QC available
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/50 to-transparent px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
            View details
          </p>
        </div>
      </Link>

      <div className={`flex flex-1 flex-col gap-1.5 ${compact ? "p-2.5 sm:p-3" : "p-3.5"}`}>
        <Link href={productHref} className="text-left">
          <h3
            className={`line-clamp-2 font-bold leading-snug text-foreground ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            {displayName}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
          {brand && <span>{brand}</span>}
          <span className="rounded bg-surface px-1.5 py-0.5 uppercase">{source}</span>
        </div>

        <p
          className={`font-black ${
            getPriceStatus(product.price) === "exact"
              ? "text-accent"
              : "text-muted text-sm"
          } ${compact ? "text-sm" : "text-base"}`}
        >
          {formatProductPrice(product.price, currency)}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {product.affiliate_link ? (
            <a
              href={product.affiliate_link}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => trackProductContext("buy_click", product, "product_card")}
              className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-black text-background"
            >
              Buy
            </a>
          ) : (
            <button
              type="button"
              onClick={openProduct}
              className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold text-muted"
            >
              View
            </button>
          )}

          {product.qc_link ? (
            <a
              href={product.qc_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackProductContext("qc_click", product, "product_card")}
              className="rounded-full border border-border px-2.5 py-1.5 text-[11px] font-bold text-foreground hover:border-accent/40"
            >
              QC
            </a>
          ) : (
            <span className="rounded-full border border-border/50 px-2.5 py-1.5 text-[11px] text-muted/50">
              QC
            </span>
          )}

          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={saved ? "Remove from saved" : "Save item"}
            className={`${iconBtn} ${
              saved ? "border-accent bg-accent text-background" : ""
            }`}
          >
            ♥
          </button>

          <button
            type="button"
            onClick={() => shareProduct(product)}
            aria-label="Share product"
            className={iconBtn}
          >
            ↗
          </button>

          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy product link"
            className={iconBtn}
          >
            {copied ? "✓" : "⧉"}
          </button>
        </div>

        {product.affiliate_link && !compact ? (
          <LitBuyMicroCta location="product_card_litbuy" />
        ) : null}
      </div>
    </article>
  );
}
