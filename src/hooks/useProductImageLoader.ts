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
};

/** Stable empty list — never use a fresh `[]` default (it remounts loaders). */
export const EMPTY_IMAGE_FALLBACKS: string[] = [];

/** Start fetching when the image is this close to the viewport. */
const VIEWPORT_ROOT_MARGIN = "600px 0px";
/**
 * Transient network/timeout failures: original attempt + up to 2 soft retries
 * (3 total) before advancing candidates / showing the existing fallback.
 */
const MAX_SOFT_RETRIES = 2;
/** Short backoff between soft retries to avoid hammering remote hosts. */
const SOFT_RETRY_DELAY_MS = 350;

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
 * Shared product-image loader: session cache, near-viewport fetch gating,
 * soft retries with short delay, hung-request abort, and hydration-safe
 * eager/lazy decisions.
 * Does not alter image URLs, dimensions, or visual presentation.
 */
export function useProductImageLoader({
  src,
  preferredSrc,
  fallbacks = EMPTY_IMAGE_FALLBACKS,
  priority = false,
  analyticsContext,
}: UseProductImageLoaderArgs) {
  const validation = useMemo(() => validateImageUrl(src), [src]);

  // Depend on fallback *contents*, not array identity (avoids remount on
  // parent re-renders that pass a fresh empty array).
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
  /** Client-only: avoid SSR/client mismatch for cache-driven loading attrs. */
  const [cacheBoost, setCacheBoost] = useState(false);
  /**
   * Non-priority images wait until near the viewport before attaching src.
   * Priority / session-cached images fetch immediately.
   */
  const [nearViewport, setNearViewport] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const loggedRef = useRef(false);
  const softRetryCountRef = useRef(0);
  const softRetryTimerRef = useRef<number | null>(null);

  const displaySrc = candidates[srcIndex] ?? "";
  const allowFetch = priority || nearViewport || cacheBoost;

  const clearSoftRetryTimer = useCallback(() => {
    if (softRetryTimerRef.current != null) {
      window.clearTimeout(softRetryTimerRef.current);
      softRetryTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const firstSrc = candidatesRef.current[0] ?? "";
    const cached = isImageUrlCached(firstSrc);
    clearSoftRetryTimer();
    setSrcIndex(0);
    setRetryToken(0);
    setFailed(candidatesRef.current.length === 0);
    setLoaded(cached);
    setCacheBoost(cached);
    setNearViewport(priority || cached);
    loggedRef.current = false;
    softRetryCountRef.current = 0;
  }, [candidateKey, priority, clearSoftRetryTimer]);

  useEffect(() => () => clearSoftRetryTimer(), [clearSoftRetryTimer]);

  useEffect(() => {
    if (priority || cacheBoost || nearViewport) return;

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
      { rootMargin: VIEWPORT_ROOT_MARGIN, threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [cacheBoost, candidateKey, nearViewport, priority, retryToken, srcIndex]);

  const failExhausted = useCallback(() => {
    clearSoftRetryTimer();
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
    src,
    validation.normalized,
  ]);

  const softRetryOrAdvance = useCallback(() => {
    abortImageElementLoad(imgRef.current);
    clearSoftRetryTimer();

    if (softRetryCountRef.current < MAX_SOFT_RETRIES) {
      softRetryCountRef.current += 1;
      setLoaded(false);
      softRetryTimerRef.current = window.setTimeout(() => {
        softRetryTimerRef.current = null;
        setRetryToken((token) => token + 1);
      }, SOFT_RETRY_DELAY_MS * softRetryCountRef.current);
      return;
    }

    setSrcIndex((currentIndex) => {
      const list = candidatesRef.current;
      const nextIndex = currentIndex + 1;
      if (nextIndex < list.length) {
        // Do not session-blacklist on soft timeout — only failExhausted does.
        softRetryCountRef.current = 0;
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

  // Only treat as failed when we have no usable candidate — never while gated.
  const hasCandidate = Boolean(displaySrc);

  return {
    imgRef,
    /** Empty until near viewport (unless priority/cached) — defers network. */
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
