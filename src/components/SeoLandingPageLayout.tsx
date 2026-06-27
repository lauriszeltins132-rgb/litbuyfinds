import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import SchemaScript from "@/components/SchemaScript";
import RelatedPages from "@/components/RelatedPages";
import { formatDatasetAge } from "@/lib/catalog-meta";
import type { SeoLandingPageEntry } from "@/lib/seo-landing-config";
import {
  resolveCompareGroups,
  resolveSeoLandingProducts,
} from "@/lib/seo-landing-engine";
import { getSeoLandingConfigPath } from "@/lib/seo-landing-config";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { getProductHref } from "@/lib/slugs";
import type { Product } from "@/lib/types";

type SeoLandingPageLayoutProps = {
  entry: SeoLandingPageEntry;
};

function buildProductItemList(
  entry: SeoLandingPageEntry,
  products: Product[],
  path: string
) {
  if (products.length === 0) return null;

  return buildItemListSchema({
    name: entry.productSectionTitle ?? entry.h1,
    description: entry.description,
    path,
    items: products.slice(0, 48).map((product, index) => ({
      name: product.product_name,
      url: getProductHref(product),
      position: index + 1,
    })),
  });
}

export default function SeoLandingPageLayout({ entry }: SeoLandingPageLayoutProps) {
  const path = getSeoLandingConfigPath(entry.slug);
  const products = resolveSeoLandingProducts(entry);
  const compareGroups =
    entry.type === "comparison" && entry.compareGroups?.length
      ? resolveCompareGroups(entry.compareGroups)
      : [];
  const faqs = entry.faqs.length > 0 ? entry.faqs : undefined;
  const sections = entry.sections ?? [];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(entry.type === "freshness"
      ? [{ label: "Trending", href: "/trending" }]
      : []),
    { label: entry.h1 },
  ];

  const schema: Record<string, unknown>[] = [
    buildWebPageSchema({
      name: entry.h1,
      description: entry.description,
      path,
    }),
    buildBreadcrumbSchema(breadcrumbItems, path),
  ];

  if (faqs) {
    schema.push(buildFaqSchema(faqs));
  }

  if (products.length > 0 && entry.type !== "comparison") {
    schema.push(
      buildCollectionPageSchema({
        name: entry.h1,
        description: entry.description,
        path,
        numberOfItems: products.length,
      })
    );
    const itemList = buildProductItemList(entry, products, path);
    if (itemList) schema.push(itemList);
  }

  if (compareGroups.length > 0) {
    for (const group of compareGroups) {
      if (group.products.length === 0) continue;
      const itemList = buildItemListSchema({
        name: `${entry.h1} — ${group.label}`,
        path,
        items: group.products.slice(0, 24).map((product, index) => ({
          name: product.product_name,
          url: getProductHref(product),
          position: index + 1,
        })),
      });
      schema.push(itemList);
    }
  }

  return (
    <>
      <SchemaScript data={schema} />

      <Breadcrumbs
        items={breadcrumbItems}
        currentPath={path}
      />

      <article className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {entry.badge}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {entry.h1}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">{entry.intro}</p>
          {products.length > 0 ? (
            <p className="mt-3 text-sm text-muted">
              {products.length.toLocaleString()} curated picks · Updated{" "}
              {formatDatasetAge()}
            </p>
          ) : null}

          {sections.length > 0 ? (
            <div className="mt-10 space-y-10">
              {sections.map((section) => {
                const Heading = section.level === 3 ? "h3" : "h2";
                return (
                  <section key={section.heading}>
                    <Heading
                      className={
                        section.level === 3
                          ? "text-lg font-bold text-foreground"
                          : "text-xl font-black text-foreground"
                      }
                    >
                      {section.heading}
                    </Heading>
                    <div className="mt-3 space-y-3 text-base leading-relaxed text-muted">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {section.links && section.links.length > 0 ? (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {section.links.map((link) => (
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
                    ) : null}
                  </section>
                );
              })}
            </div>
          ) : null}

          {(entry.brandLinks?.length ?? 0) > 0 || (entry.categoryLinks?.length ?? 0) > 0 ? (
            <section className="mt-10 rounded-2xl border border-border bg-surface/30 p-5">
              {entry.brandLinks && entry.brandLinks.length > 0 ? (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
                    Related brands
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {entry.brandLinks.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={`/brands/${slug}`}
                          className="rounded-full border border-border px-3 py-1.5 text-xs font-bold capitalize text-foreground/80 hover:border-accent/40 hover:text-accent"
                        >
                          {slug}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {entry.categoryLinks && entry.categoryLinks.length > 0 ? (
                <div className={entry.brandLinks?.length ? "mt-5" : undefined}>
                  <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
                    Related categories
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {entry.categoryLinks.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={`/categories/${slug}`}
                          className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                        >
                          {slug.replace(/-/g, " ")}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          {faqs ? (
            <section className="mt-12 rounded-2xl border border-border bg-surface/40 p-6">
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
            </section>
          ) : null}

          {entry.relatedLinks.length > 0 ? (
            <section className="mt-10 border-t border-border pt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
                Keep exploring
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {entry.relatedLinks.map((link) => (
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
            </section>
          ) : null}
        </div>
      </article>

      {compareGroups.length > 0
        ? compareGroups.map((group) =>
            group.products.length > 0 ? (
              <section key={group.label} className="px-4 pb-8 pt-4 sm:px-6">
                <div className="mx-auto max-w-7xl">
                  <h2 className="text-2xl font-black">{group.label}</h2>
                  <div className="mt-6">
                    <ProductGrid products={group.products} />
                  </div>
                </div>
              </section>
            ) : null
          )
        : null}

      {products.length > 0 && entry.type !== "comparison" ? (
        <section className="px-4 pb-12 pt-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-black">
              {entry.productSectionTitle ?? "Featured finds"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Curated picks with verified agent buy links.
            </p>
            <div className="mt-6">
              <ProductGrid products={products.slice(0, entry.productLimit ?? 48)} />
            </div>
          </div>
        </section>
      ) : null}

      {products.length > 0 && entry.type === "comparison" && !entry.compareGroups?.length ? (
        <section className="px-4 pb-12 pt-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-black">
              {entry.productSectionTitle ?? "Sample finds"}
            </h2>
            <div className="mt-6">
              <ProductGrid products={products} />
            </div>
          </div>
        </section>
      ) : null}

      <RelatedPages currentPath={path} />
    </>
  );
}
