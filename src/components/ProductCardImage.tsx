"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { trackBrokenImage } from "@/lib/analytics-events";
import {
  hasPlausibleImageDimensions,
  validateImageUrl,
} from "@/lib/image-url";
import { IMAGE_LOAD_TIMEOUT_MS } from "@/lib/image-load-timeout";
import {
  isImageUrlCached,
  rememberLoadedImageUrl,
} from "@/lib/image-load-cache";
import ImageUnavailablePlaceholder from "./ImageUnavailablePlaceholder";

type ProductCardImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  productHref?: string;
  preferredSrc?: string;
  fallbacks?: string[];
  fillClass?: string;
};

export default function ProductCardImage({
  src,
  alt,
  className = "",
  priority = false,
  productHref,
  preferredSrc,
  fallbacks = [],
  fillClass = "product-float-asset--fill-balanced",
}: ProductCardImageProps) {
  const validation = useMemo(() => validateImageUrl(src), [src]);

  const candidates = useMemo(() => {
    if (!validation.valid) return [];
    const ordered = [
      preferredSrc,
      validation.normalized,
      ...fallbacks,
    ].filter((url): url is string => Boolean(url));
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const url of ordered) {
      if (seen.has(url)) continue;
      seen.add(url);
      unique.push(url);
    }
    return unique;
  }, [validation, preferredSrc, fallbacks]);

  const candidateKey = candidates.join("|");
  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(candidates.length === 0);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const loggedRef = useRef(false);

  const displaySrc = candidates[srcIndex] ?? "";
  const wasCachedOnMount = useMemo(
    () => isImageUrlCached(displaySrc),
    [displaySrc]
  );

  useEffect(() => {
    const firstSrc = candidates[0] ?? "";
    const cached = isImageUrlCached(firstSrc);
    setSrcIndex(0);
    setFailed(candidates.length === 0);
    setLoaded(cached);
    loggedRef.current = false;
  }, [candidateKey, candidates]);

  const failExhausted = useCallback(() => {
    setFailed(true);
    setLoaded(false);
    if (!loggedRef.current) {
      loggedRef.current = true;
      trackBrokenImage(validation.normalized || src, "card");
    }
  }, [src, validation.normalized]);

  const advanceOrFail = useCallback(() => {
    setSrcIndex((currentIndex) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < candidates.length) {
        const nextSrc = candidates[nextIndex] ?? "";
        setLoaded(isImageUrlCached(nextSrc));
        return nextIndex;
      }
      failExhausted();
      return currentIndex;
    });
  }, [candidates, failExhausted]);

  const confirmLoaded = useCallback(
    (img: HTMLImageElement, url: string) => {
      if (!hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)) {
        advanceOrFail();
        return;
      }
      rememberLoadedImageUrl(url);
      setLoaded(true);
    },
    [advanceOrFail]
  );

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (failed || !displaySrc) return;

    if (isImageUrlCached(displaySrc)) {
      setLoaded(true);
      return;
    }

    if (img?.complete && img.naturalWidth > 0) {
      confirmLoaded(img, displaySrc);
    }
  }, [confirmLoaded, displaySrc, failed, srcIndex]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || failed || !displaySrc || loaded) return;

    const tryConfirm = () => {
      if (img.complete && img.naturalWidth > 0) {
        confirmLoaded(img, displaySrc);
        return true;
      }
      return false;
    };

    if (tryConfirm()) return;

    let cancelled = false;
    void img.decode?.().then(() => {
      if (!cancelled) tryConfirm();
    }).catch(() => {
      if (!cancelled && img.complete && img.naturalWidth > 0) {
        rememberLoadedImageUrl(displaySrc);
        setLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [confirmLoaded, displaySrc, failed, loaded, srcIndex]);

  useEffect(() => {
    if (failed || !displaySrc || loaded) return;

    const timer = window.setTimeout(() => {
      advanceOrFail();
    }, IMAGE_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [advanceOrFail, displaySrc, failed, loaded, srcIndex]);

  if (failed || !displaySrc) {
    return (
      <ImageUnavailablePlaceholder
        className={className}
        variant="card"
        productHref={productHref}
      />
    );
  }

  const assetClass = [
    "product-float-asset",
    fillClass,
    loaded ? "product-float-asset--ready" : "product-float-asset--loading",
  ]
    .filter(Boolean)
    .join(" ");

  const shouldLazyLoad = !priority && !wasCachedOnMount && !loaded;

  return (
    <div
      className={`product-float-stage product-float-stage--card relative ${className}`}
    >
      {!loaded ? (
        <div
          className="product-card-image-skeleton skeleton absolute inset-0 z-0 rounded-[inherit]"
          aria-hidden
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        key={displaySrc}
        src={displaySrc}
        alt={alt}
        width={400}
        height={400}
        loading={shouldLazyLoad ? "lazy" : "eager"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        referrerPolicy="no-referrer"
        className={`${assetClass} relative z-[1]`}
        onLoad={(event) => confirmLoaded(event.currentTarget, displaySrc)}
        onError={advanceOrFail}
      />
    </div>
  );
}
