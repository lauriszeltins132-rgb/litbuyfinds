import Link from "next/link";
import type { BrandInfo } from "@/lib/brands";
import type { Product } from "@/lib/types";
import { getProductHref } from "@/lib/slugs";

type BrandSeoBlockProps = {
  brandName: string;
  intro: string;
  topProducts: Product[];
  relatedBrands: BrandInfo[];
};

const BRAND_GUIDES: Record<string, string> = {
  nike: "Watch for correct swoosh placement and toe box height on Dunks and Air Max.",
  jordan: "Compare wings logo embossing and hourglass shape on Jordan 1 highs.",
  adidas: "Check stripe alignment on Campus and Samba styles.",
  default:
    "Filter by price, open QC when available, and compare photos to retail references before shipping.",
};

export default function BrandSeoBlock({
  brandName,
  intro,
  topProducts,
  relatedBrands,
}: BrandSeoBlockProps) {
  const slug = brandName.toLowerCase().replace(/\s+/g, "-");
  const guide =
    BRAND_GUIDES[slug] ??
    BRAND_GUIDES[brandName.toLowerCase()] ??
    BRAND_GUIDES.default;

  return (
    <section className="px-4 pb-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-lg font-black">{brandName} overview</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{intro}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface/30 p-5 md:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Popular picks
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {topProducts.slice(0, 5).map((product) => (
                <li key={product.id}>
                  <Link
                    href={getProductHref(product)}
                    className="text-foreground/80 hover:text-accent"
                  >
                    {product.product_name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface/30 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Buying guide
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{guide}</p>
            <Link
              href="/how-to-buy"
              className="mt-4 inline-block text-xs font-bold text-accent hover:underline"
            >
              Full how-to-buy guide →
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-surface/30 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Similar brands
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {relatedBrands.slice(0, 8).map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
