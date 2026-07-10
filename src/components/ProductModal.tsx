"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import type { Product } from "@/lib/types";
import { getProductHref } from "@/lib/slugs";
import { getDisplayBrand, getDisplayProductName } from "@/lib/product-validation";
import { getProductImageAlt } from "@/lib/product-details";
import { formatProductPrice } from "@/lib/pricing";
import { getProductBadges } from "@/lib/product-badges";
import { getProductSource } from "@/lib/filters";
import {
  getProductDescription,
  getProductHighlights,
} from "@/lib/product-details";
import { usePreferences } from "@/context/PreferencesContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useConversion } from "@/context/ConversionContext";
import { trackProductContext, trackSaveClick } from "@/lib/analytics-events";
import { resolveProductDisplayImage } from "@/lib/product-image-presentation";
import ProductBadges from "./ProductBadges";
import ProductImage from "./ProductImage";
import BuyWithAgentButton from "./agents/BuyWithAgentButton";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { currency } = usePreferences();
  const { recordProductView } = useConversion();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addViewed } = useRecentlyViewed();

  useEffect(() => {
    if (!product) return;
    recordProductView(product.id);
    addViewed(product);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose, recordProductView, addViewed]);

  const badges = useMemo(
    () => (product ? getProductBadges(product, { maxBadges: 2 }) : []),
    [product]
  );

  if (!product) return null;

  const displayName = getDisplayProductName(product);
  const brand = getDisplayBrand(product);
  const source = getProductSource(product.affiliate_link);
  const displayImage = resolveProductDisplayImage(product);
  const imageAlt = getProductImageAlt(product);
  const saved = isInWishlist(product.id);

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="modal-enter panel-shell relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-border sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            Product detail
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1.5 text-sm font-semibold"
          >
            Close
          </button>
        </div>

        <div className="grid flex-1 overflow-y-auto lg:grid-cols-2">
          <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
            <div className="product-image-shell product-image-hover relative aspect-square overflow-hidden rounded-2xl">
              <ProductImage
                src={product.image}
                preferredSrc={displayImage?.displaySrc}
                fallbacks={displayImage?.fallbacks}
                fillClass={displayImage?.fillClass}
                knockoutWhite={displayImage?.knockoutWhite}
                enhance={displayImage?.enhance}
                darkBoost={displayImage?.darkBoost}
                alt={imageAlt}
                productName={displayName}
                variant="card"
                productHref={getProductHref(product)}
              />
              <ProductBadges badges={badges} />
            </div>
            {product.qc_link && (
              <a
                href={product.qc_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackProductContext("qc_click", product, "product_modal")}
                className="mt-4 inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-bold text-accent"
              >
                View QC on Telegram →
              </a>
            )}
          </div>

          <div className="flex flex-col p-5">
            <h2 className="text-2xl font-black">{displayName}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {brand && (
                <span className="rounded-full border border-border px-3 py-1 text-xs font-bold">
                  {brand}
                </span>
              )}
              <span className="rounded-full border border-border px-3 py-1 text-xs font-bold uppercase text-muted">
                {source}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-bold text-muted">
                {product.category}
              </span>
            </div>

            <p className="mt-5 text-3xl font-black text-accent">
              {formatProductPrice(product.price, currency)}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              {getProductDescription(product)}
            </p>

            <ul className="mt-4 space-y-2">
              {getProductHighlights(product).map((item) => (
                <li key={item} className="flex gap-2 text-sm">
                  <span className="text-accent">•</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-3 pt-8">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!saved) trackSaveClick(product.id, "product_modal");
                    toggleWishlist(product.id);
                  }}
                  className={`flex flex-1 items-center justify-center rounded-full border py-3 text-sm font-bold ${
                    saved
                      ? "border-accent bg-accent text-background"
                      : "border-border text-foreground hover:border-accent/40"
                  }`}
                >
                  {saved ? "Saved" : "Save"}
                </button>
                <Link
                  href={getProductHref(product)}
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center rounded-full border border-border py-3 text-sm font-bold text-foreground hover:border-accent/40"
                >
                  Full page
                </Link>
              </div>
              {product.affiliate_link ? (
                <BuyWithAgentButton
                  product={product}
                  location="product_modal"
                  showAgentPicker
                  className="flex w-full items-center justify-center rounded-full bg-accent py-4 text-sm font-black text-background hover:bg-accent-hover"
                />
              ) : (
                <p className="text-center text-sm text-muted">No buy link available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
