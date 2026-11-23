"use client";

import { useEffect, useRef } from "react";
import { trackContextual, trackConversion } from "@/lib/analytics-events";
import { useConversion } from "@/context/ConversionContext";
import { usePreferences } from "@/context/PreferencesContext";
import { extractBrand } from "@/lib/brands";
import type { Product } from "@/lib/types";

type TrackProductViewProps = {
  product: Product;
};

export default function TrackProductView({ product }: TrackProductViewProps) {
  const { recordProductView } = useConversion();
  const { agentId } = usePreferences();
  const agentRef = useRef(agentId);
  agentRef.current = agentId;

  useEffect(() => {
    recordProductView(product.id);
    const shared = {
      productId: product.id,
      productName: product.product_name,
      brand: extractBrand(product.product_name) ?? undefined,
      category: product.category,
    };
    trackConversion("product_view", {
      ...shared,
      location: `/find/${product.id}`,
    });
    trackContextual("product_page_view", {
      ...shared,
      location: "product_page",
      agent: agentRef.current,
    });
  }, [product, recordProductView]);

  return null;
}
