"use client";

import { useCallback } from "react";
import { getImageFillClass } from "@/lib/image-quality";
import { validateImageUrl } from "@/lib/image-url";
import { useProductImageLoader } from "@/hooks/useProductImageLoader";
import ImageUnavailablePlaceholder from "./ImageUnavailablePlaceholder";

type ProductImageVariant = "card" | "featured" | "hero";

const IMAGE_LAYOUT: Record<
  ProductImageVariant,
  { width: number; height: number }
> = {
  card: { width: 400, height: 400 },
  featured: { width: 540, height: 500 },
  hero: { width: 600, height: 560 },
};

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
};

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
}: ProductImageProps) {
  const validation = validateImageUrl(src);
  const resolvedFillClass =
    fillClass ??
    (validation.valid
      ? getImageFillClass(validation.normalized)
      : "product-float-asset--fill-balanced");

  const {
    imgRef,
    displaySrc,
    failed,
    loaded,
    imgKey,
    shouldLazyLoad,
    fetchPriority,
    decoding,
    confirmLoaded,
    softRetryOrAdvance,
  } = useProductImageLoader({
    src,
    preferredSrc,
    fallbacks,
    priority,
    analyticsContext: variant,
  });

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      confirmLoaded(event.currentTarget, displaySrc);
    },
    [confirmLoaded, displaySrc]
  );

  if (failed) {
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
    loaded ? "product-float-asset--ready" : "product-float-asset--loading",
  ]
    .filter(Boolean)
    .join(" ");

  const imageNode = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      ref={imgRef}
      key={imgKey}
      src={displaySrc}
      alt={alt}
      width={IMAGE_LAYOUT[variant].width}
      height={IMAGE_LAYOUT[variant].height}
      loading={shouldLazyLoad ? "lazy" : "eager"}
      fetchPriority={fetchPriority}
      decoding={decoding}
      referrerPolicy="no-referrer"
      className={assetClass}
      onLoad={handleLoad}
      onError={softRetryOrAdvance}
    />
  );

  return (
    <div
      className={`product-float-stage product-float-stage--${variant} ${className}`}
    >
      {variant === "card" ? (
        imageNode
      ) : (
        <div className="product-float-matte product-float-matte--opaque">{imageNode}</div>
      )}
      {!loaded && variant !== "card" ? (
        <ImageUnavailablePlaceholder
          variant={variant}
          loading
          productHref={productHref}
        />
      ) : null}
    </div>
  );
}
