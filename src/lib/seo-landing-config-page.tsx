import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoLandingPageLayout from "@/components/SeoLandingPageLayout";
import {
  getSeoLandingConfig,
  getSeoLandingConfigPath,
} from "@/lib/seo-landing-config";
import { isSeoLandingPagePublished } from "@/lib/seo-landing-engine";
import { buildPageMetadata } from "@/lib/seo";
import {
  resolveFreshnessDescription,
  resolveFreshnessPageTitle,
} from "@/lib/freshness-dates";

function requirePublishedSeoLandingConfig(slug: string) {
  const entry = getSeoLandingConfig(slug);
  if (!entry || !isSeoLandingPagePublished(entry)) {
    notFound();
  }
  return entry;
}

function getSeoLandingRevalidate(slug: string): number {
  const entry = getSeoLandingConfig(slug);
  if (!entry) return 86_400;

  switch (entry.updateFrequency) {
    case "daily":
      return 3_600;
    case "weekly":
      return 86_400;
    default:
      return 86_400;
  }
}

export function createSeoLandingConfigPage(slug: string) {
  async function generateMetadata(): Promise<Metadata> {
    const entry = getSeoLandingConfig(slug);
    if (!entry || !isSeoLandingPagePublished(entry)) {
      return { title: "Not found" };
    }

    return buildPageMetadata({
      title: resolveFreshnessPageTitle(entry),
      description: resolveFreshnessDescription(entry),
      path: getSeoLandingConfigPath(slug),
    });
  }

  function Page() {
    const entry = requirePublishedSeoLandingConfig(slug);
    return <SeoLandingPageLayout entry={entry} />;
  }

  const revalidate = getSeoLandingRevalidate(slug);

  return { generateMetadata, Page, revalidate };
}
