"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "@/context/PreferencesContext";
import { trackContextual } from "@/lib/analytics-events";
import { formatPrice } from "@/lib/currency";
import {
  LITBUY_SHIPPING_OFFER_PERCENT,
  litbuyShippingKeepRatio,
} from "@/lib/litbuy-coupons-page";
import { getPriceStatus } from "@/lib/pricing";
import {
  ILLUSTRATIVE_SHIPPING_USD_PER_KG,
  SHIPPING_DESTINATIONS,
  estimateCategoryWeight,
  illustrativeShippingUsd,
  type ShippingDestinationId,
} from "@/lib/shipping-estimate";

const STORAGE_KEY = "litbuy-shipping-destination";

type ProductShippingEstimateProps = {
  productId: string;
  category: string;
  agentId: string;
  priceUsd: number | null;
};

function moneyRange(lowUsd: number, highUsd: number, currency: "USD" | "EUR" | "CNY") {
  return `${formatPrice(lowUsd, currency)}–${formatPrice(highUsd, currency)}`;
}

export default function ProductShippingEstimate({
  productId,
  category,
  agentId,
  priceUsd,
}: ProductShippingEstimateProps) {
  const { currency } = usePreferences();
  const weight = estimateCategoryWeight(category);
  const shipping = illustrativeShippingUsd(weight.kg);
  const keep = litbuyShippingKeepRatio();
  const discounted = {
    low: Math.round(shipping.low * keep * 100) / 100,
    high: Math.round(shipping.high * keep * 100) / 100,
  };
  const itemUsd =
    priceUsd !== null && getPriceStatus(priceUsd) === "exact" ? priceUsd : null;
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

  const rateLabel = `$${ILLUSTRATIVE_SHIPPING_USD_PER_KG.low}–$${ILLUSTRATIVE_SHIPPING_USD_PER_KG.high}/kg`;

  return (
    <section
      className="rounded-2xl border border-border bg-panel px-4 py-4"
      aria-label="Estimated weight and shipping"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
        Estimated weight & shipping
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-semibold text-muted">Estimated weight</p>
          <p className="mt-0.5 text-lg font-black text-foreground">
            {weight.kg.toFixed(2)} kg
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted">Estimated shipping</p>
          <p className="mt-0.5 text-lg font-black text-foreground">
            ≈ {moneyRange(shipping.low, shipping.high, currency)}
          </p>
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Based on an illustrative {rateLabel} shipping assumption. Typical packed
        weight for {weight.kind}, not a scale measurement of this listing.
        {currency !== "USD"
          ? " Amounts use the site currency conversion, not a live LitBuy quote."
          : ""}
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
      <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
        Saved for context. This estimate does not change by country.
      </p>
      {itemUsd !== null ? (
        <p className="mt-3 text-sm font-bold text-foreground">
          Estimated item + shipping:{" "}
          {moneyRange(itemUsd + shipping.low, itemUsd + shipping.high, currency)}
        </p>
      ) : null}
      <div className="mt-3 rounded-xl bg-accent/10 px-3 py-3">
        <p className="text-xs font-bold text-foreground">
          Potential shipping with {LITBUY_SHIPPING_OFFER_PERCENT} offer
        </p>
        <p className="mt-1 text-lg font-black text-foreground">
          ≈ {moneyRange(discounted.low, discounted.high, currency)}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Potential estimate with the current up-to-{LITBUY_SHIPPING_OFFER_PERCENT}{" "}
          shipping offer. Not guaranteed.
          {agentId === "litbuy"
            ? ""
            : " This offer is for eligible new LitBuy accounts."}
        </p>
        {itemUsd !== null ? (
          <p className="mt-2 text-sm font-bold text-foreground">
            Estimated item + discounted shipping:{" "}
            {moneyRange(
              itemUsd + discounted.low,
              itemUsd + discounted.high,
              currency
            )}
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Estimated using a {rateLabel} assumption. Actual LitBuy freight rates,
        parcel weight, shipping line, packaging, and coupon eligibility may differ.
        Confirm the final total at LitBuy checkout.
      </p>
    </section>
  );
}
