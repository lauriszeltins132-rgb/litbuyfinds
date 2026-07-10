"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackBrokenImage } from "@/lib/analytics-events";
import { validateImageUrl } from "@/lib/image-url";
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
  isProcessedCutout?: boolean;
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
  isProcessedCutout = false,
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
  const showingProcessed =
    isProcessedCutout || displaySrc.startsWith("/processed/");

  useEffect(() => {
    setSrcIndex(0);
    setFailed(candidates.length === 0);
    setLoaded(false);
    loggedRef.current = false;
  }, [candidateKey, candidates.length]);

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
      if (currentIndex + 1 < candidates.length) {
        setLoaded(false);
        return currentIndex + 1;
      }
      failExhausted();
      return currentIndex;
    });
  }, [candidates.length, failExhausted]);

  const confirmLoaded = useCallback(
    (img: HTMLImageElement) => {
      if (img.naturalWidth <= 0 || img.naturalHeight <= 0) {
        advanceOrFail();
        return;
      }
      setLoaded(true);
    },
    [advanceOrFail]
  );

  useEffect(() => {
    const img = imgRef.current;
    if (!img || failed || !displaySrc) return;

    const tryConfirm = () => {
      if (img.complete && img.naturalWidth > 0) {
        confirmLoaded(img);
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
        setLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [confirmLoaded, displaySrc, failed, srcIndex]);

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
    showingProcessed ? "product-float-asset--processed-cutout" : "",
    loaded ? "product-float-asset--ready" : "product-float-asset--loading",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`product-float-stage product-float-stage--card ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        key={displaySrc}
        src={displaySrc}
        alt={alt}
        width={400}
        height={400}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        referrerPolicy="no-referrer"
        className={assetClass}
        onLoad={(event) => confirmLoaded(event.currentTarget)}
        onError={advanceOrFail}
      />
    </div>
  );
}
