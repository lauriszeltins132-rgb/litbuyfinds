"use client";

import { useEffect } from "react";
import { trackConversion } from "@/lib/analytics-events";
import { useConversion } from "@/context/ConversionContext";
import { extractBrand } from "@/lib/brands";
import type { Product } from "@/lib/types";

type TrackProductViewProps = {
  product: Product;
};

export default function TrackProductView({ product }: TrackProductViewProps) {
  const { recordProductView } = useConversion();

  useEffect(() => {
    recordProductView(product.id);
    trackConversion("product_view", {
      location: `/find/${product.id}`,
      productId: product.id,
      productName: product.product_name,
      brand: extractBrand(product.product_name) ?? undefined,
      category: product.category,
    });
  }, [product, recordProductView]);

  return null;
}
