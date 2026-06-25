"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackBrokenImage } from "@/lib/analytics-events";
import {
  getImageFillClass,
  shouldEnhanceImage,
} from "@/lib/image-quality";
import { getProductImagePlan } from "@/lib/processed-images";
import {
  hasPlausibleImageDimensions,
  validateImageUrl,
} from "@/lib/image-url";
import ImageUnavailablePlaceholder from "./ImageUnavailablePlaceholder";

type ProductImageVariant = "card" | "featured" | "hero";

type ProductImageProps = {
  src: string;
  alt: string;
  productName?: string;
  className?: string;
  priority?: boolean;
  variant?: ProductImageVariant;
  productHref?: string;
  preferredSrc?: string;
  fallbacks?: string[];
  fillClass?: string;
  needsMatte?: boolean;
  enhance?: boolean;
};

function buildCandidateList(
  src: string,
  preferredSrc?: string,
  extraFallbacks: string[] = []
): string[] {
  const validation = validateImageUrl(src);
  if (!validation.valid) return [];

  const plan = getProductImagePlan(validation.normalized);
  const ordered = [
    preferredSrc,
    plan.src,
    ...extraFallbacks,
    ...plan.fallbacks,
    plan.originalSrc,
  ].filter(Boolean) as string[];

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const url of ordered) {
    if (seen.has(url)) continue;
    seen.add(url);
    unique.push(url);
  }
  return unique;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  variant = "card",
  productHref,
  preferredSrc,
  fallbacks = [],
  fillClass,
  enhance,
}: ProductImageProps) {
  const validation = useMemo(() => validateImageUrl(src), [src]);

  const candidates = useMemo(
    () => buildCandidateList(src, preferredSrc, fallbacks),
    [src, preferredSrc, fallbacks]
  );
  const candidateKey = candidates.join("|");

  const resolvedFillClass =
    fillClass ??
    (validation.valid
      ? getImageFillClass(validation.normalized)
      : "product-float-asset--fill-balanced");
  const resolvedEnhance =
    enhance ?? (validation.valid ? shouldEnhanceImage(validation.normalized) : false);

  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(candidates.length === 0);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const loggedRef = useRef(false);

  const displaySrc = candidates[srcIndex] ?? "";

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
      trackBrokenImage(validation.normalized || src, variant);
    }
  }, [src, validation.normalized, variant]);

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
      if (!hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)) {
        advanceOrFail();
        return;
      }
      setLoaded(true);
    },
    [advanceOrFail]
  );

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      confirmLoaded(event.currentTarget);
    },
    [confirmLoaded]
  );

  const handleError = useCallback(() => {
    advanceOrFail();
  }, [advanceOrFail]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || failed || !displaySrc) return;
    if (img.complete && img.naturalWidth > 0) {
      confirmLoaded(img);
    }
  }, [confirmLoaded, displaySrc, failed, srcIndex]);

  if (failed || !displaySrc) {
    return (
      <ImageUnavailablePlaceholder
        className={className}
        variant={variant}
        productHref={productHref}
      />
    );
  }

  const assetClass = [
    "product-float-asset",
    resolvedFillClass,
    resolvedEnhance ? "product-float-asset--enhanced" : "",
    loaded ? "product-float-asset--ready" : "product-float-asset--loading",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`product-float-stage product-float-stage--${variant} ${className}`}
    >
      {variant !== "card" ? <div className="product-float-glow" aria-hidden /> : null}
      <div className="product-float-matte product-float-matte--opaque">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          key={displaySrc}
          src={displaySrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          referrerPolicy="no-referrer"
          className={assetClass}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
      {!loaded ? (
        <ImageUnavailablePlaceholder
          variant={variant}
          loading
          productHref={productHref}
        />
      ) : null}
    </div>
  );
}
