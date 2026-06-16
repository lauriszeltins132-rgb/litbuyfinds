import { extractBrand, getBrandsFromProducts } from "./brands";
import { getEditorsPicks } from "./discovery";
import { getEngagementPicks } from "./engagement-picks";
import { getMonthlyHighlights } from "./popular-picks";
import { filterFeaturedEligible } from "./product-media";
import { hasExactPrice } from "./pricing";
import { getAllProducts, getDealProducts, getTrendingProducts } from "./products";
import type { Product } from "./types";

export type BestOfPageConfig = {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  badge: string;
  h1: string;
  intro: string;
  getProducts: () => Product[];
  relatedBrandSlugs: string[];
  relatedCategorySlugs: string[];
  relatedGuideHrefs: { href: string; label: string }[];
  relatedBestOfHrefs: { href: string; label: string }[];
  faqs: { question: string; answer: string }[];
};

function priced(items: Product[]) {
  return items.filter((p) => hasExactPrice(p.price));
}

function byMaxPrice(max: number) {
  return filterFeaturedEligible(priced(getAllProducts().filter((p) => p.price! <= max))).slice(
    0,
    96
  );
}

function byCategory(...slugs: string[]) {
  return filterFeaturedEligible(
    priced(getAllProducts().filter((p) => slugs.includes(p.category_slug)))
  ).slice(0, 96);
}

function withQc() {
  return filterFeaturedEligible(
    priced(getAllProducts().filter((p) => p.qc_link))
  ).slice(0, 96);
}

const GUIDE_CLUSTER = [
  { href: "/litbuy-guide", label: "LitBuy guide" },
  { href: "/litbuy-qc", label: "LitBuy QC guide" },
  { href: "/how-to-buy", label: "How to buy" },
];

