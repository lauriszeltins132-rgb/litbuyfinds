import { extractBrand } from "./brands";
import { filterFeaturedEligible } from "./product-media";
import { hasExactPrice } from "./pricing";
import { getAllProducts } from "./products";
import type { Product } from "./types";

export type SeoListConfig = {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  badge: string;
  h1: string;
  intro: string;
  getProducts: () => Product[];
  relatedLinks: { href: string; label: string }[];
  clusterLinks?: { href: string; label: string }[];
};

function sortByQuality(items: Product[]): Product[] {
  return [...items].sort((a, b) => {
    const aScore = (a.qc_link ? 2 : 0) + (a.image ? 1 : 0);
    const bScore = (b.qc_link ? 2 : 0) + (b.image ? 1 : 0);
    return bScore - aScore;
  });
}

function priced(items: Product[]): Product[] {
  return items.filter((p) => hasExactPrice(p.price));
}

function byBrand(name: string): Product[] {
  return priced(
    getAllProducts().filter(
      (p) => extractBrand(p.product_name)?.toLowerCase() === name.toLowerCase()
    )
  );
}

function byMaxPrice(max: number): Product[] {
  return priced(
    getAllProducts().filter((p) => p.price !== null && p.price <= max)
  );
}

const CLUSTER_BUYING = [
  { href: "/guides/how-to-order", label: "How to order" },
  { href: "/guides/shipping-and-hauls", label: "Shipping guide" },
  { href: "/guides/what-is-a-shopping-agent", label: "Agent guide" },
  { href: "/guides/how-to-check-qc-photos", label: "QC guide" },
];

const CLUSTER_SNEAKERS = [
  { href: "/top-nike-finds", label: "Top Nike finds" },
  { href: "/brands/jordan", label: "Jordan finds" },
  { href: "/brands/yeezy", label: "Yeezy finds" },
  { href: "/top-rep-sneakers", label: "Top rep sneakers" },
];

const CLUSTER_FASHION = [
  { href: "/categories/hoodies-and-pants", label: "Hoodies" },
  { href: "/categories/coats-and-jackets", label: "Jackets" },
  { href: "/top-designer-bags", label: "Designer bags" },
];

