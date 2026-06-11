"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackBrokenImage } from "@/lib/analytics-events";
import { getProcessedImageSrc } from "@/lib/processed-images";
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
  const validation = useMemo(() => validateImageUrl(src), [src]);
  const { displaySrc, isCutout } = useMemo(() => {
    if (!validation.valid) {
      return { displaySrc: "", isCutout: false };
    }
    const resolved = getProcessedImageSrc(validation.normalized);
    return { displaySrc: resolved.src, isCutout: resolved.isCutout };
  }, [validation.normalized, validation.valid]);

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

  if (renderFailed || !validation.valid || !displaySrc) {
    return (
      <ImageUnavailablePlaceholder
        className={className}
        variant={variant}
        loading={false}
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
          src={displaySrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          referrerPolicy="no-referrer"
          className={`product-float-asset ${
            isCutout ? "product-float-asset--cutout" : ""
          } ${visible ? "" : "product-float-asset--hidden"}`}
          onLoad={handleLoad}
          onError={markFailed}
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
