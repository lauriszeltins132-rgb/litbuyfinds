"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackConversion } from "@/lib/analytics-events";

export default function AnalyticsBoot() {
  const pathname = usePathname();

  useEffect(() => {
    trackConversion("page_view", { location: pathname });
  }, [pathname]);

  return null;
}