export const TOP_LISTS: Record<string, SeoListConfig> = {
  "top-rep-sneakers": {
    slug: "top-rep-sneakers",
    path: "/top-rep-sneakers",
    title: "Top Rep Sneakers on LitBuy Finds",
    metaDescription:
      "Browse top rep sneakers on LitBuy Finds — Nike, Jordan, Adidas, New Balance and more with verified buy links and QC references.",
    badge: "Top list",
    h1: "Top rep sneakers",
    intro:
      "Sneaker picks ranked from the LitBuy Finds catalog. Every listing links to LitBuy — confirm size and latest price before you buy.",
    getProducts: () =>
      sortByQuality(
        filterFeaturedEligible(
          priced(
            getAllProducts().filter(
              (p) =>
                p.category_slug === "shoes" ||
                /sneaker|dunk|jordan|yeezy|trainer|runner/i.test(p.product_name)
            )
          )
        )
      ).slice(0, 96),
    relatedLinks: [
      { href: "/trending", label: "Trending" },
      { href: "/brands/nike", label: "Nike finds" },
      { href: "/recently-added", label: "Recently added" },
    ],
    clusterLinks: CLUSTER_SNEAKERS,
  },
  "top-nike-finds": {
    slug: "top-nike-finds",
    path: "/top-nike-finds",
    title: "Top Nike Finds on LitBuy",
    metaDescription:
      "Best Nike finds on LitBuy — Dunks, Air Max, Travis Scott collabs and more with photos, QC links, and agent buy buttons.",
    badge: "Top list",
    h1: "Top Nike finds",
    intro:
      "Nike-heavy picks from the catalog, sorted for photos and QC availability. Prices come from the source sheet — always double-check on LitBuy.",
    getProducts: () => sortByQuality(filterFeaturedEligible(byBrand("Nike"))).slice(0, 72),
    relatedLinks: [
      { href: "/brands/nike", label: "All Nike" },
      { href: "/top-rep-sneakers", label: "Top sneakers" },
      { href: "/nike-vs-adidas-finds", label: "Nike vs Adidas" },
    ],
    clusterLinks: CLUSTER_SNEAKERS,
  },
  "top-designer-bags": {
    slug: "top-designer-bags",
    path: "/top-designer-bags",
    title: "Top Designer Bag Finds",
    metaDescription:
      "Designer bag finds on LitBuy — Louis Vuitton, Gucci, Dior, Goyard and more with verified agent links.",
    badge: "Top list",
    h1: "Top designer bag finds",
    intro:
      "Handbags and crossbody picks from designer labels in the catalog. Higher price points mean QC matters even more here.",
    getProducts: () =>
      sortByQuality(
        filterFeaturedEligible(
          priced(
            getAllProducts().filter((p) =>
              /bag|crossbody|keepall|speedy|neverfull|birkin|purse|tote/i.test(
                p.product_name
              )
            )
          )
        )
      ).slice(0, 72),
    relatedLinks: [
      { href: "/best-bag-brands-on-litbuy", label: "Best bag brands" },
      { href: "/top-louis-vuitton-finds", label: "Louis Vuitton" },
      { href: "/top-gucci-finds", label: "Gucci finds" },
    ],
    clusterLinks: CLUSTER_FASHION,
  },
  "top-budget-finds": {
    slug: "top-budget-finds",
    path: "/top-budget-finds",
    title: "Top Budget Finds Under $30",
    metaDescription:
      "Best budget finds on LitBuy under $30 — affordable sneakers, tees, and accessories worth adding to a haul.",
    badge: "Budget",
    h1: "Top budget finds",
    intro:
      "Low-risk adds for building your first haul. These stay under $30 in the catalog data — confirm the live LitBuy price at checkout.",
    getProducts: () => sortByQuality(filterFeaturedEligible(byMaxPrice(30))).slice(0, 96),
    relatedLinks: [
      { href: "/deals", label: "Deals page" },
      { href: "/top-products-under-20", label: "Under $20" },
      { href: "/best-budget-finds", label: "Budget guide" },
    ],
    clusterLinks: CLUSTER_BUYING,
  },
  "top-streetwear-finds": {
    slug: "top-streetwear-finds",
    path: "/top-streetwear-finds",
    title: "Top Streetwear Finds on LitBuy",
    metaDescription:
      "Streetwear finds — hoodies, tees, jackets and pants from Supreme, Essentials, Chrome Hearts and more.",
    badge: "Top list",
    h1: "Top streetwear finds",
    intro:
      "Streetwear-heavy picks across hoodies, tees, and outerwear. Good starting point if you are building a casual haul.",
    getProducts: () =>
      sortByQuality(
        filterFeaturedEligible(
          priced(
            getAllProducts().filter((p) =>
              ["hoodies-and-pants", "tshirts-and-shorts", "coats-and-jackets"].includes(
                p.category_slug
              )
            )
          )
        )
      ).slice(0, 96),
    relatedLinks: [
      { href: "/categories/hoodies-and-pants", label: "Hoodies" },
      { href: "/trending", label: "Trending" },
      { href: "/brands/supreme", label: "Supreme" },
    ],
    clusterLinks: CLUSTER_FASHION,
  },
  "top-products-under-20": {
    slug: "top-products-under-20",
    path: "/top-products-under-20",
    title: "Top Products Under $20",
    metaDescription:
      "LitBuy finds under $20 — cheap test picks and budget accessories with verified agent links.",
    badge: "Under $20",
    h1: "Top products under $20",
    intro:
      "The cheapest verified-price listings in the catalog. Ideal for a first test order or filling out a haul on a tight budget.",
    getProducts: () => sortByQuality(filterFeaturedEligible(byMaxPrice(20))).slice(0, 96),
    relatedLinks: [
      { href: "/top-products-under-50", label: "Under $50" },
      { href: "/top-budget-finds", label: "Budget finds" },
    ],
    clusterLinks: CLUSTER_BUYING,
  },
  "top-products-under-50": {
    slug: "top-products-under-50",
    path: "/top-products-under-50",
    title: "Top Products Under $50",
    metaDescription:
      "Best LitBuy finds under $50 — mid-budget sneakers, streetwear, and accessories.",
    badge: "Under $50",
    h1: "Top products under $50",
    intro:
      "Solid value zone for most categories. Plenty of shoes and apparel land here without going premium-tier.",
    getProducts: () => sortByQuality(filterFeaturedEligible(byMaxPrice(50))).slice(0, 96),
    relatedLinks: [
      { href: "/top-products-under-20", label: "Under $20" },
      { href: "/top-products-under-100", label: "Under $100" },
    ],
    clusterLinks: CLUSTER_BUYING,
  },
  "top-products-under-100": {
    slug: "top-products-under-100",
    path: "/top-products-under-100",
    title: "Top Products Under $100",
    metaDescription:
      "LitBuy finds under $100 — premium-ish picks that still stay below triple digits in catalog pricing.",
    badge: "Under $100",
    h1: "Top products under $100",
    intro:
      "Higher-quality batches and heavier pieces often land under $100 in the sheet. Always confirm live pricing on LitBuy before checkout.",
    getProducts: () => sortByQuality(filterFeaturedEligible(byMaxPrice(100))).slice(0, 96),
    relatedLinks: [
      { href: "/top-products-under-50", label: "Under $50" },
      { href: "/top-designer-bags", label: "Designer bags" },
    ],
    clusterLinks: CLUSTER_FASHION,
  },
  "top-louis-vuitton-finds": {
    slug: "top-louis-vuitton-finds",
    path: "/top-louis-vuitton-finds",
    title: "Top Louis Vuitton Finds",
    metaDescription:
      "Best Louis Vuitton finds on LitBuy — bags, belts, wallets and accessories with QC links where available.",
    badge: "Designer",
    h1: "Top Louis Vuitton finds",
    intro:
      "LV picks from the catalog with verified LitBuy links. Designer items deserve extra QC time — use reference photos before shipping.",
    getProducts: () =>
      sortByQuality(filterFeaturedEligible(byBrand("Louis Vuitton"))).slice(0, 72),
    relatedLinks: [
      { href: "/brands/louis-vuitton", label: "All LV" },
      { href: "/top-gucci-finds", label: "Gucci finds" },
      { href: "/top-designer-bags", label: "Designer bags" },
    ],
    clusterLinks: CLUSTER_FASHION,
  },
  "top-gucci-finds": {
    slug: "top-gucci-finds",
    path: "/top-gucci-finds",
    title: "Top Gucci Finds on LitBuy",
    metaDescription:
      "Top Gucci finds — bags, belts, sneakers and apparel from the LitBuy Finds catalog.",
    badge: "Designer",
    h1: "Top Gucci finds",
    intro:
      "Gucci-labeled listings sorted for photos and QC. Compare a few batches before committing on higher-ticket pieces.",
    getProducts: () => sortByQuality(filterFeaturedEligible(byBrand("Gucci"))).slice(0, 72),
    relatedLinks: [
      { href: "/brands/gucci", label: "All Gucci" },
      { href: "/top-louis-vuitton-finds", label: "Louis Vuitton" },
      { href: "/top-designer-bags", label: "Designer bags" },
    ],
    clusterLinks: CLUSTER_FASHION,
  },
};

export const TOP_LIST_SLUGS = Object.keys(TOP_LISTS);