export const BEST_OF_PAGES: Record<string, BestOfPageConfig> = {
  "best-finds": {
    slug: "best-finds",
    path: "/best-finds",
    title: "Best LitBuy Finds",
    metaDescription:
      "Discover the best LitBuy finds including sneakers, hoodies, jackets, bags and QC-approved products — updated daily from the catalog.",
    badge: "Best of",
    h1: "Best LitBuy finds",
    intro:
      "Editor-ranked picks from the LitBuy Finds catalog — combining QC availability, photos, engagement, and verified buy links. Refreshed daily.",
    getProducts: () => getEditorsPicks(96),
    relatedBrandSlugs: ["nike", "jordan", "moncler", "adidas"],
    relatedCategorySlugs: ["shoes", "coats-and-jackets", "hoodies-and-pants"],
    relatedGuideHrefs: [
      { href: "/best-litbuy-finds", label: "Best finds guide" },
      ...GUIDE_CLUSTER,
    ],
    relatedBestOfHrefs: [
      { href: "/best-finds-this-week", label: "This week" },
      { href: "/best-qc-items", label: "QC items" },
    ],
    faqs: [
      {
        question: "How are best finds ranked?",
        answer:
          "Products are scored on QC links, image quality, engagement, and premium brand weighting — then rotated daily.",
      },
      {
        question: "Do prices change?",
        answer: "Confirm live LitBuy prices at checkout. Catalog prices sync daily.",
      },
    ],
  },

  "best-finds-this-week": {
    slug: "best-finds-this-week",
    path: "/best-finds-this-week",
    title: "Best LitBuy Finds This Week",
    metaDescription:
      "Best LitBuy finds this week — trending sneakers, jackets, hoodies and streetwear with verified links.",
    badge: "This week",
    h1: "Best finds this week",
    intro:
      "Trending picks from the last seven days across sneakers, outerwear, and streetwear — ranked from catalog and engagement signals.",
    getProducts: () =>
      filterFeaturedEligible(priced(getTrendingProducts())).slice(0, 96),
    relatedBrandSlugs: ["nike", "jordan", "stone-island", "supreme"],
    relatedCategorySlugs: ["shoes", "hoodies-and-pants"],
    relatedGuideHrefs: GUIDE_CLUSTER,
    relatedBestOfHrefs: [
      { href: "/best-finds", label: "All best finds" },
      { href: "/best-finds-this-month", label: "This month" },
    ],
    faqs: [
      {
        question: "How often does this list update?",
        answer: "The grid refreshes daily with catalog sync and trending rotation.",
      },
    ],
  },

  "best-finds-this-month": {
    slug: "best-finds-this-month",
    path: "/best-finds-this-month",
    title: "Best LitBuy Finds This Month",
    metaDescription:
      "Best LitBuy finds this month — standout sneakers, jackets, bags and accessories from the last 30 days.",
    badge: "This month",
    h1: "Best finds this month",
    intro:
      "Monthly highlights combining recency, QC, and community clicks — ideal for building a haul or sharing with friends.",
    getProducts: () => getMonthlyHighlights(96),
    relatedBrandSlugs: ["nike", "moncler", "louis-vuitton", "gucci"],
    relatedCategorySlugs: ["shoes", "accessories", "coats-and-jackets"],
    relatedGuideHrefs: GUIDE_CLUSTER,
    relatedBestOfHrefs: [
      { href: "/best-finds-this-week", label: "This week" },
      { href: "/best-finds", label: "All best finds" },
    ],
    faqs: [],
  },

  "best-under-20": {
    slug: "best-under-20",
    path: "/best-under-20",
    title: "Best LitBuy Finds Under $20",
    metaDescription:
      "Best LitBuy finds under $20 — budget sneakers, tees, accessories and low-risk haul fillers.",
    badge: "Under $20",
    h1: "Best finds under $20",
    intro:
      "Low-cost picks under $20 for first hauls or filling shipping weight — all with verified LitBuy links.",
    getProducts: () => byMaxPrice(20),
    relatedBrandSlugs: ["nike", "adidas", "supreme"],
    relatedCategorySlugs: ["accessories", "tshirts-and-shorts"],
    relatedGuideHrefs: GUIDE_CLUSTER,
    relatedBestOfHrefs: [
      { href: "/best-under-30", label: "Under $30" },
      { href: "/best-under-50", label: "Under $50" },
    ],
    faqs: [
      {
        question: "Are under-$20 finds good quality?",
        answer:
          "Budget items vary by seller. Check QC references and reviews before shipping internationally.",
      },
    ],
  },

  "best-under-30": {
    slug: "best-under-30",
    path: "/best-under-30",
    title: "Best LitBuy Finds Under $30",
    metaDescription:
      "Best LitBuy finds under $30 including sneakers, hoodies, jackets and accessories — updated daily.",
    badge: "Under $30",
    h1: "Best finds under $30",
    intro:
      "Affordable finds under $30 that still look premium — perfect for budget hauls and everyday rotation pieces.",
    getProducts: () => getDealProducts(30).filter((p) => hasExactPrice(p.price)).slice(0, 96),
    relatedBrandSlugs: ["nike", "adidas", "new-balance"],
    relatedCategorySlugs: ["hoodies-and-pants", "shoes"],
    relatedGuideHrefs: GUIDE_CLUSTER,
    relatedBestOfHrefs: [
      { href: "/best-under-20", label: "Under $20" },
      { href: "/best-under-50", label: "Under $50" },
    ],
    faqs: [],
  },

  "best-under-50": {
    slug: "best-under-50",
    path: "/best-under-50",
    title: "Best LitBuy Finds Under $50",
    metaDescription:
      "Discover the best LitBuy finds under $50 including sneakers, hoodies, jackets, bags and QC-approved products.",
    badge: "Under $50",
    h1: "Best finds under $50",
    intro:
      "The sweet spot for many buyers — sneakers, hoodies, and accessories under $50 with QC references where available.",
    getProducts: () => byMaxPrice(50),
    relatedBrandSlugs: ["nike", "jordan", "asics"],
    relatedCategorySlugs: ["shoes", "hoodies-and-pants", "accessories"],
    relatedGuideHrefs: GUIDE_CLUSTER,
    relatedBestOfHrefs: [
      { href: "/best-under-30", label: "Under $30" },
      { href: "/best-under-100", label: "Under $100" },
    ],
    faqs: [
      {
        question: "What are the best under-$50 sneakers?",
        answer: "Check the product grid below — Nike, Adidas, and New Balance styles rotate daily.",
      },
    ],
  },

  "best-under-100": {
    slug: "best-under-100",
    path: "/best-under-100",
    title: "Best LitBuy Finds Under $100",
    metaDescription:
      "Best LitBuy finds under $100 — sneakers, jackets, bags and designer picks with verified links.",
    badge: "Under $100",
    h1: "Best finds under $100",
    intro:
      "Mid-range finds under $100 including sneakers, outerwear, and bags — balanced value before shipping.",
    getProducts: () => byMaxPrice(100),
    relatedBrandSlugs: ["moncler", "nike", "jordan", "gucci"],
    relatedCategorySlugs: ["shoes", "coats-and-jackets", "accessories"],
    relatedGuideHrefs: GUIDE_CLUSTER,
    relatedBestOfHrefs: [
      { href: "/best-under-50", label: "Under $50" },
      { href: "/best-jackets", label: "Best jackets" },
    ],
    faqs: [],
  },

  "best-sneakers": {
    slug: "best-sneakers",
    path: "/best-sneakers",
    title: "Best LitBuy Sneakers",
    metaDescription:
      "Best LitBuy sneakers — Nike, Jordan, Adidas, New Balance and more with QC links and verified buy buttons.",
    badge: "Sneakers",
    h1: "Best sneakers",
    intro:
      "Top sneaker finds from the LitBuy catalog — Dunks, Jordans, Campus styles, and runners with daily updates.",
    getProducts: () => byCategory("shoes"),
    relatedBrandSlugs: ["nike", "jordan", "adidas", "new-balance", "asics"],
    relatedCategorySlugs: ["shoes"],
    relatedGuideHrefs: [
      { href: "/litbuy-sneakers", label: "LitBuy sneakers guide" },
      ...GUIDE_CLUSTER,
    ],
    relatedBestOfHrefs: [
      { href: "/best-under-50", label: "Sneakers under $50" },
      { href: "/best-qc-items", label: "QC sneakers" },
    ],
    faqs: [
      {
        question: "Which sneaker brands are most popular?",
        answer: "Nike, Jordan, and Adidas lead searches. Use brand pages for focused browsing.",
      },
    ],
  },

  "best-jackets": {
    slug: "best-jackets",
    path: "/best-jackets",
    title: "Best LitBuy Jackets",
    metaDescription:
      "Best LitBuy jackets — Moncler, puffers, shells and streetwear outerwear with QC-approved listings.",
    badge: "Jackets",
    h1: "Best jackets",
    intro:
      "Outerwear picks including puffers, shells, and designer jackets — always QC before shipping heavy items.",
    getProducts: () => byCategory("coats-and-jackets"),
    relatedBrandSlugs: ["moncler", "canada-goose", "arcteryx", "stone-island"],
    relatedCategorySlugs: ["coats-and-jackets"],
    relatedGuideHrefs: [
      { href: "/litbuy-jackets", label: "LitBuy jackets guide" },
      ...GUIDE_CLUSTER,
    ],
    relatedBestOfHrefs: [
      { href: "/best-under-100", label: "Under $100" },
      { href: "/best-qc-items", label: "QC outerwear" },
    ],
    faqs: [],
  },

  "best-hoodies": {
    slug: "best-hoodies",
    path: "/best-hoodies",
    title: "Best LitBuy Hoodies",
    metaDescription:
      "Best LitBuy hoodies and streetwear layers — Supreme, Nike tech, and graphic hoodies with verified links.",
    badge: "Hoodies",
    h1: "Best hoodies",
    intro:
      "Hoodies, crewnecks, and sweatshirt layers from across the catalog — filter by brand on each product page.",
    getProducts: () => byCategory("hoodies-and-pants"),
    relatedBrandSlugs: ["supreme", "nike", "stussy", "bape"],
    relatedCategorySlugs: ["hoodies-and-pants"],
    relatedGuideHrefs: GUIDE_CLUSTER,
    relatedBestOfHrefs: [
      { href: "/best-under-50", label: "Under $50" },
      { href: "/best-finds", label: "All best finds" },
    ],
    faqs: [],
  },

  "best-bags": {
    slug: "best-bags",
    path: "/best-bags",
    title: "Best LitBuy Bags",
    metaDescription:
      "Best LitBuy bags — designer handbags, crossbody, travel bags and backpacks with verified agent links.",
    badge: "Bags",
    h1: "Best bags",
    intro:
      "Designer and streetwear bags from Louis Vuitton, Gucci, Goyard, and more — QC hardware before you ship.",
    getProducts: () =>
      filterFeaturedEligible(
        priced(
          getAllProducts().filter(
            (p) =>
              p.category_slug === "accessories" &&
              /bag|tote|crossbody|backpack|keepall|speedy|neverfull/i.test(
                p.product_name
              )
          )
        )
      ).slice(0, 96),
    relatedBrandSlugs: ["louis-vuitton", "gucci", "goyard", "dior"],
    relatedCategorySlugs: ["accessories"],
    relatedGuideHrefs: [
      { href: "/best-litbuy-bags-2026", label: "Bags 2026" },
      ...GUIDE_CLUSTER,
    ],
    relatedBestOfHrefs: [
      { href: "/best-accessories", label: "All accessories" },
      { href: "/best-qc-items", label: "QC bags" },
    ],
    faqs: [],
  },

  "best-accessories": {
    slug: "best-accessories",
    path: "/best-accessories",
    title: "Best LitBuy Accessories",
    metaDescription:
      "Best LitBuy accessories — hats, belts, glasses, jewelry and streetwear add-ons with verified links.",
    badge: "Accessories",
    h1: "Best accessories",
    intro:
      "Hats, belts, eyewear, and small pieces that complete a fit — great for filling out a haul under weight limits.",
    getProducts: () => byCategory("accessories"),
    relatedBrandSlugs: ["gucci", "louis-vuitton", "chrome-hearts"],
    relatedCategorySlugs: ["accessories"],
    relatedGuideHrefs: GUIDE_CLUSTER,
    relatedBestOfHrefs: [
      { href: "/best-bags", label: "Best bags" },
      { href: "/best-under-30", label: "Under $30" },
    ],
    faqs: [],
  },

  "best-qc-items": {
    slug: "best-qc-items",
    path: "/best-qc-items",
    title: "Best QC Approved LitBuy Finds",
    metaDescription:
      "Best QC-approved LitBuy finds — sneakers, jackets, bags with reference photos and warehouse QC tips.",
    badge: "QC approved",
    h1: "Best QC items",
    intro:
      "Products with QC reference links — the safest lane for international shipping when you review photos carefully.",
    getProducts: withQc,
    relatedBrandSlugs: ["nike", "jordan", "moncler", "louis-vuitton"],
    relatedCategorySlugs: ["shoes", "coats-and-jackets", "accessories"],
    relatedGuideHrefs: [
      { href: "/litbuy-qc", label: "LitBuy QC guide" },
      { href: "/guides/how-to-check-qc-photos", label: "How to check QC" },
    ],
    relatedBestOfHrefs: [
      { href: "/best-sneakers", label: "Best sneakers" },
      { href: "/best-jackets", label: "Best jackets" },
    ],
    faqs: [
      {
        question: "Does QC-approved mean warehouse photos?",
        answer:
          "Reference QC on find pages is from community examples. Request warehouse QC on LitBuy after purchase.",
      },
    ],
  },
};

