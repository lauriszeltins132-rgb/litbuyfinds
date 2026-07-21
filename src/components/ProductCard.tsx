"use client";

import Link from "next/link";
import { memo, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { getDisplayProductName, getDisplayBrand } from "@/lib/product-validation";
import { formatProductPrice, getPriceStatus } from "@/lib/pricing";
import { getCardDisplayProps } from "@/lib/card-props";
import { getProductSource } from "@/lib/affiliate-source";
import { getProductHref } from "@/lib/slugs";
import BrandMark from "./BrandMark";
import { usePreferences } from "@/context/PreferencesContext";
import { useWishlist } from "@/context/WishlistContext";
import { trackProductContext, trackSaveClick } from "@/lib/analytics-events";
import LitBuyMicroCta from "./LitBuyMicroCta";
import ProductBadges from "./ProductBadges";
import LitbuyProductImage from "./LitbuyProductImage";
import BuyWithAgentButton from "./agents/BuyWithAgentButton";

type ProductCardProps = {
  product: Product;
  onOpen?: (product: Product) => void;
  compact?: boolean;
  showTrendingScore?: boolean;
  priority?: boolean;
};

function getCardImageAlt(product: Product): string {
  const brand = getDisplayBrand(product);
  const name = getDisplayProductName(product);
  if (brand) {
    return `${brand} ${name} — ${product.category} find on LitBuy Finds`;
  }
  return `${name} — LitBuy Finds`;
}

async function shareProduct(product: Product, title: string) {
  const url = `${window.location.origin}${getProductHref(product)}`;
  if (navigator.share) {
    await navigator.share({
      title,
      text: `Check out this find on LitBuy Finds`,
      url,
    });
    return;
  }
  await navigator.clipboard.writeText(url);
}

function ProductCard({
  product,
  onOpen,
  compact = false,
  showTrendingScore = false,
  priority = false,
}: ProductCardProps) {
  const { currency } = usePreferences();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [copied, setCopied] = useState(false);
  const saved = isInWishlist(product.id);
  const displayName = getDisplayProductName(product);
  const brand = getDisplayBrand(product);
  const source = getProductSource(product.affiliate_link);
  const productHref = getProductHref(product);
  const imageAlt = getCardImageAlt(product);
  const cardProps = useMemo(() => getCardDisplayProps(product.id), [product.id]);
  const badges = useMemo(
    () =>
      showTrendingScore
        ? (cardProps?.badgesTrending ?? [])
        : (cardProps?.badges ?? []),
    [cardProps, showTrendingScore]
  );
  const freshness = cardProps?.freshness ?? null;

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
      className={`product-card group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-panel shadow-sm active:scale-[0.99] sm:rounded-2xl ${
        compact ? "text-[12px] sm:text-[13px]" : ""
      }`}
    >
      <div className="product-card-media">
        <Link
          href={productHref}
          className="product-image-shell product-image-shell--card product-image-hover relative block aspect-square overflow-hidden"
        >
          <LitbuyProductImage
            src={product.image}
            preferredSrc={cardProps?.displaySrc}
            fallbacks={cardProps?.fallbacks}
            fillClass={cardProps?.fillClass}
            surfaceClass={cardProps?.surfaceClass}
            isProcessedCutout={cardProps?.isProcessedCutout}
            category={product.category_slug}
            alt={imageAlt}
            productHref={productHref}
            priority={priority}
            variant="card"
          />
          <div className="product-card-hover-hint bg-gradient-to-t from-background/80 to-transparent px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
              View details
            </p>
          </div>
        </Link>
        <ProductBadges badges={badges} />
      </div>

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
          {brand ? <BrandMark name={brand} size="sm" /> : null}
          <span className="rounded bg-surface px-1.5 py-0.5 uppercase">{source}</span>
          {freshness ? (
            <span className="text-[10px] font-semibold text-accent/80">{freshness}</span>
          ) : null}
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
            <BuyWithAgentButton
              product={product}
              location="product_card"
              showAgentPicker
              compact
            />
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
            onClick={() => {
              if (!saved) trackSaveClick(product.id, "product_card");
              toggleWishlist(product.id);
            }}
            aria-label={saved ? "Remove from saved" : "Save item"}
            className={`${iconBtn} ${
              saved ? "border-accent bg-accent text-background" : ""
            }`}
          >
            ♥
          </button>

          <button
            type="button"
            onClick={() => shareProduct(product, displayName)}
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

export default memo(ProductCard);
