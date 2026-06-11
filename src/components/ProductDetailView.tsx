"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import DataFreshness from "@/components/DataFreshness";
import { formatProductPrice, getPriceStatus } from "@/lib/pricing";
import { getProductSource } from "@/lib/filters";
import { getProductHref, slugify } from "@/lib/slugs";
import { usePreferences } from "@/context/PreferencesContext";
import { useWishlist } from "@/context/WishlistContext";
import { trackProductContext } from "@/lib/analytics-events";
import ProductImage from "./ProductImage";

type ProductDetailViewProps = {
  product: Product;
  description: string;
  highlights: string[];
  brand: string | null;
  categoryHref: string;
};

export default function ProductDetailView({
  product,
  description,
  highlights,
  brand,
  categoryHref,
}: ProductDetailViewProps) {
  const { currency } = usePreferences();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [copied, setCopied] = useState(false);
  const saved = isInWishlist(product.id);
  const source = getProductSource(product.affiliate_link);

  async function copyLink() {
    const url = `${window.location.origin}${getProductHref(product)}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function shareProduct() {
    const url = `${window.location.origin}${getProductHref(product)}`;
    if (navigator.share) {
      await navigator.share({ title: product.product_name, url });
      return;
    }
    await copyLink();
  }

  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="product-image-shell product-image-shell--featured product-image-hover overflow-hidden rounded-3xl border border-border">
          <ProductImage
            src={product.image}
            alt={product.product_name}
            priority
            variant="featured"
            productHref={getProductHref(product)}
          />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {product.qc_link && (
              <span className="rounded-full border border-accent/35 bg-accent/12 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                QC available
              </span>
            )}
            <Link
              href={categoryHref}
              className="rounded-full border border-border px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted hover:border-accent/40 hover:text-accent"
            >
              {product.category}
            </Link>
          </div>

          <h1 className="mt-4 text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.6rem]">
            {product.product_name}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {brand && (
              <Link
                href={`/brands/${slugify(brand)}`}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
              >
                {brand}
              </Link>
            )}
            <span className="rounded-full border border-border px-3 py-1.5 text-xs font-bold uppercase text-muted">
              {source}
            </span>
          </div>

          <div className="mt-6 inline-flex flex-col gap-2 rounded-2xl border border-accent/20 bg-accent/8 px-5 py-4">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-muted">Catalog price</span>
              <span
                className={`text-3xl font-black sm:text-4xl ${
                  getPriceStatus(product.price) === "exact"
                    ? "text-accent"
                    : "text-muted text-xl sm:text-2xl"
                }`}
              >
                {formatProductPrice(product.price, currency)}
              </span>
            </div>
            {getPriceStatus(product.price) !== "exact" ? (
              <p className="text-xs text-muted">
                Confirm the live price on LitBuy before checkout.
              </p>
            ) : (
              <p className="text-xs text-muted">
                From catalog data — confirm latest price on LitBuy before buying.
              </p>
            )}
          </div>

          <div className="mt-3">
            <DataFreshness variant="block" label="Catalog synced" />
          </div>

          <p className="mt-6 text-base leading-relaxed text-foreground/90">
            {description}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-semibold text-muted"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {product.affiliate_link && (
              <a
                href={product.affiliate_link}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() => trackProductContext("buy_click", product, "product_page")}
                className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-black text-background hover:bg-accent-hover"
              >
                Buy on LitBuy
              </a>
            )}
            {product.qc_link ? (
              <a
                href={product.qc_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackProductContext("qc_click", product, "product_page")}
                className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-accent/10 px-6 py-3.5 text-sm font-bold text-accent"
              >
                View QC
              </a>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`rounded-full border px-5 py-2.5 text-sm font-bold ${
                saved
                  ? "border-accent bg-accent text-background"
                  : "border-border text-foreground hover:border-accent/40"
              }`}
            >
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={shareProduct}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:border-accent/40"
            >
              Share
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:border-accent/40"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