export const BEST_OF_SLUGS = Object.keys(BEST_OF_PAGES);

export function getBestOfPage(slug: string): BestOfPageConfig | undefined {
  return BEST_OF_PAGES[slug];
}

export function getBestOfBrands(config: BestOfPageConfig) {
  const all = getBrandsFromProducts(getAllProducts());
  return config.relatedBrandSlugs
    .map((slug) => all.find((b) => b.slug === slug))
    .filter((b): b is NonNullable<typeof b> => !!b);
}

export function getBestOfCategories(config: BestOfPageConfig) {
  const products = getAllProducts();
  return config.relatedCategorySlugs.map((slug) => {
    const count = products.filter((p) => p.category_slug === slug).length;
    const name =
      slug === "shoes"
        ? "Shoes"
        : slug === "coats-and-jackets"
          ? "Coats & Jackets"
          : slug === "hoodies-and-pants"
            ? "Hoodies & Pants"
            : slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
    return { slug, name, href: `/categories/${slug}`, count };
  });
}

export function getBestOfSupplementaryRails(config: BestOfPageConfig) {
  const mainIds = new Set(config.getProducts().slice(0, 24).map((p) => p.id));
  const used = new Set(mainIds);

  const recentlyAdded = getAllProducts()
    .filter((p) => !used.has(p.id) && hasExactPrice(p.price) && p.image)
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 12);
  recentlyAdded.forEach((p) => used.add(p.id));

  const popularWeek = getTrendingProducts()
    .filter((p) => !used.has(p.id))
    .slice(0, 12);

  const mostSaved = getEngagementPicks(12).filter((p) => !used.has(p.id));

  return { recentlyAdded, popularWeek, mostSaved };
}

