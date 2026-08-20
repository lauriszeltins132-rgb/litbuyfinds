import type { MetadataRoute } from "next";
import { CATEGORY_ALIAS_SLUGS } from "@/lib/category-aliases";
import { COLLECTION_SLUGS, COLLECTIONS } from "@/lib/collections";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories, getAllProducts } from "@/lib/products";
import { getAllProductSlugs } from "@/lib/slugs";
import { GUIDE_SLUGS, GUIDES_HUB, GUIDE_PAGES } from "@/lib/guides";
import { SEO_LIST_SLUGS, SEO_LIST_ROUTES } from "@/lib/seo-list-routes";
import { STATIC_PAGES } from "@/lib/static-pages";
import { SHARE_COLLECTION_SLUGS, SHARE_COLLECTIONS } from "@/lib/share-collections";
import { BEST_OF_PAGES, BEST_OF_SLUGS } from "@/lib/best-of-pages";
import { SEO_LANDING_PAGES, SEO_LANDING_SLUGS } from "@/lib/seo-landing-pages";
import {
  getPublishedSeoLandingConfigs,
  getSitemapChangeFrequency,
} from "@/lib/seo-landing-engine";
import { AGENT_LANDING_SLUGS } from "@/lib/agent-landing-pages";
import {
  DISCORD_AGENT_LANDING_PAGES,
  DISCORD_AGENT_LANDING_SLUGS,
} from "@/lib/discord-agent-landing-pages";
import {
  AGENT_COUPON_LANDING_PAGES,
  AGENT_COUPON_LANDING_SLUGS,
} from "@/lib/agent-coupon-landing-pages";
import {
  TELEGRAM_AGENT_LANDING_PAGES,
  TELEGRAM_AGENT_LANDING_SLUGS,
} from "@/lib/telegram-agent-landing-pages";
import {
  TELEGRAM_SEO_PAGES,
  TELEGRAM_SEO_SLUGS,
} from "@/lib/telegram-seo-pages";
import { ADVERTISE_PAGE_PATH } from "@/lib/advertise-page";
import { FINDS_HUB_PATH } from "@/lib/finds-hub";
import {
  LITBUY_COUPON_REDIRECT_SLUGS,
  LITBUY_COUPONS_PATH,
} from "@/lib/litbuy-coupons-page";
import { getDatasetSyncedIso } from "@/lib/catalog-meta";
import { AUTHORITY_PAGE_SLUGS, getAuthorityPage } from "@/lib/litbuy-authority-pages";
import { SITE_URL } from "@/lib/site";

