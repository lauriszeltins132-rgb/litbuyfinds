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
  const logoSize = variant === "card" ? 28 : variant === "featured" ? 36 : 40;

  return (
    <div
      className={`image-unavailable image-unavailable--${variant} ${loading ? "image-unavailable--loading" : ""} ${className}`}
      role="img"
      aria-label="Image unavailable"
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
        <p className="image-unavailable__brand">{SITE_NAME}</p>
        <p className="image-unavailable__label">Image unavailable</p>
        {productHref ? (
          <Link href={productHref} className="image-unavailable__cta">
            View product details
          </Link>
        ) : null}
      </div>
    </div>
  );
}
