import searchIndexData from "@/data/search-index.json";
import { getBrandsFromProducts, extractBrand } from "./brands";
import { getCategories, getAllProducts, getTrendingProducts } from "./products";
import { BEST_OF_PAGES, BEST_OF_SLUGS } from "./best-of-pages";
import { GUIDE_PAGES } from "./guides";
import { SHARE_COLLECTION_SLUGS, SHARE_COLLECTIONS } from "./share-collections";
import { SEO_LANDING_SLUGS, SEO_LANDING_PAGES } from "./seo-landing-pages";
import { getPublishedSeoLandingSlugs } from "./seo-landing-engine";
import { POPULAR_SEARCHES } from "./constants";
import { getProductHref } from "./slugs";

export type { SearchSuggestion, SearchSuggestionGroup, SearchSuggestionType } from "./search-suggestions-client";
export { getClientSearchIndex } from "./search-suggestions-client";
import type { SearchSuggestion, SearchSuggestionGroup } from "./search-suggestions-client";

const BRAND_SUB_TYPES: Record<string, { label: string; query: string; priority: number }[]> = {
  nike: [
    { label: "Nike Shoes", query: "nike shoe", priority: 95 },
    { label: "Nike Hoodies", query: "nike hoodie", priority: 90 },
    { label: "Nike Tech Fleece", query: "nike tech", priority: 88 },
    { label: "Nike Jackets", query: "nike jacket", priority: 85 },
  ],
  jordan: [
    { label: "Jordan Sneakers", query: "jordan", priority: 95 },
    { label: "Jordan 1", query: "jordan 1", priority: 92 },
    { label: "Jordan 4", query: "jordan 4", priority: 90 },
  ],
  moncler: [
    { label: "Moncler Jackets", query: "moncler jacket", priority: 95 },
    { label: "Moncler Vests", query: "moncler vest", priority: 88 },
    { label: "Moncler Hoodies", query: "moncler hoodie", priority: 85 },
  ],
  adidas: [
    { label: "Adidas Campus", query: "adidas campus", priority: 90 },
    { label: "Adidas Samba", query: "adidas samba", priority: 88 },
    { label: "Adidas Sneakers", query: "adidas", priority: 85 },
  ],
  gucci: [
    { label: "Gucci Bags", query: "gucci bag", priority: 92 },
    { label: "Gucci Belts", query: "gucci belt", priority: 88 },
  ],
  "louis-vuitton": [
    { label: "LV Bags", query: "louis vuitton bag", priority: 92 },
    { label: "LV Accessories", query: "louis vuitton", priority: 85 },
  ],
  stussy: [
    { label: "Stussy Hoodies", query: "stussy hoodie", priority: 90 },
    { label: "Stussy Tees", query: "stussy tee", priority: 85 },
  ],
  corteiz: [
    { label: "Corteiz Hoodies", query: "corteiz hoodie", priority: 92 },
    { label: "Corteiz Cargos", query: "corteiz cargo", priority: 88 },
  ],
  "stone-island": [
    { label: "Stone Island Jackets", query: "stone island jacket", priority: 92 },
    { label: "Stone Island Sweaters", query: "stone island", priority: 85 },
  ],
  prada: [
    { label: "Prada Bags", query: "prada bag", priority: 90 },
    { label: "Prada Accessories", query: "prada", priority: 85 },
  ],
  bape: [
    { label: "Bape Hoodies", query: "bape hoodie", priority: 92 },
    { label: "Bape Tees", query: "bape tee", priority: 86 },
  ],
  "ralph-lauren": [
    { label: "Ralph Lauren Polos", query: "ralph lauren polo", priority: 90 },
    { label: "Ralph Lauren Knits", query: "ralph lauren", priority: 85 },
  ],
};

const GENERIC_BAG_SUGGESTIONS: {
  label: string;
  query: string;
  href?: string;
  priority: number;
}[] = [
  { label: "Designer Bags", query: "designer bag", priority: 90 },
  { label: "Crossbody Bags", query: "crossbody", priority: 88 },
  { label: "Travel Bags", query: "travel bag", priority: 85 },
  { label: "Popular Bags", query: "bag", href: "/best-bags", priority: 92 },
];

function countBrandMatches(brandName: string, query: string): number {
  const tail = query.toLowerCase().replace(brandName.toLowerCase(), "").trim();
  const pattern = tail ? new RegExp(tail.split(/\s+/).filter(Boolean).join("|"), "i") : null;
  return getAllProducts().filter((p) => {
    const brand = extractBrand(p.product_name);
    if (brand?.toLowerCase() !== brandName.toLowerCase()) return false;
    return pattern ? pattern.test(p.product_name) : true;
  }).length;
}

