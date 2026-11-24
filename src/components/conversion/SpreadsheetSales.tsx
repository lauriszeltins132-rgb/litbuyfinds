"use client";

import { useEffect, useState } from "react";
import DiscoveryRail from "@/components/DiscoveryRail";
import { markSpreadsheetBrowse, trackConversion } from "@/lib/analytics-events";
import { isMobileViewport } from "@/lib/is-mobile-viewport";
import type { Product } from "@/lib/types";

type PopularResponse = {
  fallback: boolean;
  products: Product[];
};

export default function SpreadsheetSales() {
  const [popular, setPopular] = useState<PopularResponse | null>(null);

  useEffect(() => {
    markSpreadsheetBrowse();
    trackConversion("spreadsheet_page_view", {
      location: "litbuy_spreadsheet",
      href: "/litbuy-spreadsheet",
      variant: isMobileViewport() ? "mobile" : "desktop",
    });
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/analytics/popular", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("popular");
        return response.json() as Promise<PopularResponse>;
      })
      .then((data) => {
        if (active && data.products?.length) setPopular(data);
      })
      .catch(() => {
        if (active) setPopular(null);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!popular?.products.length) return null;

  return (
    <DiscoveryRail
      title="Popular This Week"
      subtitle={
        popular.fallback
          ? "Newest Mobile finds while this week’s LitBuy buy clicks build up."
          : "Most clicked LitBuy finds from the last 7 days."
      }
      products={popular.products}
      salesSurface="popular_this_week"
      tight
    />
  );
}
