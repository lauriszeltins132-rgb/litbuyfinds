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

/**
 * Transient network/timeout failures: original attempt + up to 2 soft retries
 * (3 total) before advancing candidates / showing the existing fallback.
 */
const MAX_SOFT_RETRIES = 2;

/** Backoff between soft retries (ms). */
const SOFT_RETRY_BACKOFF_MS = [700, 1600] as const;

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

  const imgRef = useRef<HTMLImageElement>(null);
  const loggedRef = useRef(false);
  const softRetryCountRef = useRef(0);
  const softRetryTimerRef = useRef<number | null>(null);
  const releaseSlotRef = useRef<(() => void) | null>(null);

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

  useEffect(() => {
    if (suspend || priority || cacheBoost || nearViewport) return;

    const node = imgRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        observer.disconnect();
      },
      {
        root: observeRoot ?? null,
        rootMargin: observeRoot ? "40px 80px" : VIEWPORT_ROOT_MARGIN,
        threshold: 0.01,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [
    cacheBoost,
    candidateKey,
    nearViewport,
    observeRoot,
    priority,
    retryToken,
    srcIndex,
    suspend,
  ]);

  // Acquire a concurrency slot once near viewport (skip if session-cached).
  useEffect(() => {
    if (!nearReady || failed || !displaySrc) return;
    if (cacheBoost || isImageUrlCached(displaySrc)) {
      setSlotReady(true);
      return;
    }
    if (slotReady || releaseSlotRef.current) return;

    let cancelled = false;
    void acquireImageLoadSlot(priority).then((release) => {
      if (cancelled) {
        release();
        return;
      }
      releaseSlotRef.current = release;
      setSlotReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [
    nearReady,
    failed,
    displaySrc,
    cacheBoost,
    slotReady,
    priority,
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

    const timer = window.setTimeout(() => {
      softRetryOrAdvance();
    }, IMAGE_LOAD_TIMEOUT_MS);

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

  const shouldLazyLoad = !priority && !cacheBoost && !loaded;
  const fetchPriority: "high" | "low" | "auto" = priority
    ? "high"
    : cacheBoost || loaded
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
