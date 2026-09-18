"use client";

import {
  useRef,
  type ReactNode,
  type RefObject,
  type HTMLAttributes,
} from "react";
import { useHorizontalScrollControls } from "@/hooks/useHorizontalScrollControls";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      {direction === "left" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      )}
    </svg>
  );
}

type HorizontalScrollAreaProps = {
  children: ReactNode;
  /** Classes applied to the scrollable element. */
  className?: string;
  prevLabel: string;
  nextLabel: string;
  /** Optional external ref (e.g. DiscoveryRail imageObserveRoot). */
  scrollerRef?: RefObject<HTMLDivElement | null>;
  /** Remeasure when content changes. */
  contentKey?: string | number | boolean;
  /** Compact arrow offset for chip rows vs product cards. */
  compact?: boolean;
  /** Extra props for the scrollable container. */
  scrollerProps?: HTMLAttributes<HTMLDivElement>;
};

/**
 * Reusable horizontal scroller with overflow-aware prev/next arrows + edge fade.
 * Preserves native touch swipe; does not remount children.
 */
export default function HorizontalScrollArea({
  children,
  className = "",
  prevLabel,
  nextLabel,
  scrollerRef: externalRef,
  contentKey,
  compact = false,
  scrollerProps,
}: HorizontalScrollAreaProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const scrollerRef = externalRef ?? internalRef;
  const { canScrollLeft, canScrollRight, scrollByPage } =
    useHorizontalScrollControls(scrollerRef, contentKey);

  return (
    <div
      className={`h-scroll-wrap relative ${
        compact ? "h-scroll-wrap--compact" : ""
      }`}
    >
      <button
        type="button"
        className={`h-scroll-arrow h-scroll-arrow--prev ${
          canScrollLeft ? "h-scroll-arrow--visible" : ""
        }`}
        aria-label={prevLabel}
        disabled={!canScrollLeft}
        onClick={() => scrollByPage(-1)}
      >
        <ChevronIcon direction="left" />
      </button>

      <div
        {...scrollerProps}
        ref={scrollerRef}
        className={`h-scroll-scroller ${className}`.trim()}
      >
        {children}
      </div>

      <button
        type="button"
        className={`h-scroll-arrow h-scroll-arrow--next ${
          canScrollRight ? "h-scroll-arrow--visible" : ""
        }`}
        aria-label={nextLabel}
        disabled={!canScrollRight}
        onClick={() => scrollByPage(1)}
      >
        <ChevronIcon direction="right" />
      </button>

      {canScrollRight ? (
        <div className="h-scroll-fade" aria-hidden />
      ) : null}
    </div>
  );
}
