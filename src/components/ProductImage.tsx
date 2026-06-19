"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackBrokenImage } from "@/lib/analytics-events";
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

function isLocalProcessedPath(src: string): boolean {
  return src.startsWith("/processed/") || src.startsWith("/api/processed-image");
}

function buildCandidateList(
  src: string,
  preferredSrc?: string,
  fallbacks: string[] = []
): string[] {
  const validation = validateImageUrl(src);
  const plan = validation.valid ? getProductImagePlan(validation.normalized) : null;
  const ordered = [
    preferredSrc,
    plan?.src,
    validation.valid ? validation.normalized : "",
    plan?.originalSrc,
    ...fallbacks,
    src,
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
  fillClass = "product-float-asset--fill-balanced",
  needsMatte = false,
  enhance = false,
}: ProductImageProps) {
  const validation = useMemo(() => validateImageUrl(src), [src]);

  const candidates = useMemo(
    () => buildCandidateList(src, preferredSrc, fallbacks),
    [src, preferredSrc, fallbacks]
  );

  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(candidates.length === 0);
  const [visible, setVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const loggedRef = useRef(false);

  const displaySrc = candidates[srcIndex] ?? "";
  const useMatte = needsMatte && !isLocalProcessedPath(displaySrc);

  useEffect(() => {
    setSrcIndex(0);
    setFailed(candidates.length === 0);
    setVisible(false);
    loggedRef.current = false;
  }, [candidates, validation.normalized]);

  const confirmLoaded = useCallback(
    (img: HTMLImageElement) => {
      if (!hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)) {
        if (srcIndex + 1 < candidates.length) {
          setSrcIndex((i) => i + 1);
          setVisible(false);
          return;
        }
        setFailed(true);
        setVisible(false);
        if (!loggedRef.current) {
          loggedRef.current = true;
          trackBrokenImage(validation.normalized || src, variant);
        }
        return;
      }
      setVisible(true);
    },
    [candidates.length, src, srcIndex, validation.normalized, variant]
  );

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      confirmLoaded(event.currentTarget);
    },
    [confirmLoaded]
  );

  const handleError = useCallback(() => {
    if (srcIndex + 1 < candidates.length) {
      setSrcIndex((i) => i + 1);
      setVisible(false);
      return;
    }
    setFailed(true);
    setVisible(false);
    if (!loggedRef.current) {
      loggedRef.current = true;
      trackBrokenImage(validation.normalized || src, variant);
    }
  }, [candidates.length, src, srcIndex, validation.normalized, variant]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || failed || !displaySrc) return;
    if (img.complete && img.naturalWidth > 0) {
      confirmLoaded(img);
    }
  }, [confirmLoaded, displaySrc, failed]);

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
    fillClass,
    enhance ? "product-float-asset--enhanced" : "",
    visible ? "" : "product-float-asset--hidden",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`product-float-stage product-float-stage--${variant} ${className}`}
    >
      {variant !== "card" ? <div className="product-float-glow" aria-hidden /> : null}
      <div
        className={`product-float-matte ${
          useMatte ? "product-float-matte--transparent" : ""
        }`}
      >
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
      {!visible && (
        <ImageUnavailablePlaceholder
          variant={variant}
          loading
          productHref={productHref}
        />
      )}
    </div>
  );
}
