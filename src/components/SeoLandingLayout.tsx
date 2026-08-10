import Breadcrumbs from "@/components/Breadcrumbs";
import DiscoveryPageShell from "@/components/discovery/DiscoveryPageShell";
import SchemaScript from "@/components/SchemaScript";
import type { SeoLandingConfig } from "@/lib/seo-landing-pages";
import RelatedPages from "@/components/RelatedPages";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqSchema,
  buildWebPageSchema,
} from "@/lib/schema";

type SeoLandingLayoutProps = {
  config: SeoLandingConfig;
};

export default function SeoLandingLayout({ config }: SeoLandingLayoutProps) {
  const products = config.getProducts();
  const faqs = config.faqs.length > 0 ? config.faqs : undefined;
  const breadcrumbs =
    config.slug === "litbuy-spreadsheet"
      ? [
          { label: "Home", href: "/" },
          { label: "Finds", href: "/finds" },
          { label: config.h1 },
        ]
      : [
          { label: "Home", href: "/" },
          { label: config.h1 },
        ];

  return (
    <>
      <SchemaScript
        data={buildWebPageSchema({
          name: config.h1,
          description: config.metaDescription,
          path: config.path,
        })}
      />
      <SchemaScript data={buildBreadcrumbSchema(breadcrumbs, config.path)} />
      <SchemaScript
        data={buildCollectionPageSchema({
          name: config.h1,
          description: config.metaDescription,
          path: config.path,
          numberOfItems: products.length,
        })}
      />
      {faqs ? <SchemaScript data={buildFaqSchema(faqs)} /> : null}

      <Breadcrumbs items={breadcrumbs} currentPath={config.path} />

      <DiscoveryPageShell
        path={config.path}
        badge={config.badge}
        h1={config.h1}
        intro={config.intro}
        products={products}
        productSectionTitle={config.productSectionTitle}
        sections={config.sections}
        faqs={faqs}
        relatedLinks={config.relatedLinks}
        browseSlug={config.slug}
      />

      <RelatedPages currentPath={config.path} />
    </>
  );
}
