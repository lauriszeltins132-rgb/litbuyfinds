import type { Metadata } from "next";
import BestOfLanding from "@/components/BestOfLanding";
import { getBestOfPage } from "@/lib/best-of-pages";
import { buildPageMetadata } from "@/lib/seo";

function requireBestOfPage(slug: string) {
  const config = getBestOfPage(slug);
  if (!config) {
    throw new Error(`Unknown best-of page: ${slug}`);
  }
  return config;
}

export function createBestOfPage(slug: string) {
  const config = requireBestOfPage(slug);
  const { title, metaDescription, path } = config;

  async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata({
      title,
      description: metaDescription,
      path,
    });
  }

  function Page() {
    return <BestOfLanding config={config} />;
  }

  return { generateMetadata, Page };
}
