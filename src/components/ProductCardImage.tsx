"use client";

import { useProductImageLoader } from "@/hooks/useProductImageLoader";
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
    analyticsContext: "card",
  });

  if (failed) {
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
        key={imgKey}
        src={displaySrc || undefined}
        alt={alt}
        width={400}
        height={400}
        loading={shouldLazyLoad ? "lazy" : "eager"}
        fetchPriority={fetchPriority}
        decoding={decoding}
        referrerPolicy="no-referrer"
        className={`${assetClass} relative z-[1]`}
        onLoad={(event) => {
          if (!displaySrc) return;
          confirmLoaded(event.currentTarget, displaySrc);
        }}
        onError={displaySrc ? softRetryOrAdvance : undefined}
      />
    </div>
  );
}
