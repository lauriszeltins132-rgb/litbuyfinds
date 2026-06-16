import type { Metadata } from "next";
import SeoLandingLayout from "@/components/SeoLandingLayout";
import { getSeoLandingPage } from "@/lib/seo-landing-pages";
import { buildPageMetadata } from "@/lib/seo";

function requireSeoLandingPage(slug: string) {
  const config = getSeoLandingPage(slug);
  if (!config) {
    throw new Error(`Unknown SEO landing page: ${slug}`);
  }
  return config;
}

export function createSeoLandingPage(slug: string) {
  const config = requireSeoLandingPage(slug);
  const { title, metaDescription, path } = config;

  async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata({
      title,
      description: metaDescription,
      path,
    });
  }

  function Page() {
    return <SeoLandingLayout config={config} />;
  }

  return { generateMetadata, Page };
}
