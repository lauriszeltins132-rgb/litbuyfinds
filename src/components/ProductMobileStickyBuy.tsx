"use client";

import type { Product } from "@/lib/types";
import { formatProductPrice } from "@/lib/pricing";
import { usePreferences } from "@/context/PreferencesContext";
import BuyWithAgentButton from "@/components/agents/BuyWithAgentButton";

type ProductMobileStickyBuyProps = {
  product: Product;
  visible: boolean;
  displayName: string;
};

export default function ProductMobileStickyBuy({
  product,
  visible,
  displayName,
}: ProductMobileStickyBuyProps) {
  const { currency } = usePreferences();

  if (!product.affiliate_link) return null;

  return (
    <div
      className={`product-mobile-sticky-buy lg:hidden ${
        visible ? "product-mobile-sticky-buy--visible" : ""
      }`}
      aria-hidden={!visible}
    >
      <div className="product-mobile-sticky-buy__inner">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-foreground">{displayName}</p>
          <p className="text-sm font-black text-accent">
            {formatProductPrice(product.price, currency)}
          </p>
        </div>
        <BuyWithAgentButton
          product={product}
          location="product_page"
          compact
          className="shrink-0 px-5 py-2.5"
        />
      </div>
    </div>
  );
}
