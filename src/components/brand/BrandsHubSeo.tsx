import Link from "next/link";
import {
  BRANDS_HUB_FAQS,
  BRANDS_HUB_SEO_SECTIONS,
  getMajorBrandLinks,
} from "@/lib/brands-hub";
import type { BrandInfo } from "@/lib/brands";

type BrandsHubSeoProps = {
  brands: BrandInfo[];
};

export default function BrandsHubSeo({ brands }: BrandsHubSeoProps) {
  const majorLinks = getMajorBrandLinks(brands, 32);

  return (
    <section className="px-4 pb-16 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-10">
        {BRANDS_HUB_SEO_SECTIONS.map((section) => (
          <div key={section.heading}>
            <h2 className="text-xl font-black">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h2 className="text-xl font-black">Browse every major brand</h2>
          <p className="mt-2 text-sm text-muted">
            Direct links to the most searched LitBuy brand pages in the catalog.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {majorLinks.map((brand) => (
              <li key={brand.slug}>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/85 hover:border-accent/40 hover:text-accent"
                >
                  {brand.name} LitBuy finds
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/collections"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-accent hover:border-accent/40"
              >
                Brand collections →
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-xl font-black">Frequently asked questions</h2>
          <dl className="mt-5 space-y-5">
            {BRANDS_HUB_FAQS.map((faq) => (
              <div key={faq.question}>
                <dt className="font-bold text-foreground">{faq.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
