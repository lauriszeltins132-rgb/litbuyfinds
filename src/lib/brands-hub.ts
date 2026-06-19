import type { BrandInfo } from "./brands";
import { extractBrand, getBrandsFromProducts } from "./brands";
import { getAllProducts } from "./products";
import { SITE_URL } from "./site";

const LUXURY_SLUGS = new Set([
  "gucci",
  "louis-vuitton",
  "dior",
  "prada",
  "balenciaga",
  "chrome-hearts",
  "fendi",
  "givenchy",
  "bottega-veneta",
  "loewe",
  "hermes",
  "chanel",
  "valentino",
  "burberry",
  "celine",
  "miumiu",
  "goyard",
  "rick-owens",
  "maison-margiela",
  "versace",
]);

const STREETWEAR_SLUGS = new Set([
  "stussy",
  "corteiz",
  "supreme",
  "bape",
  "palace",
  "sp5der",
  "essentials",
  "fear-of-god",
  "represent",
  "ami",
  "carhartt",
  "cp-company",
  "stone-island",
  "off-white",
  "palm-angels",
  "gallery-dept",
  "amiri",
  "vetements",
  "mertra",
]);

const SPORTSWEAR_SLUGS = new Set([
  "nike",
  "jordan",
  "adidas",
  "new-balance",
  "asics",
  "puma",
  "reebok",
  "salomon",
  "converse",
  "vans",
  "yeezy",
  "nocta",
  "travis-scott",
  "under-armour",
  "lululemon",
]);

export const BRANDS_HUB_FAQS = [
  {
    question: "What are the most popular LitBuy brands?",
    answer:
      "Nike, Jordan, Adidas, Moncler, Gucci, Louis Vuitton, Stussy, Chrome Hearts, Stone Island, and Balenciaga are among the most searched brands on LitBuy Finds. Use the Most Popular Brands section on this page to browse the highest-volume labels in the catalog.",
  },
  {
    question: "Which brands have QC photos?",
    answer:
      "Many Nike, Jordan, Moncler, Gucci, and designer bag listings include QC reference links. Open any brand page and filter for products with QC badges, or visit our QC-approved collections for pre-filtered picks.",
  },
  {
    question: "How do I buy branded products through LitBuy?",
    answer:
      "Pick a brand on this page, open a product, and click the verified LitBuy buy link. Register on LitBuy to unlock warehouse QC, order tracking, and shipping discounts before your first haul.",
  },
] as const;

export type BrandGroup = {
  id: string;
  title: string;
  description: string;
  brands: BrandInfo[];
};

function filterBySlugs(brands: BrandInfo[], slugs: Set<string>, limit = 16): BrandInfo[] {
  return brands.filter((b) => slugs.has(b.slug)).slice(0, limit);
}

function getRecentlyAddedBrands(brands: BrandInfo[], limit = 12): BrandInfo[] {
  const products = getAllProducts();
  const maxIdByBrand = new Map<string, number>();

  for (const product of products) {
    const brand = extractBrand(product.product_name);
    if (!brand) continue;
    const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = Number(product.id);
    if (!Number.isFinite(id)) continue;
    maxIdByBrand.set(slug, Math.max(maxIdByBrand.get(slug) ?? 0, id));
  }

  return [...brands]
    .filter((b) => (maxIdByBrand.get(b.slug) ?? 0) > 0)
    .sort((a, b) => (maxIdByBrand.get(b.slug) ?? 0) - (maxIdByBrand.get(a.slug) ?? 0))
    .slice(0, limit);
}

export function getBrandsHubGroups(brands: BrandInfo[]): BrandGroup[] {
  return [
    {
      id: "popular",
      title: "Most Popular Brands",
      description:
        "The highest-volume brand lanes in the LitBuy Finds catalog — ranked by indexed product count and daily search interest.",
      brands: brands.slice(0, 16),
    },
    {
      id: "luxury",
      title: "Luxury Brands",
      description:
        "Designer and luxury labels — bags, belts, outerwear, and accessories with QC references where available.",
      brands: filterBySlugs(brands, LUXURY_SLUGS, 16),
    },
    {
      id: "streetwear",
      title: "Streetwear Brands",
      description:
        "Streetwear and hype labels including Stussy, Corteiz, Supreme, Bape, and Stone Island.",
      brands: filterBySlugs(brands, STREETWEAR_SLUGS, 16),
    },
    {
      id: "sportswear",
      title: "Sportswear Brands",
      description:
        "Sneakers and athletic labels — Nike, Jordan, Adidas, New Balance, and more.",
      brands: filterBySlugs(brands, SPORTSWEAR_SLUGS, 16),
    },
    {
      id: "recent",
      title: "Recently Added Brands",
      description:
        "Brands with the freshest catalog imports — updated as new Weidian and Taobao listings sync.",
      brands: getRecentlyAddedBrands(brands, 12),
    },
  ].filter((group) => group.brands.length > 0);
}

