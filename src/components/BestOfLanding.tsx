import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import DiscoveryRail from "@/components/DiscoveryRail";
import ProductGrid from "@/components/ProductGrid";
import SchemaScript from "@/components/SchemaScript";
import {
  getBestOfBrands,
  getBestOfCategories,
  getBestOfSupplementaryRails,
  type BestOfPageConfig,
} from "@/lib/best-of-pages";
import RelatedPages from "@/components/RelatedPages";
import { formatDatasetAge } from "@/lib/catalog-meta";
import { buildCollectionPageSchema, buildFaqSchema } from "@/lib/schema";

type BestOfLandingProps = {
  config: BestOfPageConfig;
};

export default function BestOfLanding({ config }: BestOfLandingProps) {
  const products = config.getProducts();
  const brands = getBestOfBrands(config);
  const categories = getBestOfCategories(config);
  const rails = getBestOfSupplementaryRails(config);
  const faqs = config.faqs.length > 0 ? config.faqs : undefined;

  return (
    <>
      <SchemaScript
        data={buildCollectionPageSchema({
          name: config.h1,
          description: config.metaDescription,
          path: config.path,
          numberOfItems: products.length,
        })}
      />
      {faqs ? <SchemaScript data={buildFaqSchema(faqs)} /> : null}

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Best of", href: "/best-finds" },
          { label: config.h1 },
        ]}
        currentPath={config.path}
      />

      <section className="px-4 pb-4 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {config.badge}
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{config.h1}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            {config.intro}
          </p>
          <p className="mt-3 text-sm text-muted">
            {products.length.toLocaleString()} products · Updated {formatDatasetAge()}
          </p>
        </div>
      </section>

      <section className="px-4 pb-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-black">Top products</h2>
          <div className="mt-6">
            <ProductGrid products={products.slice(0, 48)} />
          </div>
        </div>
      </section>

      {brands.length > 0 ? (
        <section className="px-4 pb-6 sm:px-6">
          <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/30 p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
              Related brands
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {brand.name} ({brand.count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {categories.length > 0 ? (
        <section className="px-4 pb-6 sm:px-6">
          <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/30 p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
              Related categories
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={cat.href}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {config.relatedGuideHrefs.length > 0 ? (
        <section className="px-4 pb-6 sm:px-6">
          <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/30 p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
              Related guides
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {config.relatedGuideHrefs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {config.relatedBestOfHrefs.length > 0 ? (
        <section className="px-4 pb-6 sm:px-6">
          <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/30 p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
              More best-of collections
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {config.relatedBestOfHrefs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {rails.recentlyAdded.length > 0 ? (
        <DiscoveryRail
          title="Recently added"
          subtitle="Fresh listings from the catalog"
          href="/recently-added"
          products={rails.recentlyAdded}
        />
      ) : null}

      {rails.popularWeek.length > 0 ? (
        <DiscoveryRail
          title="Popular this week"
          subtitle="Trending picks right now"
          href="/best-finds-this-week"
          products={rails.popularWeek}
          showTrendingScore
        />
      ) : null}

      {rails.mostSaved.length > 0 ? (
        <DiscoveryRail
          title="Most engaged"
          subtitle="High click and save activity"
          href="/most-popular-finds-now"
          products={rails.mostSaved}
        />
      ) : null}

      {faqs ? (
        <section className="px-4 pb-12 sm:px-6">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface/40 p-6">
            <h2 className="text-xl font-black">Frequently asked questions</h2>
            <dl className="mt-5 space-y-5">
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
        </section>
      ) : null}

      <RelatedPages currentPath={config.path} />
    </>
  );
}
