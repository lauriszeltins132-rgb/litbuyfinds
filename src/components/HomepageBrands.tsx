import Link from "next/link";
import { getBrandSpotlight } from "@/lib/discovery";
import { getBrandsFromProducts } from "@/lib/brands";
import { getAllProducts } from "@/lib/products";
import DiscoveryRail from "./DiscoveryRail";

type HomepageBrandsProps = {
  hideSpotlight?: boolean;
};

export default function HomepageBrands({ hideSpotlight = false }: HomepageBrandsProps) {
  const { brand, products } = getBrandSpotlight();
  const brands = getBrandsFromProducts(getAllProducts()).slice(0, 12);

  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Trending Brands</h2>
            <p className="mt-1 text-sm text-muted">
              Nike, Jordan, Moncler, Stone Island, Arc&apos;teryx and more.
            </p>
          </div>
          <Link href="/brands" className="text-sm font-bold text-accent hover:underline">
            All brands →
          </Link>
        </div>

        {!hideSpotlight && brand && products.length > 0 ? (
          <div className="mb-6 rounded-3xl border border-border bg-surface/40 p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Brand spotlight
                </p>
                <h3 className="mt-1 text-lg font-black">{brand.name}</h3>
              </div>
              <Link
                href={`/brands/${brand.slug}`}
                className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-bold text-accent"
              >
                Shop {brand.name} →
              </Link>
            </div>
            <DiscoveryRail title="" href={`/brands/${brand.slug}`} products={products} />
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((item) => (
            <Link
              key={item.slug}
              href={`/brands/${item.slug}`}
              className="panel-shell rounded-2xl border border-border p-4 transition hover:border-accent/35"
            >
              <p className="font-bold text-foreground">{item.name}</p>
              <p className="mt-1 text-xs text-muted">
                {item.count.toLocaleString()} finds
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
