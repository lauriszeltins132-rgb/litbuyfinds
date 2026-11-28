"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import {
  trackLitbuySignupClick,
  type SignupCtaLocation,
} from "@/lib/analytics-events";

type InviteFunnelLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onClick"> & {
  href: string;
  location: SignupCtaLocation;
};

export default function InviteFunnelLink({
  href,
  location,
  children,
  ...props
}: InviteFunnelLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => trackLitbuySignupClick(location)}
      {...props}
    >
      {children}
    </Link>
  );
}
