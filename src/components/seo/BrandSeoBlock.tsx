import Link from "next/link";
import SchemaScript from "@/components/SchemaScript";
import type { BrandInfo } from "@/lib/brands";
import { buildFaqSchema } from "@/lib/schema";
import { getBrandFaqs, getBrandRelatedGuides } from "@/lib/seo-content";
import type { Product } from "@/lib/types";
import { getProductHref } from "@/lib/slugs";

type BrandSeoBlockProps = {
  brandSlug: string;
  brandName: string;
  intro: string;
  topProducts: Product[];
  relatedBrands: BrandInfo[];
};

const BRAND_TIPS: Record<string, string> = {
  nike: "Watch swoosh placement and toe box height on Dunks and Air Max batches.",
  jordan: "Compare wings logo embossing and hourglass shape on Jordan 1 highs.",
  adidas: "Check stripe alignment on Campus and Samba styles.",
  "louis-vuitton": "Review monogram alignment and hardware on bags before shipping.",
  gucci: "Compare GG pattern spacing and zipper pulls on bags and belts.",
  moncler: "Check badge stitching and puff distribution on outerwear.",
  supreme: "Look at box logo symmetry and tag photos in QC.",
  default:
    "Filter by price, open QC when available, and compare photos to listing references before shipping.",
};

export default function BrandSeoBlock({
  brandSlug,
  brandName,
  intro,
  topProducts,
  relatedBrands,
}: BrandSeoBlockProps) {
  const tip = BRAND_TIPS[brandSlug] ?? BRAND_TIPS.default;
  const relatedGuides = getBrandRelatedGuides(brandSlug);
  const faqs = getBrandFaqs(brandSlug);

  return (
    <section className="px-4 pb-6 sm:px-6">
      <SchemaScript data={buildFaqSchema(faqs)} />
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-lg font-black">{brandName} overview</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{intro}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface/30 p-5">
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
              Buying tips
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{tip}</p>
            <Link
              href="/guides/how-to-order-from-litbuy"
              className="mt-4 inline-block text-xs font-bold text-accent hover:underline"
            >
              How to order guide →
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

          <div className="rounded-2xl border border-border bg-surface/30 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Related guides
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {relatedGuides.map((guide) => (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    className="font-semibold text-muted hover:text-accent"
                  >
                    {guide.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/30 p-6">
          <h2 className="text-lg font-black">Common questions</h2>
          <dl className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-bold text-foreground">{faq.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
