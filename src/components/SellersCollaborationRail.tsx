"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { dedupeListingRail } from "@/lib/listing-dedupe";
import { SELLERS_COLLABORATION_SECTION_ID } from "@/lib/scroll-to-sellers-collaboration";
import HorizontalScrollArea from "@/components/HorizontalScrollArea";
import ProductCard from "./ProductCard";

const ProductModal = dynamic(() => import("./ProductModal"), { ssr: false });

/** First N cards may load when the rail nears the viewport; rest wait for scroll. */
const EAGER_IMAGE_COUNT = 4;

type SellersCollaborationRailProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  /** Tighter vertical spacing for above-the-fold rails. */
  tight?: boolean;
};

export default function SellersCollaborationRail({
  title,
  subtitle,
  products,
  tight = false,
}: SellersCollaborationRailProps) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [railNearViewport, setRailNearViewport] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const railProducts = dedupeListingRail(products);
  const count = railProducts.length;

  useEffect(() => {
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
  }, []);

  if (count === 0) return null;

  return (
    <section
      id={SELLERS_COLLABORATION_SECTION_ID}
      ref={sectionRef}
      className={`discovery-section sellers-collab-section scroll-mt-24 px-3 sm:px-6 ${
        tight ? "py-3 sm:py-5" : "py-5 sm:py-8"
      }`}
    >
      <div className="discovery-section__panel mx-auto max-w-7xl">
        <div className="discovery-section__header flex items-end justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h2 className="discovery-section__title text-lg font-black leading-tight tracking-tight sm:text-2xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted sm:mt-1 sm:line-clamp-none sm:text-sm">
                {subtitle}
              </p>
            ) : null}
            {!expanded ? (
              <p className="mt-1 text-[11px] font-semibold text-muted sm:hidden">
                Swipe to explore {count.toLocaleString()} products →
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="discovery-section__cta shrink-0 rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-bold text-accent shadow-sm transition hover:border-accent/35 sm:text-sm"
            aria-expanded={expanded}
          >
            {expanded
              ? "Show less"
              : `View all ${count.toLocaleString()} →`}
          </button>
        </div>

        {expanded ? (
          <div className="sellers-collab-grid grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {railProducts.map((product, index) => (
              <div key={product.id} className="min-w-0">
                <ProductCard
                  product={product}
                  onOpen={setSelected}
                  compact
                  priority={index < 2}
                  suspendImage={!railNearViewport}
                />
              </div>
            ))}
          </div>
        ) : (
          <HorizontalScrollArea
            scrollerRef={scrollerRef}
            contentKey={count}
            prevLabel="Previous sponsored products"
            nextLabel="Next sponsored products"
            className="discovery-rail sellers-collab-rail -mx-0.5 flex gap-2.5 overflow-x-auto px-0.5 pb-1 sm:gap-4"
          >
            {railProducts.map((product, index) => {
              const eager = index < EAGER_IMAGE_COUNT;
              return (
                <div
                  key={product.id}
                  className="discovery-rail__item w-[calc(50vw-1.25rem)] max-w-[178px] shrink-0 sm:w-[240px] sm:max-w-none"
                >
                  <ProductCard
                    product={product}
                    onOpen={setSelected}
                    compact
                    priority={index < 2}
                    suspendImage={!railNearViewport}
                    imageObserveRoot={
                      railNearViewport && !eager
                        ? scrollerRef.current
                        : null
                    }
                  />
                </div>
              );
            })}
          </HorizontalScrollArea>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
