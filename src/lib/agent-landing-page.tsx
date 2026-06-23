import type { Metadata } from "next";
import SeoLandingLayout from "@/components/SeoLandingLayout";
import { getAgentLandingPage } from "@/lib/agent-landing-pages";
import { buildPageMetadata } from "@/lib/seo";

function requireAgentLandingPage(slug: string) {
  const config = getAgentLandingPage(slug);
  if (!config) {
    throw new Error(`Unknown agent landing page: ${slug}`);
  }
  return config;
}

export function createAgentLandingPage(slug: string) {
  const config = requireAgentLandingPage(slug);
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
