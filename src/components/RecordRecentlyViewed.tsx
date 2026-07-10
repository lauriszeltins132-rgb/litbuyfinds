"use client";

import { useEffect } from "react";
import type { Product } from "@/lib/types";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

type RecordRecentlyViewedProps = {
  product: Pick<
    Product,
    | "id"
    | "product_name"
    | "category"
    | "category_slug"
    | "sheet"
    | "price"
    | "image"
    | "affiliate_link"
    | "qc_link"
    | "group"
  >;
};

export default function RecordRecentlyViewed({
  product,
}: RecordRecentlyViewedProps) {
  const { addViewed } = useRecentlyViewed();

  useEffect(() => {
    addViewed(product);
  }, [addViewed, product]);

  return null;
}
