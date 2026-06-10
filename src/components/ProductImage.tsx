"use client";

import { useCallback, useEffect, useState } from "react";
import { useProcessedImage } from "@/hooks/useProcessedImage";
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
};

const VARIANT_CAP: Record<ProductImageVariant, number> = {
  card: 320,
  featured: 460,
  hero: 520,
};

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  variant = "card",
}: ProductImageProps) {
  const validation = validateImageUrl(src);
  const { displaySrc, failed, loading, ready } = useProcessedImage(src);
  const [renderFailed, setRenderFailed] = useState(!validation.valid);
  const [visible, setVisible] = useState(false);
  const [safeMax, setSafeMax] = useState<number | null>(null);

  useEffect(() => {
    setRenderFailed(!validation.valid);
    setVisible(false);
    setSafeMax(null);
  }, [validation.normalized, validation.valid]);

  const markFailed = useCallback(() => {
    setRenderFailed(true);
    setVisible(false);
  }, []);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      const natural = Math.max(img.naturalWidth, img.naturalHeight);

      if (!hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)) {
        markFailed();
        return;
      }

      setVisible(true);

      const cap = VARIANT_CAP[variant];
      if (natural < 380) {
        const upscale = natural < 220 ? 1.05 : natural < 300 ? 1.12 : 1.18;
        setSafeMax(Math.min(Math.round(natural * upscale), cap));
      }
    },
    [markFailed, variant]
  );

  const showPlaceholder = renderFailed || failed || !ready || !displaySrc;

  if (showPlaceholder) {
    return (
      <ImageUnavailablePlaceholder
        className={className}
        variant={variant}
        loading={!renderFailed && !failed && loading}
      />
    );
  }

  const assetClass = displaySrc.startsWith("data:")
    ? "product-float-asset product-float-asset--fallback"
    : "product-float-asset";

  return (
    <div
      className={`product-float-stage product-float-stage--${variant} ${className}`}
    >
      <div className="product-float-glow" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displaySrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        referrerPolicy="no-referrer"
        className={`${assetClass} ${visible ? "" : "product-float-asset--hidden"}`}
        style={
          visible && safeMax
            ? { maxWidth: safeMax, maxHeight: safeMax }
            : undefined
        }
        onLoad={handleLoad}
        onError={markFailed}
      />
      {!visible && (
        <ImageUnavailablePlaceholder variant={variant} loading />
      )}
    </div>
  );
}
