"use client";

import Link from "next/link";
import { memo, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { getDisplayProductName, getDisplayBrand } from "@/lib/product-validation";
import { getProductImageAlt } from "@/lib/product-details";
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
import ProductCardImage from "./ProductCardImage";
import BuyWithAgentButton from "./agents/BuyWithAgentButton";

type ProductCardProps = {
  product: Product;
  onOpen?: (product: Product) => void;
  compact?: boolean;
  showTrendingScore?: boolean;
  priority?: boolean;
};

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
  const imageAlt = getProductImageAlt(product);
  const cardProps = useMemo(() => getCardDisplayProps(product.id), [product.id]);
  const badges = useMemo(
    () =>
      showTrendingScore
        ? (cardProps?.badgesTrending ?? [])
        : (cardProps?.badges ?? []),
    [cardProps, showTrendingScore]
  );
  const freshness = cardProps?.freshness ?? null;
  const hasBuyLink = Boolean(product.affiliate_link);
  const hasQc = Boolean(product.qc_link);
  const showMicroCta = hasBuyLink && !compact;

  async function handleCopy() {
    const url = `${window.location.origin}${productHref}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function openProduct() {
    if (onOpen) onOpen(product);
  }

  return (
    <article
      className={`product-card group flex h-full flex-col overflow-hidden active:scale-[0.99] ${
        compact ? "product-card--compact" : ""
      }`}
    >
      <div className="product-card-media">
        <Link
          href={productHref}
          className="product-image-shell product-image-shell--card product-image-hover relative block aspect-square overflow-hidden"
        >
          <ProductCardImage
            src={product.image}
            preferredSrc={cardProps?.displaySrc}
            fallbacks={cardProps?.fallbacks}
            fillClass={cardProps?.fillClass}
            alt={imageAlt}
            productHref={productHref}
            priority={priority}
          />
          <div className="product-card-hover-hint bg-gradient-to-t from-white/90 to-transparent px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
              View details
            </p>
          </div>
        </Link>
        <ProductBadges badges={badges} />
      </div>

      <div
        className={`product-card-body flex min-h-0 flex-1 flex-col ${
          compact ? "p-2.5 sm:p-3" : "p-3 sm:p-3.5"
        }`}
      >
        <div className="product-card-copy flex min-h-0 flex-1 flex-col gap-1.5">
          <Link href={productHref} className="text-left">
            <h3
              className={`product-card-title line-clamp-2 font-bold leading-snug text-foreground ${
                compact ? "min-h-[2.35rem] text-xs" : "min-h-[2.5rem] text-sm"
              }`}
            >
              {displayName}
            </h3>
          </Link>

          <div className="product-card-meta flex min-h-[1.25rem] flex-wrap items-center gap-1.5 text-[11px] text-muted">
            {brand ? <BrandMark name={brand} size="sm" /> : null}
            <span className="product-card-source rounded-full border border-border/60 bg-white px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              {source}
            </span>
            {freshness ? (
              <span className="text-[10px] font-semibold text-accent/80">{freshness}</span>
            ) : null}
          </div>

          <p
            className={`product-card-price font-black ${
              getPriceStatus(product.price) === "exact"
                ? "text-accent"
                : "text-muted text-sm"
            } ${compact ? "text-sm" : "text-base"}`}
          >
            {formatProductPrice(product.price, currency)}
          </p>
        </div>

        <div
          className={`product-card-actions mt-auto ${
            compact ? "product-card-actions--compact" : ""
          } ${showMicroCta ? "product-card-actions--with-footer" : ""}`}
        >
          <div className="product-card-actions__toolbar">
            <div className="product-card-actions__primary">
              {hasBuyLink ? (
                <BuyWithAgentButton
                  product={product}
                  location="product_card"
                  showAgentPicker
                  compact
                  className="product-card-buy"
                />
              ) : (
                <button
                  type="button"
                  onClick={openProduct}
                  className="product-card-action product-card-action--secondary product-card-buy"
                >
                  View
                </button>
              )}

              {hasQc ? (
                <a
                  href={product.qc_link!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackProductContext("qc_click", product, "product_card")}
                  className="product-card-action product-card-action--secondary"
                >
                  QC
                </a>
              ) : null}
            </div>

            <div className="product-card-actions__secondary">
              <button
                type="button"
                onClick={() => {
                  if (!saved) trackSaveClick(product.id, "product_card");
                  toggleWishlist(product.id);
                }}
                aria-label={saved ? "Remove from saved" : "Save item"}
                className={`product-card-icon-btn ${
                  saved ? "product-card-icon-btn--active" : ""
                }`}
              >
                ♥
              </button>

              <button
                type="button"
                onClick={() => shareProduct(product, displayName)}
                aria-label="Share product"
                className="product-card-icon-btn"
              >
                ↗
              </button>

              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy product link"
                className="product-card-icon-btn"
              >
                {copied ? "✓" : "⧉"}
              </button>
            </div>
          </div>

          {showMicroCta ? (
            <div className="product-card-footer">
              <LitBuyMicroCta location="product_card_litbuy" />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
