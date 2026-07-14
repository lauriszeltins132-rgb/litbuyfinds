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
  TELEGRAM_AGENT_LANDING_PAGES,
  TELEGRAM_AGENT_LANDING_SLUGS,
} from "@/lib/telegram-agent-landing-pages";
import {
  TELEGRAM_SEO_PAGES,
  TELEGRAM_SEO_SLUGS,
} from "@/lib/telegram-seo-pages";
import { ADVERTISE_PAGE_PATH } from "@/lib/advertise-page";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getCategories();
  const brands = getBrandsFromProducts(getAllProducts());
  const productSlugs = getAllProductSlugs();

  const routes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/trending`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/latest`, changeFrequency: "daily", priority: 0.9 },
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
  ];

  for (const slug of GUIDE_SLUGS) {
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
      priority: 0.88,
    });
  }

  for (const entry of getPublishedSeoLandingConfigs()) {
    routes.push({
      url: `${SITE_URL}/${entry.slug}`,
      changeFrequency: getSitemapChangeFrequency(entry),
      priority: entry.type === "freshness" ? 0.9 : 0.87,
    });
  }

  for (const slug of AGENT_LANDING_SLUGS) {
    routes.push({
      url: `${SITE_URL}/${slug}`,
      changeFrequency: "weekly",
      priority: 0.86,
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

  for (const slug of TELEGRAM_AGENT_LANDING_SLUGS) {
    const page = TELEGRAM_AGENT_LANDING_PAGES[slug];
    routes.push({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: "weekly",
      priority: 0.9,
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

  return routes;
}
