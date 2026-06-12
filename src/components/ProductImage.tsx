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
};

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  variant = "card",
  productHref,
}: ProductImageProps) {
  const validation = useMemo(() => validateImageUrl(src), [src]);
  const plan = useMemo(() => {
    if (!validation.valid) return null;
    return getProductImagePlan(validation.normalized);
  }, [validation.normalized, validation.valid]);

  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(!validation.valid || !plan);
  const [visible, setVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const loggedRef = useRef(false);

  const candidates = useMemo(() => {
    if (!plan) return [];
    if (plan.isProcessed && plan.src !== plan.originalSrc) {
      return [plan.src, plan.originalSrc];
    }
    return [plan.src];
  }, [plan]);

  const displaySrc = candidates[srcIndex] ?? "";

  useEffect(() => {
    setSrcIndex(0);
    setFailed(!validation.valid || !plan);
    setVisible(false);
    loggedRef.current = false;
  }, [validation.valid, plan, validation.normalized]);

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

  if (failed || !plan || !displaySrc) {
    return (
      <ImageUnavailablePlaceholder
        className={className}
        variant={variant}
        productHref={productHref}
      />
    );
  }

  return (
    <div
      className={`product-float-stage product-float-stage--${variant} ${className}`}
    >
      {variant !== "card" ? <div className="product-float-glow" aria-hidden /> : null}
      <div className="product-float-matte">
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
          className={`product-float-asset ${
            visible ? "" : "product-float-asset--hidden"
          }`}
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
