"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { trackBrokenImage } from "@/lib/analytics-events";
import {
  hasPlausibleImageDimensions,
  validateImageUrl,
} from "@/lib/image-url";
import { IMAGE_LOAD_TIMEOUT_MS } from "@/lib/image-load-timeout";
import { acquireImageLoadSlot } from "@/lib/image-load-queue";
import { isMobileViewport } from "@/lib/is-mobile-viewport";
import {
  abortImageElementLoad,
  filterFailedImageCandidates,
  isImageElementCached,
  isImageUrlCached,
  markImageUrlFailed,
  rememberLoadedImageUrl,
} from "@/lib/image-load-cache";

type UseProductImageLoaderArgs = {
  src: string;
  preferredSrc?: string;
  fallbacks?: string[];
  priority?: boolean;
  analyticsContext: string;
  /** When true, do not start network loads (rail below fold / deferred slots). */
  suspend?: boolean;
  /** Optional IntersectionObserver root (e.g. horizontal rail scroller). */
  observeRoot?: Element | null;
};

/** Stable empty list — never use a fresh `[]` default (it remounts loaders). */
export const EMPTY_IMAGE_FALLBACKS: string[] = [];

/**
 * Only start loading shortly before the card enters view.
 * Tighter than before so far-below rows do not compete with the first row.
 */
const VIEWPORT_ROOT_MARGIN = "220px 0px";

/** Mobile: include horizontal margin so overflow-x rail cards wake reliably. */
const MOBILE_VIEWPORT_ROOT_MARGIN = "180px 72px";

/**
 * Transient network/timeout failures: original attempt + up to 2 soft retries
 * (3 total) before advancing candidates / showing the existing fallback.
 */
const MAX_SOFT_RETRIES = 2;

/** Backoff between soft retries (ms). */
const SOFT_RETRY_BACKOFF_MS = [700, 1600] as const;

/** Faster mobile timeout so blank visible cards recover sooner. */
const MOBILE_IMAGE_LOAD_TIMEOUT_MS = 10_000;

function buildCandidates(
  src: string,
  preferredSrc: string | undefined,
  fallbacks: string[]
): string[] {
  const validation = validateImageUrl(src);
  if (!validation.valid) return [];

  const ordered = [preferredSrc, validation.normalized, ...fallbacks].filter(
    (url): url is string => Boolean(url)
  );
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const url of ordered) {
    if (seen.has(url)) continue;
    seen.add(url);
    unique.push(url);
  }
  return filterFailedImageCandidates(unique);
}

function getObserveTarget(img: HTMLImageElement | null): Element | null {
  if (!img) return null;
  return img.closest(".product-float-stage") ?? img;
}

/**
 * Shared product-image loader: viewport gating, concurrency slots, session
 * cache, soft retries with backoff. Does not alter image URLs or presentation.
 */
