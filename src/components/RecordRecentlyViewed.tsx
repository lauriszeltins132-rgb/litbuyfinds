"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

type RecordRecentlyViewedProps = {
  productId: string;
};

export default function RecordRecentlyViewed({
  productId,
}: RecordRecentlyViewedProps) {
  const { addViewed } = useRecentlyViewed();

  useEffect(() => {
    addViewed(productId);
  }, [addViewed, productId]);

  return null;
}
