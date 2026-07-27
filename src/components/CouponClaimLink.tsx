"use client";

import type { ComponentProps } from "react";
import { trackCouponClick } from "@/lib/analytics-events";

type CouponClaimLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  location: string;
};

/** Generic external CTA for coupon + spreadsheet SEO pages (any buying agent). */
export default function CouponClaimLink({
  href,
  location,
  onClick,
  children,
  ...props
}: CouponClaimLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={(event) => {
        trackCouponClick(location, href);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
