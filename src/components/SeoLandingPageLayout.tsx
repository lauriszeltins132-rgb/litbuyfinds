import Breadcrumbs from "@/components/Breadcrumbs";
import DiscoveryPageShell from "@/components/discovery/DiscoveryPageShell";
import SchemaScript from "@/components/SchemaScript";
import RelatedPages from "@/components/RelatedPages";
import {
  getUpdateFrequencyFreshnessVariant,
} from "@/components/ContentFreshness";
import { DISCOVERY_PRODUCT_LIMIT } from "@/lib/catalog-page-size";
import type { SeoLandingPageEntry } from "@/lib/seo-landing-config";
import {
  getFreshnessSchemaDates,
  resolveFreshnessDescription,
  resolveFreshnessH1,
} from "@/lib/freshness-dates";
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

  const limit = entry.productLimit ?? DISCOVERY_PRODUCT_LIMIT;

  return buildItemListSchema({
    name: entry.productSectionTitle ?? entry.h1,
    description: entry.description,
    path,
    items: products.slice(0, limit).map((product, index) => ({
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
  const h1 = resolveFreshnessH1(entry);
  const description = resolveFreshnessDescription(entry);
  const freshnessDates = getFreshnessSchemaDates(
    entry.updateFrequency,
    entry.freshnessDisplay
  );
  const freshnessVariant =
    entry.freshnessDisplay === "latestFinds"
      ? "latest-updated"
      : getUpdateFrequencyFreshnessVariant(entry.updateFrequency);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(entry.type === "collection"
      ? [{ label: "Finds", href: "/finds" }]
      : entry.type === "freshness"
        ? [{ label: "Finds", href: "/finds" }]
        : entry.type === "spreadsheet" && entry.agentId
          ? [{ label: "LitBuy Spreadsheet", href: "/litbuy-spreadsheet" }]
          : []),
    { label: h1 },
  ];

  const schema: Record<string, unknown>[] = [
    buildWebPageSchema({
      name: h1,
      description,
      path,
      datePublished: freshnessDates?.datePublished,
      dateModified: freshnessDates?.dateModified,
    }),
    buildBreadcrumbSchema(breadcrumbItems, path),
  ];

  if (faqs) {
    schema.push(buildFaqSchema(faqs));
  }

  if (products.length > 0 && entry.type !== "comparison") {
    schema.push(
      buildCollectionPageSchema({
        name: h1,
        description,
        path,
        numberOfItems: products.length,
        datePublished: freshnessDates?.datePublished,
        dateModified: freshnessDates?.dateModified,
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

      <Breadcrumbs items={breadcrumbItems} currentPath={path} />

      <DiscoveryPageShell
        path={path}
        badge={entry.badge}
        h1={h1}
        intro={entry.intro}
        freshnessVariant={freshnessVariant}
        products={products}
        productSectionTitle={entry.productSectionTitle}
        productLimit={entry.productLimit ?? DISCOVERY_PRODUCT_LIMIT}
        compareGroups={compareGroups.map((group) => ({
          label: group.label,
          products: group.products,
        }))}
        sections={entry.sections ?? []}
        faqs={faqs}
        relatedLinks={entry.relatedLinks}
        brandLinks={entry.brandLinks ?? []}
        categoryLinks={entry.categoryLinks ?? []}
        browseSlug={entry.slug}
        browseCategories={entry.filter?.categories ?? entry.categoryLinks ?? []}
        agentId={entry.agentId}
      />

      <RelatedPages currentPath={path} />
    </>
  );
}
