import { COMPARISON_PAGES, COMPARISON_SLUGS } from "./comparison-pages";
import { TOP_LISTS, TOP_LIST_SLUGS } from "./top-lists";
import type { ComparisonConfig } from "./comparison-pages";
import type { SeoListConfig } from "./top-lists";

export type SeoRouteConfig = SeoListConfig | ComparisonConfig;

export const SEO_LIST_ROUTES: Record<string, SeoRouteConfig> = {
  ...TOP_LISTS,
  ...COMPARISON_PAGES,
};

export const SEO_LIST_SLUGS = [...TOP_LIST_SLUGS, ...COMPARISON_SLUGS];

export function getSeoListRoute(slug: string): SeoRouteConfig | undefined {
  return SEO_LIST_ROUTES[slug];
}

export function isComparisonPage(
  config: SeoRouteConfig
): config is ComparisonConfig {
  return "compareGroups" in config && Array.isArray(config.compareGroups);
}