/** Guides that 301/308 to root authority pages — omit from sitemap to avoid duplicate URLs. */
const SITEMAP_EXCLUDED_GUIDE_SLUGS = new Set([
  "what-is-litbuy",
  "litbuy-finds",
  "litbuy-qc-photos",
  "how-to-use-litbuy",
  "what-are-qc-photos",
  "how-to-save-money-on-shipping",
  "litbuy-spreadsheet",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getCategories();
  const brands = getBrandsFromProducts(getAllProducts());
  const productSlugs = getAllProductSlugs();

  const routes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/ai`, changeFrequency: "weekly", priority: 0.9 },
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/trending`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/latest`, changeFrequency: "daily", priority: 0.88 },
    { url: `${SITE_URL}${FINDS_HUB_PATH}`, changeFrequency: "daily", priority: 0.98 },
    { url: `${SITE_URL}/deals`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/recently-added`, changeFrequency: "daily", priority: 0.92 },
    { url: `${SITE_URL}/brands`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/collections`, changeFrequency: "weekly", priority: 0.88 },
    {
      url: `${SITE_URL}/best-finds-by-category`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    { url: `${SITE_URL}${GUIDES_HUB.path}`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${SITE_URL}${LITBUY_COUPONS_PATH}`,
      changeFrequency: "daily",
      priority: 0.95,
      lastModified: getDatasetSyncedIso(),
    },
  ];

  for (const slug of AUTHORITY_PAGE_SLUGS) {
    const page = getAuthorityPage(slug);
    if (!page) continue;
    routes.push({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: "weekly",
      priority: slug === "litbuy-discord" ? 0.94 : 0.93,
      lastModified:
        slug === "litbuy-discord" ? getDatasetSyncedIso() : page.modifiedTime,
    });
  }

  for (const slug of GUIDE_SLUGS) {
    if (SITEMAP_EXCLUDED_GUIDE_SLUGS.has(slug)) continue;
    const guide = GUIDE_PAGES[slug];
    routes.push({
      url: `${SITE_URL}${guide.path}`,
      changeFrequency: "monthly",
      priority: 0.86,
    });
  }

  for (const slug of SEO_LIST_SLUGS) {
    const list = SEO_LIST_ROUTES[slug];
    routes.push({
      url: `${SITE_URL}${list.path}`,
      changeFrequency: "weekly",
      priority: 0.84,
    });
  }

  for (const slug of SEO_LANDING_SLUGS) {
    const page = SEO_LANDING_PAGES[slug];
    routes.push({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: "weekly",
      priority:
        slug === "litbuy-spreadsheet"
          ? 0.96
          : slug === "latest-finds"
            ? 0.97
            : slug === "litbuy-finds" ||
                slug === "best-litbuy-finds" ||
                slug === "best-litbuy-finds-2026" ||
                slug === "litbuy-hoodies" ||
                slug === "litbuy-bags" ||
                slug === "litbuy-accessories" ||
                slug === "litbuy-qc"
              ? 0.91
              : 0.88,
      lastModified: getDatasetSyncedIso(),
    });
  }

  for (const entry of getPublishedSeoLandingConfigs()) {
    const discoveryPriority = new Set([
      "sneaker-finds",
      "clothing-finds",
      "hoodie-finds",
      "jacket-finds",
      "streetwear-finds",
      "rep-finds",
      "best-rep-finds",
      "bag-finds",
      "best-sneaker-finds",
      "best-clothing-finds",
    ]);
    routes.push({
      url: `${SITE_URL}/${entry.slug}`,
      changeFrequency: getSitemapChangeFrequency(entry),
      priority:
        entry.slug === "latest-finds"
          ? 0.97
          : entry.slug === "rep-finds"
            ? 0.93
            : discoveryPriority.has(entry.slug)
              ? 0.92
              : entry.type === "freshness"
                ? 0.9
                : entry.type === "spreadsheet"
                  ? 0.9
                  : 0.87,
      lastModified: getDatasetSyncedIso(),
    });
  }

  for (const slug of AGENT_LANDING_SLUGS) {
    routes.push({
      url: `${SITE_URL}/${slug}`,
      changeFrequency: "weekly",
      priority: 0.86,
    });
  }

  const couponRedirectSlugs = new Set<string>(LITBUY_COUPON_REDIRECT_SLUGS);

  for (const slug of AGENT_COUPON_LANDING_SLUGS) {
    if (slug === "litbuy-coupons" || couponRedirectSlugs.has(slug)) continue;
    const page = AGENT_COUPON_LANDING_PAGES[slug];
    routes.push({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: "weekly",
      priority: slug.endsWith("-coupons") && !slug.startsWith("best-") ? 0.92 : 0.9,
    });
  }

  for (const slug of DISCORD_AGENT_LANDING_SLUGS) {
    const page = DISCORD_AGENT_LANDING_PAGES[slug];
    routes.push({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  const telegramAgentPriority = new Set([
    "telegram-usfans",
    "telegram-oopbuy",
    "telegram-gtbuy",
    "telegram-boonbuy",
    "telegram-hipobuy",
    "telegram-kakobuy",
  ]);
  for (const slug of TELEGRAM_AGENT_LANDING_SLUGS) {
    const page = TELEGRAM_AGENT_LANDING_PAGES[slug];
    routes.push({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: "weekly",
      priority: telegramAgentPriority.has(slug) ? 0.92 : 0.9,
      lastModified: getDatasetSyncedIso(),
    });
  }

  for (const slug of TELEGRAM_SEO_SLUGS) {
    const page = TELEGRAM_SEO_PAGES[slug];
    routes.push({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: "weekly",
      priority: 0.82,
    });
  }

  routes.push({
    url: `${SITE_URL}${ADVERTISE_PAGE_PATH}`,
    changeFrequency: "monthly",
    priority: 0.7,
  });

  for (const slug of BEST_OF_SLUGS) {
    const page = BEST_OF_PAGES[slug];
    routes.push({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: "daily",
      priority: 0.9,
    });
  }

  const highPriorityGuides = new Set([
    "/how-to-buy",
    "/new-user-guide",
    "/best-rep-sneakers",
    "/best-budget-finds",
    "/litbuy-vs-other-agents",
  ]);

  for (const page of Object.values(STATIC_PAGES)) {
    routes.push({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: "monthly",
      priority: highPriorityGuides.has(page.path) ? 0.85 : 0.75,
    });
  }

  for (const slug of COLLECTION_SLUGS) {
    const collection = COLLECTIONS[slug];
    if (collection.href !== "/trending" && collection.href !== "/deals") {
      routes.push({
        url: `${SITE_URL}${collection.href}`,
        changeFrequency: "daily",
        priority: 0.88,
      });
    }
  }

  for (const category of categories) {
    if (category.group === "category") {
      routes.push({
        url: `${SITE_URL}/categories/${category.slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  for (const slug of CATEGORY_ALIAS_SLUGS) {
    routes.push({
      url: `${SITE_URL}/categories/${slug}`,
      changeFrequency: "weekly",
      priority: 0.82,
    });
  }

  for (const brand of brands) {
    routes.push({
      url: `${SITE_URL}/brands/${brand.slug}`,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const slug of SHARE_COLLECTION_SLUGS) {
    const collection = SHARE_COLLECTIONS[slug];
    routes.push({
      url: `${SITE_URL}${collection.path}`,
      changeFrequency: "weekly",
      priority: 0.87,
    });
  }

  for (const slug of productSlugs) {
    routes.push({
      url: `${SITE_URL}/find/${slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  const seen = new Set<string>();
  return routes.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