export function getContextualBestOfLinks(context: {
  categorySlug?: string;
  brandSlug?: string;
  maxPrice?: number;
}): { href: string; label: string }[] {
  const links: { href: string; label: string }[] = [
    { href: "/best-finds", label: "Best Finds" },
  ];

  if (context.categorySlug === "shoes" || context.brandSlug === "nike" || context.brandSlug === "jordan") {
    links.push({ href: "/best-sneakers", label: "Best Sneakers" });
  }
  if (context.categorySlug === "coats-and-jackets" || context.brandSlug === "moncler") {
    links.push({ href: "/best-jackets", label: "Best Jackets" });
  }
  if (context.categorySlug === "hoodies-and-pants") {
    links.push({ href: "/best-hoodies", label: "Best Hoodies" });
  }
  if (context.categorySlug === "accessories") {
    links.push({ href: "/best-bags", label: "Best Bags" });
  }

  if (context.maxPrice !== undefined && context.maxPrice <= 50) {
    links.push({ href: "/best-under-50", label: "Best Under $50" });
  } else {
    links.push({ href: "/best-under-50", label: "Best Under $50" });
  }

  links.push({ href: "/best-qc-items", label: "Best QC Items" });
  links.push({ href: "/best-finds-this-week", label: "Best This Week" });

  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}
