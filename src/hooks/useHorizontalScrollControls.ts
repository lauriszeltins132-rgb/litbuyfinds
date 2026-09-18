"use client";

import {
  useCallback,
  useEffect,
  useState,
  type RefObject,
} from "react";

const SCROLL_EDGE_PX = 4;

export type HorizontalScrollState = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollByPage: (direction: -1 | 1) => void;
  updateScrollState: () => void;
};

/**
 * Shared horizontal overflow detection + smooth page scrolling.
 * Does not remount children or touch image loading.
 */
export function useHorizontalScrollControls(
  scrollerRef: RefObject<HTMLElement | null>,
  /** Remeasure when content length / layout mode changes. */
  contentKey?: string | number | boolean
): HorizontalScrollState {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const maxScroll = node.scrollWidth - node.clientWidth;
    if (maxScroll <= SCROLL_EDGE_PX) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(node.scrollLeft > SCROLL_EDGE_PX);
    setCanScrollRight(maxScroll - node.scrollLeft > SCROLL_EDGE_PX);
  }, [scrollerRef]);

  const scrollByPage = useCallback(
    (direction: -1 | 1) => {
      const node = scrollerRef.current;
      if (!node) return;
      const amount = Math.max(node.clientWidth * 0.85, 200);
      node.scrollBy({ left: direction * amount, behavior: "smooth" });
    },
    [scrollerRef]
  );

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    updateScrollState();
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateScrollState();
      });
      resizeObserver.observe(node);
      if (node.firstElementChild) {
        resizeObserver.observe(node.firstElementChild);
      }
    }

    // Remeasure after layout/paint (images / fonts can change scrollWidth).
    const raf = window.requestAnimationFrame(() => updateScrollState());
    const t1 = window.setTimeout(updateScrollState, 120);
    const t2 = window.setTimeout(updateScrollState, 400);

    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [scrollerRef, contentKey, updateScrollState]);

  return { canScrollLeft, canScrollRight, scrollByPage, updateScrollState };
}
