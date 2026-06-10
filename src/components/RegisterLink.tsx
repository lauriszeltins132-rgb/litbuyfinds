"use client";

import { useEffect, type ComponentProps } from "react";
import { LITBUY_SIGNUP_URL } from "@/lib/constants";
import { trackRegisterClick, trackRegisterImpression } from "@/lib/analytics-events";

type RegisterLinkProps = Omit<ComponentProps<"a">, "href"> & {
  location: string;
};

export default function RegisterLink({
  location,
  onClick,
  children,
  ...props
}: RegisterLinkProps) {
  useEffect(() => {
    trackRegisterImpression(location);
  }, [location]);

  return (
    <a
      href={LITBUY_SIGNUP_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={(event) => {
        trackRegisterClick(location);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
