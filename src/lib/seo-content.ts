type LandingCopy = {
  title: string;
  description: string;
  intro: string;
};

const CATEGORY_COPY: Record<string, LandingCopy> = {
  hoodies: {
    title: "Hoodie Finds",
    description:
      "Curated hoodie finds on LitBuy — streetwear layers with verified buy links and QC where available.",
    intro:
      "Hoodies, crewnecks, and sweatshirt layers from across the catalog. Filter by brand and price, then buy through verified LitBuy links.",
  },
  jackets: {
    title: "Jacket Finds",
    description:
      "Jacket and outerwear finds on LitBuy — puffers, shells, and seasonal layers with verified links.",
    intro:
      "Outerwear picks for every season, from lightweight jackets to heavier layers, with clear pricing and outbound buy links.",
  },
  tshirts: {
    title: "T-Shirt Finds",
    description:
      "T-shirt finds on LitBuy — graphic tees, staples, and daily rotation pieces with verified purchase links.",
    intro:
      "A focused lane for tees and tops. Browse by brand, compare prices, and open product pages for QC references.",
  },
  bags: {
    title: "Bag Finds",
    description:
      "Bag and backpack finds on LitBuy — totes, crossbody bags, and travel pieces with verified agent links.",
    intro:
      "Backpacks, totes, and carry pieces pulled from the accessories catalog. Every listing links out to LitBuy for checkout.",
  },
  shoes: {
    title: "Shoe Finds",
    description:
      "Discover curated sneaker and footwear finds on LitBuy — verified links, QC photos, and daily drops across Nike, Jordan, Adidas, and more.",
    intro:
      "From everyday runners to statement collabs, this collection tracks the strongest shoe finds across the catalog. Every listing includes a verified LitBuy link so you can buy with confidence.",
  },
  "hoodies-and-pants": {
    title: "Streetwear Finds",
    description:
      "Browse hoodies, sweatpants, and streetwear picks with verified LitBuy links and QC references.",
    intro:
      "Layer-friendly hoodies, relaxed sweats, and streetwear staples — organized for fast browsing with real product photos and outbound buy links.",
  },
  "coats-and-jackets": {
    title: "Coats & Jackets",
    description:
      "Outerwear finds including puffers, shells, and designer jackets with LitBuy buy links.",
    intro:
      "Seasonal outerwear from lightweight layers to heavy puffers. Filter by brand, price, and category to narrow down your next jacket pick.",
  },
  "tshirts-and-shorts": {
    title: "T-Shirts & Shorts",
    description:
      "Tees, shorts, and warm-weather essentials curated from the LitBuy finds catalog.",
    intro:
      "Graphic tees, minimal staples, and summer shorts — a focused lane for everyday rotation pieces with verified purchase links.",
  },
  accessories: {
    title: "Accessory Finds",
    description:
      "Bags, belts, jewelry, and accessory finds with LitBuy affiliate links and QC where available.",
    intro:
      "Small details that complete a fit. Explore bags, belts, hats, and more with clear pricing and direct LitBuy checkout links.",
  },
  electronics: {
    title: "Electronics Finds",
    description:
      "Tech and electronics picks from the LitBuy finds spreadsheet — headphones, gadgets, and more.",
    intro:
      "A dedicated lane for tech and gadget finds. Compare prices, check QC references when available, and buy through verified LitBuy links.",
  },
};

const BRAND_COPY: Record<string, LandingCopy> = {
  nike: {
    title: "Nike Finds",
    description:
      "Curated Nike finds on LitBuy — Dunks, Air Max, tech fleece, and more with verified buy links.",
    intro:
      "Nike remains one of the most searched lanes in the catalog. This page surfaces current Nike picks with photos, pricing, and direct LitBuy purchase links.",
  },
  adidas: {
    title: "Adidas Finds",
    description:
      "Adidas Campus, Samba, Yeezy-style picks, and more — curated LitBuy finds with QC links.",
    intro:
      "From Campus and Samba silhouettes to seasonal drops, browse Adidas finds organized for quick discovery and easy checkout on LitBuy.",
  },
  jordan: {
    title: "Jordan Finds",
    description:
      "Air Jordan finds curated from the LitBuy catalog — retros, mids, highs, and collabs.",
    intro:
      "Jordan heat in one place. Explore current listings with product images, pricing in your preferred currency, and verified affiliate links.",
  },
  asics: {
    title: "Asics Finds",
    description:
      "Asics Gel and sportstyle finds with LitBuy buy links and QC references where available.",
    intro:
      "Clean runners and sportstyle Asics picks — ideal if you are building a rotation around comfort-first silhouettes.",
  },
  "new-balance": {
    title: "New Balance Finds",
    description:
      "New Balance 550, 2002R, and lifestyle runners curated for LitBuy shoppers.",
    intro:
      "New Balance continues to dominate everyday wear. This collection highlights current NB finds with transparent pricing and outbound buy links.",
  },
  moncler: {
    title: "Moncler Finds",
    description:
      "Moncler puffers and outerwear finds on LitBuy with verified buy links and QC references.",
    intro:
      "Moncler outerwear from across the catalog — browse current listings with photos, pricing, and direct LitBuy checkout links.",
  },
  supreme: {
    title: "Supreme Finds",
    description:
      "Supreme streetwear finds curated on LitBuy — hoodies, tees, and accessories with verified links.",
    intro:
      "Supreme picks organized for quick discovery. Compare prices, check QC when available, and buy through verified LitBuy links.",
  },
  "ralph-lauren": {
    title: "Ralph Lauren Finds",
    description:
      "Ralph Lauren finds on LitBuy — polos, knits, and classic pieces with verified purchase links.",
    intro:
      "Classic Ralph Lauren styles from the catalog, with clear product photos and outbound agent links for easy buying.",
  },
};

export function getCategorySeo(slug: string, name: string, count: number): LandingCopy {
  const copy = CATEGORY_COPY[slug];
  if (copy) return copy;

  return {
    title: `${name} Finds`,
    description: `Browse ${count.toLocaleString()} curated ${name.toLowerCase()} finds on LitBuy Finds with verified links and product photos.`,
    intro: `Explore ${name.toLowerCase()} from the LitBuy Finds catalog. Filter by brand and price, open product details for QC references, and buy through verified affiliate links.`,
  };
}

export function getBrandSeo(slug: string, name: string, count: number): LandingCopy {
  const copy = BRAND_COPY[slug];
  if (copy) return copy;

  return {
    title: `${name} Finds`,
    description: `Discover ${count.toLocaleString()} ${name} finds on LitBuy — curated products with verified buy links and QC where available.`,
    intro: `A focused view of ${name} products from the LitBuy Finds catalog. Save favorites, compare prices, and buy through verified LitBuy links.`,
  };
}
