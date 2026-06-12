"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

type ImageUnavailablePlaceholderProps = {
  className?: string;
  variant?: "card" | "featured" | "hero";
  loading?: boolean;
  productHref?: string;
};

export default function ImageUnavailablePlaceholder({
  className = "",
  variant = "card",
  loading = false,
  productHref,
}: ImageUnavailablePlaceholderProps) {
  const logoSize = variant === "card" ? 32 : variant === "featured" ? 40 : 44;

  return (
    <div
      className={`image-unavailable image-unavailable--${variant} ${loading ? "image-unavailable--loading" : ""} ${className}`}
      role="img"
      aria-label={loading ? "Loading product image" : "Product image unavailable"}
    >
      <div className="image-unavailable__glow" aria-hidden />
      <div className="image-unavailable__content">
        <div className="image-unavailable__logo">
          <Image
            src="/logo.svg"
            alt=""
            width={logoSize}
            height={logoSize}
            aria-hidden
          />
        </div>
        {!loading && productHref ? (
          <Link href={productHref} className="image-unavailable__cta">
            View details
          </Link>
        ) : null}
        {!loading && !productHref ? (
          <p className="image-unavailable__brand">{SITE_NAME}</p>
        ) : null}
      </div>
    </div>
  );
}