function buildIndex(): SearchSuggestion[] {
  const items: SearchSuggestion[] = [];
  const products = getAllProducts();
  const brands = getBrandsFromProducts(products);
  const topBrandNames = new Set(
    brands
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
      .map((brand) => brand.name.toLowerCase())
  );

  for (const brand of POPULAR_SEARCHES) {
    items.push({
      label: brand,
      href: `/?q=${encodeURIComponent(brand)}#browse`,
      type: "query",
      keywords: brand.toLowerCase(),
      priority: 100,
    });
  }

  const hubPages = [
    { label: "Finds hub", href: "/finds", keywords: "finds hub rep finds", priority: 98 },
    { label: "Latest finds", href: "/latest-finds", keywords: "latest rep finds", priority: 96 },
    { label: "Sneaker finds", href: "/sneaker-finds", keywords: "sneaker finds", priority: 95 },
    { label: "Clothing finds", href: "/clothing-finds", keywords: "clothing finds", priority: 94 },
    { label: "QC photos", href: "/litbuy-qc", keywords: "litbuy qc photos", priority: 93 },
    { label: "Spreadsheet", href: "/litbuy-spreadsheet", keywords: "litbuy spreadsheet", priority: 92 },
  ];
  for (const hub of hubPages) {
    items.push({
      label: hub.label,
      href: hub.href,
      type: "landing",
      keywords: hub.keywords,
      priority: hub.priority,
    });
  }

  const brandFindPages: Record<string, string> = {
    nike: "nike-finds",
    jordan: "jordan-finds",
    stussy: "stussy-finds",
    moncler: "moncler-finds",
    prada: "prada-finds",
    "stone-island": "stone-island-finds",
    "chrome-hearts": "chrome-hearts-finds",
  };

  for (const brand of brands) {
    const boost = topBrandNames.has(brand.name.toLowerCase()) ? 20 : 0;
    items.push({
      label: brand.name,
      href: `/brands/${brand.slug}`,
      type: "brand",
      keywords: `${brand.name} ${brand.slug}`.toLowerCase(),
      priority: 70 + Math.min(brand.count, 30) + boost,
    });

    const brandFindSlug = brandFindPages[brand.slug];
    if (brandFindSlug) {
      items.push({
        label: `${brand.name} finds`,
        href: `/${brandFindSlug}`,
        type: "collection",
        keywords: `${brand.name} finds rep`.toLowerCase(),
        priority: 93 + boost,
      });
    }

    const subs = BRAND_SUB_TYPES[brand.slug];
    if (subs) {
      for (const sub of subs) {
        const count = countBrandMatches(brand.name, sub.query);
        const countLabel = count > 0 ? ` (${count} finds)` : "";
        items.push({
          label: `${sub.label}${countLabel}`,
          href: `/brands/${brand.slug}?q=${encodeURIComponent(sub.query.split(" ").slice(1).join(" ") || sub.query)}`,
          type: "brand",
          keywords: `${sub.query} ${sub.label}`.toLowerCase(),
          priority: sub.priority + boost,
        });
      }
      const collectionSlug = {
        nike: "best-nike-finds",
        jordan: "best-jordan-finds",
        moncler: "best-moncler-finds",
        stussy: "best-stussy-finds",
        corteiz: "best-corteiz-finds",
      }[brand.slug];
      if (collectionSlug) {
        items.push({
          label: `Best ${brand.name} Finds`,
          href: `/collections/${collectionSlug}`,
          type: "collection",
          keywords: `best ${brand.name} finds litbuy`.toLowerCase(),
          priority: 94 + boost,
        });
      }
      if (brand.slug === "nike") {
        items.push({
          label: "Nike Under $50",
          href: "/collections/best-under-50",
          type: "collection",
          keywords: "nike under 50 budget",
          priority: 86,
        });
      }
    }
  }

  for (const cat of getCategories().filter((c) => c.group === "category")) {
    items.push({
      label: cat.name,
      href: cat.href,
      type: "category",
      keywords: `${cat.name} ${cat.slug}`.toLowerCase(),
      priority: 60 + Math.min(cat.count ?? 0, 20),
    });
  }

  for (const slug of SHARE_COLLECTION_SLUGS) {
    const page = SHARE_COLLECTIONS[slug];
    items.push({
      label: page.h1,
      href: page.path,
      type: "collection",
      keywords: `${page.h1} ${page.slug} collection litbuy finds`.toLowerCase(),
      priority: slug.includes("best-nike") || slug.includes("best-moncler") ? 88 : 78,
    });
  }

  for (const slug of BEST_OF_SLUGS) {
    const page = BEST_OF_PAGES[slug];
    items.push({
      label: page.h1,
      href: page.path,
      type: "best-of",
      keywords: `${page.h1} ${page.slug} best finds litbuy`.toLowerCase(),
      priority: slug.includes("best-finds") ? 85 : 75,
    });
  }

  for (const slug of SEO_LANDING_SLUGS) {
    const page = SEO_LANDING_PAGES[slug];
    items.push({
      label: page.title,
      href: page.path,
      type: "landing",
      keywords: `${page.title} ${page.slug} litbuy`.toLowerCase(),
      priority: 72,
    });
  }

  for (const slug of getPublishedSeoLandingSlugs()) {
    if (items.some((item) => item.href === `/${slug}`)) continue;
    items.push({
      label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: `/${slug}`,
      type: "landing",
      keywords: `${slug} litbuy finds`.toLowerCase(),
      priority: 80,
    });
  }

  for (const guide of Object.values(GUIDE_PAGES)) {
    items.push({
      label: guide.title,
      href: guide.path,
      type: "guide",
      keywords: `${guide.title} ${guide.h1} guide litbuy`.toLowerCase(),
      priority: 55,
    });
  }

  for (const bag of GENERIC_BAG_SUGGESTIONS) {
    items.push({
      label: bag.label,
      href: bag.href ?? `/?q=${encodeURIComponent(bag.query)}#browse`,
      type: "product-type",
      keywords: bag.query.toLowerCase(),
      priority: bag.priority,
    });
  }

  const trendingIds = new Set(
    getTrendingProducts().slice(0, 20).map((product) => product.id)
  );
  for (const product of products) {
    if (!trendingIds.has(product.id)) continue;
    items.push({
      label: product.product_name.slice(0, 48),
      href: getProductHref(product),
      type: "query",
      keywords: product.product_name.toLowerCase(),
      priority: 65,
    });
  }

  return items;
}

