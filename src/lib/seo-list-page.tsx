import type { Metadata } from "next";
import SeoListLanding from "@/components/SeoListLanding";
import { getSeoListRoute, type SeoRouteConfig } from "@/lib/seo-list-routes";
import { buildPageMetadata } from "@/lib/seo";

function requireSeoListRoute(slug: string): SeoRouteConfig {
  const config = getSeoListRoute(slug);
  if (!config) {
    throw new Error(`Unknown SEO list page: ${slug}`);
  }
  return config;
}

export function createSeoListPage(slug: string) {
  const config = requireSeoListRoute(slug);
  const { title, metaDescription, path } = config;

  async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata({
      title,
      description: metaDescription,
      path,
    });
  }

  function Page() {
    return <SeoListLanding config={config} />;
  }

  return { generateMetadata, Page };
}
