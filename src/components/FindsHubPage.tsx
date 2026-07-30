import Link from "next/link";
import SmartLink from "@/components/SmartLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentFreshness from "@/components/ContentFreshness";
import ProductGrid from "@/components/ProductGrid";
import SchemaScript from "@/components/SchemaScript";
import { PUBLIC_CATALOG_COUNT } from "@/lib/constants";
import { getCatalogFreshnessSchemaDates } from "@/lib/freshness-dates";
import {
  FINDS_HUB_CATEGORY_LINKS,
  FINDS_HUB_FAQS,
  FINDS_HUB_METADATA,
  FINDS_HUB_PATH,
  getFindsHubSections,
} from "@/lib/finds-hub";
import { getAllProducts } from "@/lib/products";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqSchema,
  buildWebPageSchema,
} from "@/lib/schema";

export default function FindsHubPage() {
  const sections = getFindsHubSections();
  const catalogCount = getAllProducts().length;
  const freshnessDates = getCatalogFreshnessSchemaDates();
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: FINDS_HUB_METADATA.h1 },
  ];

  return (
    <>
      <SchemaScript
        data={buildWebPageSchema({
          name: FINDS_HUB_METADATA.h1,
          description: FINDS_HUB_METADATA.description,
          path: FINDS_HUB_PATH,
          datePublished: freshnessDates.datePublished,
          dateModified: freshnessDates.dateModified,
        })}
      />
      <SchemaScript data={buildBreadcrumbSchema(breadcrumbs, FINDS_HUB_PATH)} />
      <SchemaScript data={buildFaqSchema([...FINDS_HUB_FAQS])} />
      <SchemaScript
        data={buildCollectionPageSchema({
          name: FINDS_HUB_METADATA.h1,
          description: FINDS_HUB_METADATA.description,
          path: FINDS_HUB_PATH,
          numberOfItems: catalogCount,
          datePublished: freshnessDates.datePublished,
          dateModified: freshnessDates.dateModified,
        })}
      />

      <Breadcrumbs items={breadcrumbs} currentPath={FINDS_HUB_PATH} />

      <article className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {FINDS_HUB_METADATA.badge}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {FINDS_HUB_METADATA.h1}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-foreground">
            {FINDS_HUB_METADATA.directAnswer}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted">
            <ContentFreshness variant="updated-daily" display="badge" />
            <span>{PUBLIC_CATALOG_COUNT} finds indexed</span>
            <ContentFreshness variant="catalog-sync" />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {FINDS_HUB_CATEGORY_LINKS.map((link) => (
              <SmartLink
                key={link.href}
                href={link.href}
                className="inline-flex rounded-full border border-border bg-panel px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
              >
                {link.label}
              </SmartLink>
            ))}
          </div>

          <div className="mt-12 space-y-14">
            {sections.map((section) => {
              const products = section.getProducts();
              if (products.length === 0) return null;

              return (
                <section key={section.id} id={section.id}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-xl font-black text-foreground sm:text-2xl">
                        {section.title}
                      </h2>
                      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                        {section.description}
                      </p>
                      {section.freshness ? (
                        <div className="mt-2">
                          <ContentFreshness variant={section.freshness} />
                        </div>
                      ) : null}
                    </div>
                    <Link
                      href={section.href}
                      className="shrink-0 text-sm font-bold text-accent hover:underline"
                    >
                      {section.linkLabel}
                    </Link>
                  </div>
                  <div className="mt-6">
                    <ProductGrid products={products.slice(0, 12)} />
                  </div>
                </section>
              );
            })}
          </div>

          <section className="mt-14 border-t border-border pt-10">
            <h2 className="text-xl font-black text-foreground">FAQ</h2>
            <dl className="mt-5 space-y-6">
              {FINDS_HUB_FAQS.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-bold text-foreground">{faq.question}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </article>
    </>
  );
}
