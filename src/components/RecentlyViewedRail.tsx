"use client";

import DiscoveryRail from "./DiscoveryRail";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

export default function RecentlyViewedRail() {
  const { items } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <DiscoveryRail
      title="Recently Viewed"
      subtitle="Pick up where you left off"
      href="/"
      products={items.slice(0, 12)}
    />
  );
}
