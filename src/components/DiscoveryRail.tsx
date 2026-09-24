"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { Product } from "@/lib/types";
import { dedupeListingRail } from "@/lib/listing-dedupe";
import ContentFreshness from "@/components/ContentFreshness";
import type { ContentFreshnessVariant } from "@/lib/freshness-dates";
import HorizontalScrollArea from "@/components/HorizontalScrollArea";
import ProductCard from "./ProductCard";
import { useEffect, useRef, useState } from "react";
import { isMobileViewport } from "@/lib/is-mobile-viewport";

const ProductModal = dynamic(() => import("./ProductModal"), { ssr: false });

/** First N cards may load when the rail nears the viewport; rest wait for scroll. */
const EAGER_IMAGE_COUNT = 4;
/** Mobile: first visible pair should load immediately with high priority. */
const MOBILE_PRIORITY_COUNT = 2;
/** Mobile: next pair still uses viewport IO (no scroller root). */
const MOBILE_EAGER_COUNT = 4;

type DiscoveryRailProps = {
  title: string;
  subtitle?: string;
  /** When omitted, the "View all" control is hidden. */
  href?: string;
  products: Product[];
  showTrendingScore?: boolean;
  /** Only the first rail should preload card images. */
  preloadImages?: boolean;
  freshness?: ContentFreshnessVariant;
  /** Tighter vertical spacing for above-the-fold rails. */
  tight?: boolean;
};

export default function DiscoveryRail({
  title,
  subtitle,
  href,
  products,
  showTrendingScore = false,
  preloadImages = false,
  freshness,
  tight = false,
}: DiscoveryRailProps) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [railNearViewport, setRailNearViewport] = useState(preloadImages);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const railProducts = dedupeListingRail(products);

  useEffect(() => {
    setIsMobile(isMobileViewport());
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (preloadImages) {
      setRailNearViewport(true);
      return;
    }
    const node = sectionRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setRailNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRailNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "280px 0px", threshold: 0.01 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [preloadImages]);

  if (railProducts.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`discovery-section px-3 sm:px-6 ${tight ? "py-3 sm:py-5" : "py-5 sm:py-8"}`}
    >
      <div className="discovery-section__panel mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="discovery-section__header flex items-end justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              {title && (
                <h2 className="discovery-section__title text-lg font-black leading-tight tracking-tight sm:text-2xl">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-0.5 line-clamp-1 text-xs text-muted sm:mt-1 sm:line-clamp-none sm:text-sm">
                  {subtitle}
                </p>
              )}
              {freshness ? (
                <div className="mt-1 hidden sm:block">
                  <ContentFreshness variant={freshness} />
                </div>
              ) : null}
            </div>
            {href ? (
              <Link
                href={href}
                className="discovery-section__cta shrink-0 rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-bold text-accent shadow-sm transition hover:border-accent/35 sm:text-sm"
              >
                View all →
              </Link>
            ) : null}
          </div>
        )}

        <HorizontalScrollArea
          scrollerRef={scrollerRef}
          contentKey={railProducts.length}
          prevLabel="Previous products"
          nextLabel="Next products"
          className="discovery-rail -mx-0.5 flex gap-2.5 overflow-x-auto px-0.5 pb-1 sm:gap-4"
        >
          {railProducts.map((product, index) => {
            const eagerDesktop = index < EAGER_IMAGE_COUNT;
            const eagerMobile = index < MOBILE_EAGER_COUNT;
            const eager = isMobile ? eagerMobile : eagerDesktop;
            const priority =
              (preloadImages && index < 2) ||
              (isMobile && railNearViewport && index < MOBILE_PRIORITY_COUNT);

            /**
             * Desktop: non-eager cards observe the rail scroller.
             * Mobile: never use the scroller as IO root (Safari blank-image bug);
             * viewport IO + sync rect check handles horizontal swipe.
             */
            const imageObserveRoot =
              !isMobile && railNearViewport && !eager
                ? scrollerRef.current
                : null;

            return (
              <div
                key={product.id}
                className="discovery-rail__item w-[calc(50vw-1.25rem)] max-w-[178px] shrink-0 sm:w-[240px] sm:max-w-none"
              >
                <ProductCard
                  product={product}
                  onOpen={setSelected}
                  compact
                  showTrendingScore={showTrendingScore}
                  priority={priority}
                  suspendImage={!railNearViewport}
                  imageObserveRoot={imageObserveRoot}
                />
              </div>
            );
          })}
        </HorizontalScrollArea>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