export function getBrandsHubItemList(brands: BrandInfo[], limit = 20) {
  return brands.slice(0, limit).map((brand, index) => ({
    name: brand.name,
    url: `${SITE_URL}/brands/${brand.slug}`,
    position: index + 1,
  }));
}

export function getMajorBrandLinks(brands: BrandInfo[], limit = 24): BrandInfo[] {
  return brands.slice(0, limit);
}

export const BRANDS_HUB_SEO_SECTIONS = [
  {
    heading: "The LitBuy brand directory",
    paragraphs: [
      "LitBuy Finds is the searchable brand directory for LitBuy shoppers. Instead of scrolling endless spreadsheet rows, you can open a dedicated page for Nike, Moncler, Chrome Hearts, Stussy, Balenciaga, Stone Island, and hundreds of other labels — each with product photos, pricing, QC references where available, and verified LitBuy buy links.",
      "This /brands hub is the authoritative entry point for brand-specific discovery on the site. Every major label links to its own collection of indexed finds, updated when the catalog syncs from Weidian, Taobao, and curated spreadsheet imports.",
    ],
  },
  {
    heading: "How to use brand pages",
    paragraphs: [
      "Start with Most Popular Brands if you are unsure where to begin — Nike, Jordan, and Moncler typically lead search volume. Luxury shoppers can jump to Gucci, Louis Vuitton, Dior, or Prada lanes. Streetwear browsers should check Stussy, Corteiz, Supreme, and Bape. Sportswear buyers will find Nike, Adidas, and New Balance sneakers organized with filters for price and category.",
      "Each brand page shows product cards first: top finds, trending picks, recently added listings, QC-approved products, and budget options under $50. Open any product to see photos, price, and a direct LitBuy checkout link.",
    ],
  },
  {
    heading: "QC photos and verified links",
    paragraphs: [
      "Many branded listings include QC (quality control) reference photos from previous buyers or warehouse batches. QC is especially common on sneakers, designer bags, and outerwear. On LitBuy Finds, QC-linked products are marked on their cards — open the product page to compare reference photos before you order.",
      "After you purchase through LitBuy, request warehouse QC photos of your exact item before approving international shipping. This is the safest workflow for branded products where batch quality varies.",
    ],
  },
  {
    heading: "Popular LitBuy brand searches",
    paragraphs: [
      "Sneaker brands dominate daily traffic: Nike Dunks and Air Jordan retros are the most clicked lanes. Outerwear spikes seasonally with Moncler, Canada Goose, and Stone Island. Designer accessories — Louis Vuitton bags, Gucci belts, Chrome Hearts jewelry — attract high-intent buyers who rely on QC references.",
      "Streetwear labels like Stussy and Corteiz have grown quickly as UK and US buyers search for Alcatraz graphics, logo hoodies, and cargo silhouettes. Use the grouped sections above to browse by category, or scroll the full A–Z directory below for every indexed brand.",
    ],
  },
  {
    heading: "LitBuy Finds vs spreadsheets",
    paragraphs: [
      "Raw LitBuy spreadsheets are powerful but hard to browse on mobile. LitBuy Finds turns those rows into brand pages, category filters, QC badges, and shareable collection links. Search by brand name in the header, open /brands for the full directory, or deep-link directly to /brands/nike, /brands/moncler, and other authority pages.",
      "Whether you are building a first haul or restocking seasonal rotation pieces, start here — pick a brand, compare finds, then open LitBuy to purchase and ship internationally.",
    ],
  },
  {
    heading: "Brand pages, collections, and guides",
    paragraphs: [
      "Beyond individual brand hubs, LitBuy Finds groups related picks into shareable collections — best Nike finds, Moncler jackets under budget, QC-approved sneakers, and seasonal roundups. Collections complement brand pages when you want a curated shortlist instead of scrolling the full catalog.",
      "New to agent shopping? Read our beginner guide to LitBuy for registration, warehouse QC, shipping lines, and customs basics. Return to this directory anytime you need a brand-specific starting point — every link on this page points to indexed, verified finds updated as the catalog grows.",
    ],
  },
] as const;

export function getBrandsHubStats() {
  const brands = getBrandsFromProducts(getAllProducts());
  return {
    totalBrands: brands.length,
    totalProducts: getAllProducts().length,
    topBrand: brands[0]?.name ?? "Nike",
  };
}
