import Link from "next/link";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogPanel from "@/components/CatalogPanel";
import ProductGrid from "@/components/ProductGrid";
import RelatedPages from "@/components/RelatedPages";
import SchemaScript from "@/components/SchemaScript";
import { formatDatasetAge } from "@/lib/catalog-meta";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories } from "@/lib/products";
import { buildCollectionPageSchema, buildFaqSchema } from "@/lib/schema";
import { isComparisonPage, type SeoRouteConfig } from "@/lib/seo-list-routes";

type SeoListLandingProps = {
  config: SeoRouteConfig;
};

export default function SeoListLanding({ config }: SeoListLandingProps) {
  const isComparison = isComparisonPage(config);
  const products = isComparison
    ? (config.compareGroups?.flatMap((g) => g.products) ?? [])
    : config.getProducts();
  const brands = getBrandsFromProducts(products);
  const faqs = "faqs" in config && config.faqs?.length ? config.faqs : undefined;
  const featured = products.slice(0, 12);

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
          { label: "Collections", href: "/collections" },
          { label: config.h1 },
        ]}
        currentPath={config.path}
      />

      <section className="px-4 pb-6 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {config.badge}
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{config.h1}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            {config.intro}
          </p>
          {"seoBody" in config && config.seoBody ? (
            <details className="group mt-4 max-w-3xl">
              <summary className="cursor-pointer text-sm font-bold text-accent">
                More about this collection
              </summary>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
                {config.seoBody.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </details>
          ) : null}
          <p className="mt-3 text-sm text-muted">
            {products.length.toLocaleString()} products shown · Dataset updated{" "}
            {formatDatasetAge()}
          </p>
        </div>
      </section>

      {!isComparison && featured.length > 0 ? (
        <section className="px-4 pb-6 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-black">Featured picks</h2>
            <p className="mt-1 text-sm text-muted">Top listings from this collection</p>
            <div className="mt-6">
              <ProductGrid products={featured} />
            </div>
          </div>
        </section>
      ) : null}

      {isComparison && config.compareGroups ? (
        <div className="space-y-12 px-4 pb-8 sm:px-6">
          {config.compareGroups.map((group) => (
            <section key={group.label} className="mx-auto max-w-7xl">
              <h2 className="text-xl font-black">{group.label}</h2>
              <p className="mt-1 text-sm text-muted">
                {group.products.length.toLocaleString()} picks
              </p>
              <div className="mt-6">
                <ProductGrid products={group.products} />
              </div>
            </section>
          ))}
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="py-24 text-center text-muted">Loading...</div>
          }
        >
          <CatalogPanel
            products={products}
            categories={getCategories()}
            brands={brands}
            basePath={config.path}
          />
        </Suspense>
      )}

      {config.clusterLinks && config.clusterLinks.length > 0 ? (
        <section className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/35 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Related collections
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {config.clusterLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {config.relatedLinks.length > 0 ? (
        <section className="px-4 pb-6 sm:px-6">
          <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/35 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Related pages
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {config.relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {faqs ? (
        <section className="px-4 pb-8 sm:px-6">
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
