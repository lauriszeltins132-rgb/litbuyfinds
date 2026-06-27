import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoLandingPageLayout from "@/components/SeoLandingPageLayout";
import {
  getSeoLandingConfig,
  getSeoLandingConfigPath,
} from "@/lib/seo-landing-config";
import { isSeoLandingPagePublished } from "@/lib/seo-landing-engine";
import { buildPageMetadata } from "@/lib/seo";

function requirePublishedSeoLandingConfig(slug: string) {
  const entry = getSeoLandingConfig(slug);
  if (!entry || !isSeoLandingPagePublished(entry)) {
    notFound();
  }
  return entry;
}

export function createSeoLandingConfigPage(slug: string) {
  async function generateMetadata(): Promise<Metadata> {
    const entry = getSeoLandingConfig(slug);
    if (!entry || !isSeoLandingPagePublished(entry)) {
      return { title: "Not found" };
    }

    return buildPageMetadata({
      title: entry.title,
      description: entry.description,
      path: getSeoLandingConfigPath(slug),
    });
  }

  function Page() {
    const entry = requirePublishedSeoLandingConfig(slug);
    return <SeoLandingPageLayout entry={entry} />;
  }

  return { generateMetadata, Page };
}
