"use client";

import { LITBUY_OFFER_HEADLINE } from "@/lib/constants";
import RegisterLink from "./RegisterLink";

const text = `REGISTER ON LITBUY — ${LITBUY_OFFER_HEADLINE.toUpperCase()}`;

export default function PromoBanner() {
  const items = Array.from({ length: 6 }, () => text);

  return (
    <div className="sticky top-0 z-[60] overflow-hidden border-b border-border bg-surface/95 py-2 backdrop-blur">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-8">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
              {item}
            </span>
            <RegisterLink
              location="promo_banner"
              className="text-xs font-bold text-foreground underline"
            >
              Register →
            </RegisterLink>
          </div>
        ))}
      </div>
    </div>
  );
}
