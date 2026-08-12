import { PUBLIC_CATALOG_COUNT } from "./catalog-count-public";
import { } from "./constants";
import {
  getDailyFindsTitle,
  getWeeklyFindsTitle,
  type ContentFreshnessVariant,
} from "./freshness-dates";
import { getHomepageRails } from "./homepage-rails";
import { resolveProductsFromFilter } from "./seo-landing-engine";
import type { Product } from "./types";
import { CATEGORY_FINDS_LINKS } from "./seo-internal-links";

export const FINDS_HUB_PATH = "/finds";

export const FINDS_HUB_METADATA = {
  title: "LitBuy Finds - Best Rep Sneakers, Clothing Finds & QC Photos",
  description:
    `Discover ${PUBLIC_CATALOG_COUNT} curated rep finds with QC photos, LitBuy spreadsheet discovery, clothing and sneaker databases, and verified agent links — updated weekly.`,
  h1: "LitBuy Finds",
  directAnswer:
    "Discover thousands of curated rep finds with QC photos, spreadsheet-synced listings, and verified agent links.",
  badge: "Finds hub",
} as const;

export const FINDS_HUB_FAQS = [
  {
    question: "What are LitBuy Finds?",
    answer:
      "LitBuy Finds is a searchable catalog of rep products from Weidian and Taobao — each listing includes photos, prices, QC references where available, and verified agent buy links.",
  },
  {
    question: "How is LitBuy Finds different from a LitBuy spreadsheet?",
    answer:
      "A LitBuy spreadsheet is a long list of product rows. LitBuy Finds indexes that universe into searchable pages with category filters, brand hubs, QC badges, and shareable URLs.",
  },
  {
    question: "How often are finds updated?",
    answer:
      "The catalog syncs weekly from spreadsheet imports. New products appear in Latest Finds and Trending sections after each sync.",
  },
  {
    question: "Can I browse by brand or category?",
    answer:
      "Yes. Use Clothing finds, Sneaker finds, Hoodie finds, and Jacket finds — or search brands like Nike, Jordan, Moncler, and Stussy from the homepage.",
  },
  {
    question: "Where do QC photos come from?",
    answer:
      "Reference QC links on product pages show batch examples from other buyers. Warehouse QC is requested per order on LitBuy after purchase.",
  },
] as const;

export type FindsHubSection = {
  id: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  freshness?: ContentFreshnessVariant;
  getProducts: () => Product[];
};

export function getFindsHubSections(): FindsHubSection[] {
  const rails = getHomepageRails(12);

  return [
    {
      id: "latest",
      title: "Latest finds",
      description: "Newest catalog additions synced from community spreadsheets — fresh drops land here first.",
      href: "/latest-finds",
      linkLabel: "All latest finds →",
      freshness: "latest-updated",
      getProducts: () => rails.latestFinds,
    },
    {
      id: "daily",
      title: getDailyFindsTitle(),
      description: "What buyers are clicking today — engagement-weighted picks with verified photos and prices.",
      href: "/trending-today",
      linkLabel: "All daily finds →",
      freshness: "updated-daily",
      getProducts: () => rails.popularToday,
    },
    {
      id: "weekly",
      title: getWeeklyFindsTitle(),
      description: "Momentum picks from the past week — sneakers, outerwear, and streetwear with verified links.",
      href: "/trending-this-week",
      linkLabel: "All weekly finds →",
      freshness: "updated-weekly",
      getProducts: () => rails.popularWeek,
    },
    {
      id: "trending",
      title: "Trending finds",
      description: "Browse the full trending hub for daily and weekly rotation pages.",
      href: "/trending",
      linkLabel: "Trending hub →",
      getProducts: () => rails.popularToday,
    },
    {
      id: "sneakers",
      title: "Sneaker finds",
      description: "Nike, Jordan, Adidas, and designer runners with QC references and agent links.",
      href: "/sneaker-finds",
      linkLabel: "All sneaker finds →",
      getProducts: () =>
        resolveProductsFromFilter({ categories: ["shoes"] }, 12),
    },
    {
      id: "clothing",
      title: "Clothing finds",
      description: "Hoodies, tees, pants, and everyday fashion layers from streetwear and designer labels.",
      href: "/clothing-finds",
      linkLabel: "All clothing finds →",
      getProducts: () =>
        resolveProductsFromFilter(
          {
            categories: ["hoodies-and-pants", "tshirts-and-shorts"],
          },
          12
        ),
    },
    {
      id: "designer",
      title: "Designer finds",
      description: "Moncler, Prada, Louis Vuitton, Gucci, and Chrome Hearts-style picks with QC history.",
      href: "/best-rep-finds",
      linkLabel: "Best rep finds →",
      getProducts: () =>
        resolveProductsFromFilter(
          {
            keywords: ["moncler", "prada", "gucci", "louis vuitton", "chrome hearts"],
          },
          12
        ),
    },
    {
      id: "budget",
      title: "Budget finds",
      description: "Sub-$20 picks that still ship light — ideal for filling out a haul without heavy freight.",
      href: "/best-under-20",
      linkLabel: "Under $20 →",
      getProducts: () => rails.bestUnder20,
    },
    {
      id: "spreadsheet",
      title: "Spreadsheet finds",
      description: "Editor-ranked picks from the LitBuy spreadsheet universe — searchable rows with buy-ready links.",
      href: "/litbuy-spreadsheet",
      linkLabel: "LitBuy spreadsheet →",
      getProducts: () => rails.editorsPicks,
    },
  ];
}

export const FINDS_HUB_CATEGORY_LINKS = [
  ...CATEGORY_FINDS_LINKS,
  { href: "/guides", label: "Guides" },
  { href: "/finds", label: "Finds hub" },
  { href: "/latest-finds", label: "Latest finds" },
  { href: "/how-to-buy-reps", label: "How to buy reps" },
  { href: "/litbuy-qc", label: "QC photos" },
  { href: "/litbuy-spreadsheet", label: "Spreadsheet" },
  { href: "/litbuy-coupons", label: "LitBuy coupons" },
  { href: "/litbuy-discord", label: "Discord" },
] as const;
