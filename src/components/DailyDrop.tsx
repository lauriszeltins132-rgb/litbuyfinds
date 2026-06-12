"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { formatProductPrice } from "@/lib/pricing";
import { trackProductContext } from "@/lib/analytics-events";
import { getProductHref } from "@/lib/slugs";
import ProductImage from "./ProductImage";

export default function DailyDrop() {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/daily-drop")
      .then((res) => res.json())
      .then((data: { product: Product }) => {
        if (!cancelled) setProduct(data.product);
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!product) {
    return (
      <section className="px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="panel-shell h-[420px] animate-pulse rounded-3xl border border-border-strong lg:h-[520px]" />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="panel-shell overflow-hidden rounded-3xl border border-border-strong">
          <div className="grid lg:grid-cols-2">
            <div className="product-image-shell product-image-shell--hero">
              <ProductImage
                src={product.image}
                alt={product.product_name}
                productName={product.product_name}
                priority
                variant="hero"
              />
              <div className="absolute left-4 top-4 rounded-full border border-accent/40 bg-background/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent backdrop-blur">
                Daily Drop
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Featured today
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                {product.product_name}
              </h2>
              <p className="mt-3 text-3xl font-black text-accent">
                {formatProductPrice(product.price, "USD")}
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                One standout pick from the full catalog — automatically selected by
                today&apos;s date and refreshed every day at midnight UTC.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={getProductHref(product)}
                  className="rounded-full bg-accent px-6 py-3 text-sm font-black text-background hover:bg-accent-hover"
                >
                  View product
                </Link>
                {product.affiliate_link && (
                  <a
                    href={product.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => trackProductContext("buy_click", product, "daily_drop")}
                    className="rounded-full border border-border px-6 py-3 text-sm font-bold text-foreground hover:border-accent/40"
                  >
                    Buy on LitBuy
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
