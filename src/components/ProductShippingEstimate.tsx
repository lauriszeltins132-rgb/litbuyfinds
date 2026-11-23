"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackContextual } from "@/lib/analytics-events";
import { LITBUY_COUPONS_OFFER } from "@/lib/litbuy-coupons-page";
import {
  SHIPPING_DESTINATIONS,
  estimateCategoryWeight,
  type ShippingDestinationId,
} from "@/lib/shipping-estimate";

const STORAGE_KEY = "litbuy-shipping-destination";

type ProductShippingEstimateProps = {
  productId: string;
  category: string;
  agentId: string;
};

export default function ProductShippingEstimate({
  productId,
  category,
  agentId,
}: ProductShippingEstimateProps) {
  const weight = estimateCategoryWeight(category);
  const [destination, setDestination] = useState<ShippingDestinationId>("us");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (SHIPPING_DESTINATIONS.some((entry) => entry.id === stored)) {
        setDestination(stored as ShippingDestinationId);
      }
    } catch {
      // ignore
    }
    trackContextual("shipping_estimate_view", {
      location: "product_page",
      productId,
      agent: agentId,
    });
    // Fire once per product. Agent changes are tracked separately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  function changeDestination(next: ShippingDestinationId) {
    setDestination(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    trackContextual("shipping_destination_changed", {
      location: "product_page",
      productId,
      agent: agentId,
      query: next,
    });
  }

  return (
    <section
      className="rounded-2xl border border-border bg-surface/40 px-4 py-3"
      aria-label="Estimated weight and shipping"
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
        Estimated weight & shipping
      </p>
      <p className="mt-2 text-sm font-bold text-foreground">
        Estimated weight: {weight.kg.toFixed(2)} kg
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Typical packed weight for {weight.kind}. This is not a scale measurement
        of this listing.
      </p>
      <label className="mt-3 block text-xs font-semibold text-muted" htmlFor="shipping-destination">
        Destination
        <select
          id="shipping-destination"
          value={destination}
          onChange={(event) =>
            changeDestination(event.target.value as ShippingDestinationId)
          }
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
        >
          {SHIPPING_DESTINATIONS.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.label}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        LitBuy Finds does not have verified LitBuy freight rates, so no shipping
        price is shown. Check the live line on LitBuy for this destination.
      </p>
      {agentId === "litbuy" ? (
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Eligible new accounts can see up to {LITBUY_COUPONS_OFFER.shippingDiscount}{" "}
          {LITBUY_COUPONS_OFFER.shippingDiscountLabel.toLowerCase()} and a welcome
          coupon pack of up to {LITBUY_COUPONS_OFFER.welcomePack}.{" "}
          {LITBUY_COUPONS_OFFER.disclaimer} That offer is not applied to the item
          price here.
        </p>
      ) : null}
    </section>
  );
}
