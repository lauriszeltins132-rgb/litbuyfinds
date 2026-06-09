import Link from "next/link";
import { getBrandSpotlight } from "@/lib/discovery";
import DiscoveryRail from "./DiscoveryRail";

export default function BrandSpotlight() {
  const { brand, products } = getBrandSpotlight();

  if (!brand || products.length === 0) return null;

  return (
    <section className="px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-3xl border border-border bg-surface/40 p-5 sm:p-6">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Brand Spotlight
            </p>
            <h2 className="mt-2 text-2xl font-black">{brand.name}</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Weekly focus on one of the most searched brands in the catalog —
              {` ${brand.count.toLocaleString()} finds available.`}
            </p>
          </div>
          <Link
            href={`/brands/${brand.slug}`}
            className="rounded-full border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-bold text-accent hover:bg-accent/15"
          >
            Shop {brand.name} →
          </Link>
        </div>

        <DiscoveryRail
          title=""
          href={`/brands/${brand.slug}`}
          products={products}
        />
      </div>
    </section>
  );
}
