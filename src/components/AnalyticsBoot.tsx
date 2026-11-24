"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackConversion } from "@/lib/analytics-events";

export default function AnalyticsBoot() {
  const pathname = usePathname();

  useEffect(() => {
    trackConversion("page_view", { location: pathname });
    if (pathname === "/litbuy-invite-code" || pathname.startsWith("/litbuy-invite-code/")) {
      trackConversion("invite_page_view", {
        location: "litbuy_invite_code",
        href: pathname,
      });
    }
  }, [pathname]);

  return null;
}
