import Link from "next/link";
import { getBrandsFromProducts } from "@/lib/brands";
import { getAllProducts } from "@/lib/products";

export default function PopularBrands() {
  const brands = getBrandsFromProducts(getAllProducts()).slice(0, 12);

  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Popular Brands</h2>
            <p className="mt-1 text-sm text-muted">
              Jump straight into the brands people search most.
            </p>
          </div>
          <Link href="/brands" className="text-sm font-bold text-accent hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="panel-shell rounded-2xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-accent/35"
            >
              <p className="font-bold text-foreground">{brand.name}</p>
              <p className="mt-1 text-xs text-muted">
                {brand.count.toLocaleString()} finds
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