export function useProductImageLoader({
  src,
  preferredSrc,
  fallbacks = EMPTY_IMAGE_FALLBACKS,
  priority = false,
  analyticsContext,
  suspend = false,
  observeRoot = null,
}: UseProductImageLoaderArgs) {
  const validation = useMemo(() => validateImageUrl(src), [src]);

  const fallbackKey = fallbacks.join("|");
  const candidates = useMemo(
    () => buildCandidates(src, preferredSrc, fallbacks),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fallbackKey tracks contents
    [src, preferredSrc, fallbackKey]
  );
  const candidateKey = candidates.join("|");
  const candidatesRef = useRef(candidates);
  candidatesRef.current = candidates;

  const [srcIndex, setSrcIndex] = useState(0);
  const [retryToken, setRetryToken] = useState(0);
  const [failed, setFailed] = useState(candidates.length === 0);
  const [loaded, setLoaded] = useState(false);
  const [cacheBoost, setCacheBoost] = useState(false);
  const [nearViewport, setNearViewport] = useState(priority);
  /** Concurrency slot acquired — required before attaching network src. */
  const [slotReady, setSlotReady] = useState(false);
  /** Bumps to re-run IntersectionObserver after Safari bfcache / tab return. */
  const [visibilityEpoch, setVisibilityEpoch] = useState(0);

  const imgRef = useRef<HTMLImageElement>(null);
  const loggedRef = useRef(false);
  const softRetryCountRef = useRef(0);
  const softRetryTimerRef = useRef<number | null>(null);
  const releaseSlotRef = useRef<(() => void) | null>(null);
  const mobileRef = useRef(false);

  const displaySrc = candidates[srcIndex] ?? "";
  const nearReady = !suspend && (priority || nearViewport || cacheBoost);
  const allowFetch = nearReady && (slotReady || cacheBoost);

  const clearSoftRetryTimer = useCallback(() => {
    if (softRetryTimerRef.current != null) {
      window.clearTimeout(softRetryTimerRef.current);
      softRetryTimerRef.current = null;
    }
  }, []);

  const releaseSlot = useCallback(() => {
    if (releaseSlotRef.current) {
      releaseSlotRef.current();
      releaseSlotRef.current = null;
    }
    setSlotReady(false);
  }, []);

  useEffect(() => {
    mobileRef.current = isMobileViewport();
  }, []);

  useEffect(() => {
    const firstSrc = candidatesRef.current[0] ?? "";
    const cached = isImageUrlCached(firstSrc);
    clearSoftRetryTimer();
    releaseSlot();
    setSrcIndex(0);
    setRetryToken(0);
    setFailed(candidatesRef.current.length === 0);
    setLoaded(cached);
    setCacheBoost(cached);
    setNearViewport((!suspend && priority) || cached);
    loggedRef.current = false;
    softRetryCountRef.current = 0;
  }, [candidateKey, priority, suspend, clearSoftRetryTimer, releaseSlot]);

  useEffect(() => () => {
    clearSoftRetryTimer();
    releaseSlot();
  }, [clearSoftRetryTimer, releaseSlot]);

  // Safari / iOS: re-arm visibility after bfcache restore, tab return, resume.
  useEffect(() => {
    if (suspend || priority || cacheBoost) return;

    const bump = () => {
      if (document.visibilityState === "hidden") return;
      setVisibilityEpoch((value) => value + 1);
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) bump();
    };

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", bump);
    window.addEventListener("orientationchange", bump);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", bump);
      window.removeEventListener("orientationchange", bump);
    };
  }, [cacheBoost, priority, suspend]);

  useEffect(() => {
    if (suspend || priority || cacheBoost || nearViewport) return;

    const target = getObserveTarget(imgRef.current);
    if (!target) return;

    if (typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }

    const mobile = isMobileViewport();
    mobileRef.current = mobile;

    /**
     * Mobile Safari is unreliable with IntersectionObserver roots inside
     * overflow-x scrollers. Prefer the viewport root on mobile even when a
     * rail scroller root is provided.
     */
    const root = mobile ? null : observeRoot ?? null;
    const rootMargin = mobile
      ? MOBILE_VIEWPORT_ROOT_MARGIN
      : root
        ? "40px 80px"
        : VIEWPORT_ROOT_MARGIN;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        observer.disconnect();
      },
      {
        root,
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(target);

    const markVisibleIfInRange = () => {
      try {
        const rect = target.getBoundingClientRect();
        const vw = window.innerWidth || 0;
        const vh = window.innerHeight || 0;
        const marginX = mobile ? 72 : root ? 80 : 0;
        const marginY = mobile ? 180 : root ? 40 : 220;
        const visible =
          rect.bottom >= -marginY &&
          rect.top <= vh + marginY &&
          rect.right >= -marginX &&
          rect.left <= vw + marginX &&
          rect.width > 0 &&
          rect.height > 0;
        if (visible) {
          setNearViewport(true);
          observer.disconnect();
          return true;
        }
      } catch {
        // Ignore measurement errors.
      }
      return false;
    };

    // Immediate sync check — IO callbacks can lag on iOS after layout/swipe.
    markVisibleIfInRange();

    // Mobile: overflow-x swipe may not deliver IO promptly — re-check on scroll.
    let scrollParent: Element | null = null;
    let onScroll: (() => void) | null = null;
    if (mobile) {
      scrollParent = target.closest(".h-scroll-scroller, .discovery-rail");
      if (scrollParent) {
        onScroll = () => {
          if (markVisibleIfInRange() && onScroll && scrollParent) {
            scrollParent.removeEventListener("scroll", onScroll);
          }
        };
        scrollParent.addEventListener("scroll", onScroll, { passive: true });
      }
    }

    return () => {
      observer.disconnect();
      if (scrollParent && onScroll) {
        scrollParent.removeEventListener("scroll", onScroll);
      }
    };
  }, [
    cacheBoost,
    candidateKey,
    nearViewport,
    observeRoot,
    priority,
    retryToken,
    srcIndex,
    suspend,
    visibilityEpoch,
  ]);

  // Acquire a concurrency slot once near viewport (skip if session-cached).
  useEffect(() => {
    if (!nearReady || failed || !displaySrc) return;
    if (cacheBoost || isImageUrlCached(displaySrc)) {
      setSlotReady(true);
      return;
    }
    if (slotReady || releaseSlotRef.current) return;

    const mobile = isMobileViewport();
    // Visible / near-viewport mobile cards jump ahead of off-screen waits.
    const preferPriority = priority || (mobile && nearViewport);
    const lease = acquireImageLoadSlot(preferPriority);
    let cancelled = false;

    void lease.promise.then((release) => {
      if (cancelled) {
        release();
        return;
      }
      releaseSlotRef.current = release;
      setSlotReady(true);
    });

    return () => {
      cancelled = true;
      lease.cancel();
      releaseSlotRef.current = null;
      setSlotReady(false);
    };
  }, [
    nearReady,
    failed,
    displaySrc,
    cacheBoost,
    slotReady,
    priority,
    nearViewport,
    retryToken,
    srcIndex,
  ]);

  const failExhausted = useCallback(() => {
    clearSoftRetryTimer();
    releaseSlot();
    if (displaySrc) markImageUrlFailed(displaySrc);
    setFailed(true);
    setLoaded(false);
    if (!loggedRef.current) {
      loggedRef.current = true;
      trackBrokenImage(validation.normalized || src, analyticsContext);
    }
  }, [
    analyticsContext,
    clearSoftRetryTimer,
    displaySrc,
    releaseSlot,
    src,
    validation.normalized,
  ]);

  const softRetryOrAdvance = useCallback(() => {
    abortImageElementLoad(imgRef.current);
    clearSoftRetryTimer();

    if (softRetryCountRef.current < MAX_SOFT_RETRIES) {
      softRetryCountRef.current += 1;
      setLoaded(false);
      // Release slot during backoff so other visible images can load.
      if (releaseSlotRef.current) {
        releaseSlotRef.current();
        releaseSlotRef.current = null;
      }
      setSlotReady(false);
      const delay =
        SOFT_RETRY_BACKOFF_MS[
          Math.min(
            softRetryCountRef.current - 1,
            SOFT_RETRY_BACKOFF_MS.length - 1
          )
        ] ?? 1600;
      softRetryTimerRef.current = window.setTimeout(() => {
        softRetryTimerRef.current = null;
        setRetryToken((token) => token + 1);
      }, delay);
      return;
    }

    setSrcIndex((currentIndex) => {
      const list = candidatesRef.current;
      const nextIndex = currentIndex + 1;
      if (nextIndex < list.length) {
        softRetryCountRef.current = 0;
        if (releaseSlotRef.current) {
          releaseSlotRef.current();
          releaseSlotRef.current = null;
        }
        setSlotReady(false);
        setRetryToken(0);
        setLoaded(isImageUrlCached(list[nextIndex] ?? ""));
        return nextIndex;
      }
      failExhausted();
      return currentIndex;
    });
  }, [clearSoftRetryTimer, failExhausted]);

  const confirmLoaded = useCallback(
    (img: HTMLImageElement, url: string) => {
      if (!hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)) {
        softRetryOrAdvance();
        return;
      }
      clearSoftRetryTimer();
      rememberLoadedImageUrl(url);
      setLoaded(true);
      setCacheBoost(true);
      // Free the slot once bytes are in — browser cache handles revisits.
      if (releaseSlotRef.current) {
        releaseSlotRef.current();
        releaseSlotRef.current = null;
      }
    },
    [clearSoftRetryTimer, softRetryOrAdvance]
  );

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (failed || !displaySrc || !allowFetch) return;

    if (isImageUrlCached(displaySrc)) {
      setLoaded(true);
      setCacheBoost(true);
      return;
    }

    if (img && isImageElementCached(img)) {
      confirmLoaded(img, displaySrc);
    }
  }, [allowFetch, confirmLoaded, displaySrc, failed, retryToken, srcIndex]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || failed || !displaySrc || !allowFetch || loaded) return;

    const tryConfirm = () => {
      if (img.complete && img.naturalWidth > 0) {
        confirmLoaded(img, displaySrc);
        return true;
      }
      return false;
    };

    if (tryConfirm()) return;

    let cancelled = false;
    void img
      .decode?.()
      .then(() => {
        if (!cancelled) tryConfirm();
      })
      .catch(() => {
        if (!cancelled && img.complete && img.naturalWidth > 0) {
          rememberLoadedImageUrl(displaySrc);
          setLoaded(true);
          setCacheBoost(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [allowFetch, confirmLoaded, displaySrc, failed, loaded, retryToken, srcIndex]);

  useEffect(() => {
    if (!allowFetch || failed || !displaySrc || loaded) return;

    const timeoutMs = isMobileViewport()
      ? MOBILE_IMAGE_LOAD_TIMEOUT_MS
      : IMAGE_LOAD_TIMEOUT_MS;

    const timer = window.setTimeout(() => {
      softRetryOrAdvance();
    }, timeoutMs);

    return () => window.clearTimeout(timer);
  }, [
    allowFetch,
    displaySrc,
    failed,
    loaded,
    retryToken,
    softRetryOrAdvance,
    srcIndex,
  ]);

  /**
   * Authority for when to fetch is our IntersectionObserver + queue gate.
   * Never also apply native loading="lazy" after we attach src — Safari iOS
   * often never starts lazy images inside overflow-x rails.
   */
  const shouldLazyLoad = false;
  const fetchPriority: "high" | "low" | "auto" = priority
    ? "high"
    : cacheBoost || loaded
      ? "auto"
      : nearViewport
        ? "auto"
        : "low";
  const decoding: "sync" | "async" = priority ? "sync" : "async";

  const hasCandidate = Boolean(displaySrc);

  return {
    imgRef,
    /** Empty until near viewport + concurrency slot (unless cached). */
    displaySrc: allowFetch ? displaySrc : "",
    failed: failed || !hasCandidate,
    loaded,
    imgKey: `${displaySrc}::${retryToken}::${allowFetch ? "on" : "off"}`,
    shouldLazyLoad,
    fetchPriority,
    decoding,
    confirmLoaded,
    softRetryOrAdvance,
    validation,
  };
}
