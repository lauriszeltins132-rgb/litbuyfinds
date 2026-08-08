import { getHomepageRails } from "./homepage-rails";
import { dedupeListingRail } from "./listing-dedupe";
import { getFindsAuthorityStats } from "./finds-authority";
import type { ContentFreshnessVariant } from "./freshness-dates";
import type { Product } from "./types";

export type DiscoveryBrowseRail = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  products: Product[];
  showTrendingScore?: boolean;
  freshness?: ContentFreshnessVariant;
};

export type DiscoveryHeroStat = {
  label: string;
  value: string;
};

/** First 1–2 sentences for above-the-fold hero copy. Full intro stays in SEO block below. */
export function getHeroIntro(intro: string, maxSentences = 2): string {
  const trimmed = intro.trim();
  if (!trimmed) return "";

  const sentences = trimmed.match(/[^.!?]+[.!?]+(?:\s|$)/g);
  if (!sentences || sentences.length <= maxSentences) {
    return trimmed;
  }

  return sentences.slice(0, maxSentences).join(" ").trim();
}

export function getDiscoveryHeroStats(
  productCount: number,
  options?: { qcCount?: number }
): DiscoveryHeroStat[] {
  const stats = getFindsAuthorityStats();
  const rows: DiscoveryHeroStat[] = [
    {
      label: "On this page",
      value: `${productCount.toLocaleString()} curated finds`,
    },
    {
      label: "Catalog indexed",
      value: stats.totalFindsLabel,
    },
  ];

  if (options?.qcCount && options.qcCount > 0) {
    rows.push({
      label: "QC photos",
      value: `${options.qcCount.toLocaleString()} listings`,
    });
  } else if (stats.qcFinds > 0) {
    rows.push({
      label: "QC database",
      value: `${stats.qcFindsLabel} linked`,
    });
  }

  return rows;
}

function excludePrimary(
  products: Product[],
  primaryIds: Set<string>,
  limit = 12
): Product[] {
  return dedupeListingRail(
    products.filter((product) => !primaryIds.has(product.id))
  ).slice(0, limit);
}

/**
 * Contextual browse rails shown below the primary product grid.
 * Uses existing homepage rails — never fabricates listings.
 */
export function getDiscoveryBrowseRails(options: {
  slug: string;
  primaryProducts: Product[];
  categories?: string[];
}): DiscoveryBrowseRail[] {
  const { slug, primaryProducts, categories = [] } = options;
  const primaryIds = new Set(primaryProducts.map((product) => product.id));
  const rails = getHomepageRails(16);
  const result: DiscoveryBrowseRail[] = [];

  const isLatestPage =
    slug === "latest-finds" ||
    slug === "latest-litbuy-finds" ||
    slug === "recently-added";
  const isTrendingPage =
    slug === "trending-today" ||
    slug === "trending-this-week" ||
    slug === "trending-litbuy-finds" ||
    slug === "trending";

  if (!isLatestPage) {
    const latest = excludePrimary(rails.latestFinds, primaryIds);
    if (latest.length >= 4) {
      result.push({
        id: "latest",
        title: "Latest finds",
        subtitle: "Newest catalog additions after each sync",
        href: "/latest-finds",
        products: latest,
        freshness: "latest-updated",
      });
    }
  }

  if (!isTrendingPage) {
    const trending = excludePrimary(rails.popularToday, primaryIds);
    if (trending.length >= 4) {
      result.push({
        id: "trending",
        title: "Trending now",
        subtitle: "Popular picks buyers are clicking today",
        href: "/trending-today",
        products: trending,
        showTrendingScore: true,
        freshness: "updated-daily",
      });
    }
  }

  if (categories.includes("shoes") && slug !== "sneaker-finds") {
    const sneakers = excludePrimary(
      rails.latestFinds.filter((product) => product.category_slug === "shoes"),
      primaryIds
    );
    if (sneakers.length >= 4) {
      result.push({
        id: "sneakers",
        title: "Sneaker finds",
        subtitle: "Nike, Jordan, Adidas & more",
        href: "/sneaker-finds",
        products: sneakers,
      });
    }
  }

  if (
    (categories.includes("hoodies-and-pants") ||
      categories.includes("coats-and-jackets")) &&
    slug !== "hoodie-finds" &&
    slug !== "jacket-finds"
  ) {
    const clothing = excludePrimary(
      rails.editorsPicks.filter((product) =>
        ["hoodies-and-pants", "coats-and-jackets", "tshirts-and-shorts"].includes(
          product.category_slug
        )
      ),
      primaryIds
    );
    if (clothing.length >= 4) {
      result.push({
        id: "clothing",
        title: "Clothing finds",
        subtitle: "Hoodies, jackets, and streetwear layers",
        href: "/clothing-finds",
        products: clothing,
      });
    }
  }

  return result.slice(0, 2);
}
