"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useProcessedImage } from "@/hooks/useProcessedImage";
import { trackBrokenImage } from "@/lib/analytics-events";
import {
  hasPlausibleImageDimensions,
  validateImageUrl,
} from "@/lib/image-url";
import ImageUnavailablePlaceholder from "./ImageUnavailablePlaceholder";

type ProductImageVariant = "card" | "featured" | "hero";

type ProductImageProps = {
  src: string;
  alt: string;
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
  const validation = validateImageUrl(src);
  const {
    displaySrc,
    failed,
    loading,
    ready,
    needsDarkMatte,
    needsVignette,
    processedToPng,
  } = useProcessedImage(src);
  const [renderFailed, setRenderFailed] = useState(!validation.valid);
  const [visible, setVisible] = useState(false);
  const loggedRef = useRef(false);

  useEffect(() => {
    setRenderFailed(!validation.valid);
    setVisible(false);
    loggedRef.current = false;
  }, [validation.normalized, validation.valid]);

  const markFailed = useCallback(() => {
    setRenderFailed(true);
    setVisible(false);
    if (!loggedRef.current) {
      loggedRef.current = true;
      trackBrokenImage(validation.normalized || src, variant);
    }
  }, [src, validation.normalized, variant]);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      if (!hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)) {
        markFailed();
        return;
      }
      setVisible(true);
    },
    [markFailed]
  );

  const showPlaceholder = renderFailed || failed || !ready || !displaySrc;

  if (showPlaceholder) {
    return (
      <ImageUnavailablePlaceholder
        className={className}
        variant={variant}
        loading={!renderFailed && !failed && loading}
        productHref={productHref}
      />
    );
  }

  const assetClass = needsDarkMatte
    ? "product-float-asset product-float-asset--matte"
    : needsVignette
      ? "product-float-asset product-float-asset--vignette"
      : processedToPng
        ? "product-float-asset product-float-asset--processed"
        : "product-float-asset";

  const stageClass = needsVignette
    ? `product-float-stage product-float-stage--vignette product-float-stage--${variant}`
    : `product-float-stage product-float-stage--${variant}`;

  const matteClass = needsDarkMatte
    ? "product-float-matte product-float-matte--active"
    : needsVignette
      ? "product-float-matte product-float-matte--vignette"
      : "product-float-matte";

  return (
    <div className={`${stageClass} ${className}`}>
      <div className="product-float-glow" aria-hidden />
      <div className={matteClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displaySrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          referrerPolicy="no-referrer"
          className={`${assetClass} ${visible ? "" : "product-float-asset--hidden"}`}
          onLoad={handleLoad}
          onError={markFailed}
        />
      </div>
      {needsVignette ? (
        <div className="product-float-vignette-mask" aria-hidden />
      ) : null}
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
