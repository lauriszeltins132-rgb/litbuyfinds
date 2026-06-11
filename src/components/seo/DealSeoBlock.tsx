import Link from "next/link";
import { formatProductPrice, hasExactPrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { getProductHref } from "@/lib/slugs";

type DealSeoBlockProps = {
  products: Product[];
};

export default function DealSeoBlock({ products }: DealSeoBlockProps) {
  const withQc = products.filter((p) => p.qc_link).slice(0, 4);
  const bestValue = [...products]
    .filter((p) => hasExactPrice(p.price))
    .sort((a, b) => (a.price ?? 99) - (b.price ?? 99))
    .slice(0, 5);

  return (
    <section className="px-4 pb-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-lg font-black">Why these deals stand out</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Budget finds are popular for first hauls and filler items in bigger
            shipments. Under $30 is the sweet spot for tees, basic accessories,
            and entry-level pieces — strong value without much risk.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface/30 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Best value right now
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {bestValue.map((product) => (
                <li key={product.id} className="flex justify-between gap-3">
                  <Link
                    href={getProductHref(product)}
                    className="text-foreground/80 hover:text-accent"
                  >
                    {product.product_name}
                  </Link>
                  <span className="shrink-0 font-bold text-accent">
                    {formatProductPrice(product.price, "USD")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface/30 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Related finds
            </h3>
            <p className="mt-2 text-sm text-muted">
              Pair a budget pickup with trending sneakers or a daily drop
              highlight for a balanced cart.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              <li>
                <Link
                  href="/hidden-gems"
                  className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
                >
                  Hidden gems
                </Link>
              </li>
              <li>
                <Link
                  href="/best-budget-finds"
                  className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
                >
                  Budget guide
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  href="/new-user-guide"
                  className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
                >
                  New user guide
                </Link>
              </li>
            </ul>
            {withQc.length > 0 ? (
              <p className="mt-4 text-xs text-muted">
                {withQc.length} budget picks include QC links — filter for QC in
                the catalog below.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
