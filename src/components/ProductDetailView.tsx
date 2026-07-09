"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import type { ProductFacts } from "@/lib/product-details";
import { getProductImageAlt } from "@/lib/product-details";
import DataFreshness from "@/components/DataFreshness";
import MemberBenefitsStrip from "@/components/conversion/MemberBenefitsStrip";
import ProductEngagementStats from "@/components/ProductEngagementStats";
import ProductBadges from "@/components/ProductBadges";
import ProductTrustPanel from "@/components/ProductTrustPanel";
import QcAccessGate from "@/components/conversion/QcAccessGate";
import { formatProductPrice, getPriceStatus } from "@/lib/pricing";
import { getProductBadges } from "@/lib/product-badges";
import { getProductFreshnessLabel } from "@/lib/product-freshness";
import { getRnScore } from "@/lib/rn-score";
import { getProductSource } from "@/lib/filters";
import { getProductHref, slugify } from "@/lib/slugs";
import { usePreferences } from "@/context/PreferencesContext";
import { useWishlist } from "@/context/WishlistContext";
import { trackProductContext, trackSaveClick } from "@/lib/analytics-events";
import { resolveProductDisplayImage } from "@/lib/product-image-presentation";
import HowToBuySteps from "./HowToBuySteps";
import ProductImage from "./ProductImage";
import BuyWithAgentButton, {
  BuyingAgentPanel,
} from "./agents/BuyWithAgentButton";

type ProductDetailViewProps = {
  product: Product;
  facts: ProductFacts;
  description: string;
  highlights: string[];
  brand: string | null;
  categoryHref: string;
  engagementViews?: number;
  engagementSaves?: number;
  engagementTrending?: boolean;
};

export default function ProductDetailView({
  product,
  facts,
  description,
  highlights,
  brand,
  categoryHref,
  engagementViews = 0,
  engagementSaves = 0,
  engagementTrending = false,
}: ProductDetailViewProps) {
  const { currency } = usePreferences();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [copied, setCopied] = useState(false);
  const saved = isInWishlist(product.id);
  const source = getProductSource(product.affiliate_link);
  const displayImage = resolveProductDisplayImage(product);
  const imageAlt = getProductImageAlt(product);
  const badges = useMemo(() => getProductBadges(product, { maxBadges: 3 }), [product]);
  const rnScore = useMemo(() => getRnScore(product), [product]);
  const freshnessLabel = useMemo(() => getProductFreshnessLabel(product), [product]);

  async function copyLink() {
    const url = `${window.location.origin}${getProductHref(product)}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function shareProduct() {
    const url = `${window.location.origin}${getProductHref(product)}`;
    if (navigator.share) {
      await navigator.share({ title: facts.displayName, url });
      return;
    }
    await copyLink();
  }

  return (
    <section className="product-detail-hero px-4 pb-6 pt-2 sm:px-6 sm:pt-3">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="product-image-shell product-image-shell--featured product-image-hover relative overflow-hidden rounded-3xl border border-border lg:sticky lg:top-[4.75rem] lg:self-start">
          <ProductImage
            src={product.image}
            preferredSrc={displayImage?.displaySrc}
            fallbacks={displayImage?.fallbacks}
            fillClass={displayImage?.fillClass}
            knockoutWhite={displayImage?.knockoutWhite}
            enhance={displayImage?.enhance}
            darkBoost={displayImage?.darkBoost}
            alt={imageAlt}
            productName={facts.displayName}
            priority
            variant="featured"
            productHref={getProductHref(product)}
          />
          <ProductBadges badges={badges} className="!left-auto !right-3 !top-3 !items-end" />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {facts.qcStatus === "available" && (
              <span className="rounded-full border border-accent/35 bg-accent/12 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                QC available
              </span>
            )}
            {badges
              .filter((badge) => badge.kind !== "qc")
              .map((badge) => (
                <span
                  key={badge.kind}
                  className="rounded-full border border-border bg-surface/60 px-3 py-1 text-[11px] font-bold text-foreground/90"
                >
                  {badge.label}
                </span>
              ))}
            <Link
              href={categoryHref}
              className="rounded-full border border-border px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted hover:border-accent/40 hover:text-accent"
            >
              {product.category}
            </Link>
            <span className="rounded-full border border-border px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted">
              {facts.imageCount} image
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.6rem]">
            {facts.displayName}
          </h1>

          <div className="mt-3">
            <ProductEngagementStats
              views={engagementViews}
              saves={engagementSaves}
              trending={engagementTrending}
            />
          </div>

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
            <p className="text-xs text-muted">
              Confirm live price on your preferred agent before checkout.
            </p>
          </div>

          <div className="mt-4">
            <ProductTrustPanel
              facts={facts}
              rnScore={rnScore}
              freshnessLabel={freshnessLabel}
            />
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted">{description}</p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-semibold text-muted"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <BuyingAgentPanel product={product} />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {product.affiliate_link && (
              <BuyWithAgentButton
                product={product}
                location="product_page"
              />
            )}
            {product.qc_link ? (
              <QcAccessGate
                qcLink={product.qc_link}
                productName={facts.displayName}
                onTrackQc={() =>
                  trackProductContext("qc_click", product, "product_page")
                }
              />
            ) : null}
          </div>

          <div className="mt-8">
            <MemberBenefitsStrip location="product_page_benefits" compact />
          </div>

          <HowToBuySteps />

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (!saved) trackSaveClick(product.id, "product_page");
                toggleWishlist(product.id);
              }}
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

          <div className="mt-4">
            <DataFreshness variant="block" label="Catalog synced" />
          </div>
        </div>
      </div>
    </section>
  );
}
