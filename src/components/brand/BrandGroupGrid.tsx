import Link from "next/link";
import type { BrandInfo } from "@/lib/brands";

type BrandGroupGridProps = {
  title: string;
  description: string;
  brands: BrandInfo[];
};

export function BrandGroupGrid({ title, description, brands }: BrandGroupGridProps) {
  if (brands.length === 0) return null;

  return (
    <section className="px-4 pb-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-xl font-black sm:text-2xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{description}</p>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <li key={brand.slug}>
              <Link
                href={`/brands/${brand.slug}`}
                className="panel-shell block rounded-2xl border border-border p-4 transition-colors hover:border-accent/35"
              >
                <span className="font-bold text-foreground hover:text-accent">
                  {brand.name}
                </span>
                <p className="mt-1 text-xs text-muted">{brand.count.toLocaleString()} finds</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