let cachedIndex: SearchSuggestion[] | null = null;

export function getSearchIndex(): SearchSuggestion[] {
  if (!cachedIndex) {
    cachedIndex = buildIndex();
  }
  return cachedIndex;
}

export function getSearchSuggestions(query: string, limit = 12): SearchSuggestionGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return getDefaultSuggestionGroups();
  }

  const matches = getSearchIndex()
    .filter((item) => item.keywords.includes(q) || item.label.toLowerCase().includes(q))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit * 2);

  const groups: Record<string, SearchSuggestion[]> = {
    brands: [],
    categories: [],
    collections: [],
    "best-of": [],
    guides: [],
    trending: [],
  };

  for (const item of matches) {
    if (item.type === "brand" && groups.brands.length < 5) groups.brands.push(item);
    else if (item.type === "category" && groups.categories.length < 4) groups.categories.push(item);
    else if (item.type === "collection" && groups.collections.length < 4)
      groups.collections.push(item);
    else if (item.type === "best-of" && groups["best-of"].length < 4) groups["best-of"].push(item);
    else if ((item.type === "guide" || item.type === "landing") && groups.guides.length < 4)
      groups.guides.push(item);
    else if (groups.trending.length < 4) groups.trending.push(item);
  }

  const result: SearchSuggestionGroup[] = [];
  if (groups.brands.length)
    result.push({ id: "brands", label: "Brands", icon: "🏷", items: groups.brands });
  if (groups.categories.length)
    result.push({ id: "categories", label: "Categories", icon: "📂", items: groups.categories });
  if (groups.collections.length)
    result.push({ id: "collections", label: "Collections", icon: "📁", items: groups.collections });
  if (groups["best-of"].length)
    result.push({ id: "best-of", label: "Best of", icon: "⭐", items: groups["best-of"] });
  if (groups.guides.length)
    result.push({ id: "guides", label: "Guides", icon: "📖", items: groups.guides });
  if (groups.trending.length)
    result.push({ id: "trending", label: "Trending", icon: "🔥", items: groups.trending });

  return result.slice(0, 5);
}

function getDefaultSuggestionGroups(): SearchSuggestionGroup[] {
  const index = getSearchIndex();
  const popular = index
    .filter((i) => i.priority >= 95)
    .slice(0, 6);
  const trending = index
    .filter((i) => i.type === "best-of" || i.type === "brand")
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6);
  const brands = index.filter((i) => i.type === "brand" && !i.label.includes(" ")).slice(0, 8);
  const categories = index.filter((i) => i.type === "category").slice(0, 6);

  return [
    { id: "popular", label: "Popular searches", icon: "🔥", items: popular },
    { id: "trending", label: "Trending searches", icon: "⭐", items: trending },
    { id: "brands", label: "Brands", icon: "🏷", items: brands },
    { id: "categories", label: "Categories", icon: "📂", items: categories },
  ].filter((g) => g.items.length > 0);
}
