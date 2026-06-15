"use client";

import DiscoveryRail from "./DiscoveryRail";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

type RecentlyViewedRailProps = {
  excludeProductId?: string;
  title?: string;
};

export default function RecentlyViewedRail({
  excludeProductId,
  title = "Recently Viewed",
}: RecentlyViewedRailProps) {
  const { items } = useRecentlyViewed();
  const products = items
    .filter((product) => product.id !== excludeProductId)
    .slice(0, 12);

  if (products.length === 0) return null;

  return (
    <DiscoveryRail
      title={title}
      subtitle="People also viewed these finds"
      href="/"
      products={products}
    />
  );
}
