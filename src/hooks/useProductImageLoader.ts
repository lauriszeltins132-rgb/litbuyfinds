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

/** Start fetching when the image is this close to the viewport. */
const VIEWPORT_ROOT_MARGIN = "280px 0px";

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
 * one soft retry on transient failure/timeout, hung-request abort, and
 * hydration-safe eager/lazy decisions.
 * Does not alter image URLs, dimensions, or visual presentation.
 */
export function useProductImageLoader({
  src,
  preferredSrc,
  fallbacks = [],
  priority = false,
  analyticsContext,
}: UseProductImageLoaderArgs) {
  const validation = useMemo(() => validateImageUrl(src), [src]);

  const candidates = useMemo(
    () => buildCandidates(src, preferredSrc, fallbacks),
    [src, preferredSrc, fallbacks]
  );
  const candidateKey = candidates.join("|");

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
  const retriedRef = useRef(false);

  const displaySrc = candidates[srcIndex] ?? "";
  const allowFetch = priority || nearViewport || cacheBoost;

  useEffect(() => {
    const firstSrc = candidates[0] ?? "";
    const cached = isImageUrlCached(firstSrc);
    setSrcIndex(0);
    setRetryToken(0);
    setFailed(candidates.length === 0);
    setLoaded(cached);
    setCacheBoost(cached);
    setNearViewport(priority || cached);
    loggedRef.current = false;
    retriedRef.current = false;
  }, [candidateKey, candidates, priority]);

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
    if (displaySrc) markImageUrlFailed(displaySrc);
    setFailed(true);
    setLoaded(false);
    if (!loggedRef.current) {
      loggedRef.current = true;
      trackBrokenImage(validation.normalized || src, analyticsContext);
    }
  }, [analyticsContext, displaySrc, src, validation.normalized]);

  const softRetryOrAdvance = useCallback(() => {
    abortImageElementLoad(imgRef.current);

    if (!retriedRef.current) {
      retriedRef.current = true;
      setLoaded(false);
      setRetryToken((token) => token + 1);
      return;
    }

    setSrcIndex((currentIndex) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < candidates.length) {
        if (displaySrc) markImageUrlFailed(displaySrc);
        const nextSrc = candidates[nextIndex] ?? "";
        retriedRef.current = false;
        setRetryToken(0);
        setLoaded(isImageUrlCached(nextSrc));
        return nextIndex;
      }
      failExhausted();
      return currentIndex;
    });
  }, [candidates, displaySrc, failExhausted]);

  const confirmLoaded = useCallback(
    (img: HTMLImageElement, url: string) => {
      if (!hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)) {
        softRetryOrAdvance();
        return;
      }
      rememberLoadedImageUrl(url);
      setLoaded(true);
      setCacheBoost(true);
    },
    [softRetryOrAdvance]
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

  return {
    imgRef,
    /** Empty until near viewport (unless priority/cached) — defers network. */
    displaySrc: allowFetch ? displaySrc : "",
    failed: failed || !displaySrc,
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
