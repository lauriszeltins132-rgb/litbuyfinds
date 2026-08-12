import {
  buildBrandMetaDescription,
  buildBrandMetaTitle,
  buildCategoryMetaDescription,
  buildCategoryMetaTitle,
} from "./metadata-copy";

type LandingCopy = {
  title: string;
  description: string;
  intro: string;
};

const CATEGORY_COPY: Record<string, LandingCopy> = {
  hoodies: {
    title: "LitBuy Hoodie Finds",
    description:
      "Curated hoodie finds on LitBuy — Stussy, Corteiz, Nike tech fleece, and streetwear layers with verified buy links and QC where available.",
    intro:
      "Hoodies, crewnecks, and sweatshirt layers from across the catalog — from budget graphic tees to designer streetwear. Filter by brand and price, compare QC references on product pages, and buy through verified LitBuy links.",
  },
  jackets: {
    title: "LitBuy Jacket Finds",
    description:
      "Jacket and outerwear finds on LitBuy — Moncler, Stone Island, puffers, shells, and seasonal layers with verified links.",
    intro:
      "Outerwear picks for every season, from lightweight shells to heavy puffers. Moncler, Canada Goose, and Stone Island lead winter searches — every listing links to LitBuy for warehouse QC and international shipping.",
  },
  tshirts: {
    title: "T-Shirt Finds",
    description:
      "T-shirt finds on LitBuy — graphic tees, staples, and daily rotation pieces with verified purchase links.",
    intro:
      "A focused lane for tees and tops. Browse by brand, compare prices, and open product pages for QC references.",
  },
  bags: {
    title: "LitBuy Bag Finds",
    description:
      "Bag and backpack finds on LitBuy — Louis Vuitton, Gucci, Goyard, totes, crossbody bags, and travel pieces with verified agent links.",
    intro:
      "Backpacks, totes, and designer carry pieces pulled from the accessories catalog. Louis Vuitton, Gucci, and Prada styles are the most searched — request warehouse QC on high-value bags before international shipping.",
  },
  shoes: {
    title: "LitBuy Sneakers & Shoe Finds",
    description:
      "Discover curated sneaker and footwear finds on LitBuy — verified links, QC photos, and daily drops across Nike, Jordan, Adidas, and more.",
    intro:
      "From everyday runners to statement collabs, this collection tracks the strongest shoe finds across the catalog. Nike Dunks, Jordan retros, Adidas Campus, and New Balance runners dominate searches — every listing includes a verified LitBuy agent link. Filter by brand and price, open QC references on product pages, and compare batches before warehouse shipping.",
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
    title: "LitBuy Accessory Finds",
    description:
      "Bags, belts, jewelry, hats, and accessory finds with LitBuy affiliate links and QC where available.",
    intro:
      "Small details that complete a fit — belts, hats, eyewear, jewelry, and carry pieces. Accessories are ideal for filling out a haul without heavy shipping weight. Explore with clear pricing and direct LitBuy checkout links.",
  },
  electronics: {
    title: "LitBuy Electronics Finds",
    description:
      "Tech and electronics picks from the LitBuy finds spreadsheet — headphones, gadgets, and more with verified links.",
    intro:
      "A dedicated lane for tech and gadget finds from Weidian and Taobao sellers. Compare specs and model numbers carefully, check QC references when available, and buy through verified LitBuy links.",
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
  "louis-vuitton": {
    title: "Louis Vuitton Finds",
    description:
      "Louis Vuitton bag and accessory finds on LitBuy — browse listings with agent links and QC references.",
    intro:
      "LV-style bags, belts, and accessories from across the catalog. Compare photos, check QC when available, and open agent links on LitBuy.",
  },
  gucci: {
    title: "Gucci Finds",
    description:
      "Gucci finds on LitBuy — bags, belts, and apparel listings with verified agent links.",
    intro:
      "Gucci-heavy picks organized for browsing. Filter by price, open product details, and use your own judgment before ordering.",
  },
  prada: {
    title: "Prada Finds",
    description:
      "Prada bag and apparel finds curated on LitBuy with product photos and buy links.",
    intro:
      "Prada listings from the catalog — useful when you want a focused lane instead of scrolling a full spreadsheet.",
  },
  "chrome-hearts": {
    title: "Chrome Hearts Finds",
    description:
      "Chrome Hearts jewelry and apparel finds on LitBuy with agent links and QC references.",
    intro:
      "Chrome Hearts picks across jewelry, hoodies, and accessories. Check hardware and print details in QC when you can.",
  },
  dior: {
    title: "Dior Finds",
    description:
      "Dior finds on LitBuy — bags, sneakers, and apparel with verified purchase links.",
    intro:
      "Dior product listings from the catalog with photos and outbound LitBuy links for checkout.",
  },
  balenciaga: {
    title: "Balenciaga Finds",
    description:
      "Balenciaga sneaker and apparel finds on LitBuy — browse with filters and agent links.",
    intro:
      "Balenciaga runners, hoodies, and statement pieces in one searchable lane.",
  },
  burberry: {
    title: "Burberry Finds",
    description:
      "Burberry finds on LitBuy — outerwear, checks, and accessories with agent links.",
    intro:
      "Burberry listings with clear pricing. Open QC references on product pages when they are available.",
  },
  fendi: {
    title: "Fendi Finds",
    description:
      "Fendi bag and apparel finds curated on LitBuy with verified buy links.",
    intro:
      "Fendi picks from the catalog — filter by category within the brand page and compare photos before buying.",
  },
  bape: {
    title: "Bape Finds",
    description:
      "Bape streetwear finds on LitBuy — hoodies, tees, and camo pieces with agent links.",
    intro:
      "Bape-heavy listings for streetwear browsers. Check print alignment and tags in QC when possible.",
  },
  "stone-island": {
    title: "Stone Island Finds",
    description:
      "Stone Island jacket and apparel finds on LitBuy with product photos and buy links.",
    intro:
      "Stone Island outerwear and badges from the catalog — useful for seasonal layer shopping.",
  },
  stussy: {
    title: "Stussy Finds",
    description:
      "Stussy streetwear finds on LitBuy — hoodies, tees, and logo pieces with verified buy links.",
    intro:
      "Stüssy remains a core streetwear search on Weidian and Taobao. Browse hoodies, graphic tees, and logo staples with photos, pricing, and LitBuy agent links.",
  },
  corteiz: {
    title: "Corteiz Finds",
    description:
      "Corteiz streetwear finds on LitBuy — hoodies, cargos, and Alcatraz pieces with verified links.",
    intro:
      "Corteiz has become one of the most searched UK streetwear lanes on LitBuy Finds. Explore hoodies, cargos, and graphic pieces with QC references where available.",
  },
  ami: {
    title: "Ami Finds",
    description:
      "Ami Paris finds on LitBuy — heart-logo knits, tees, and sweaters with verified agent links.",
    intro:
      "Ami heart-logo knits and tees are popular designer-streetwear entry points. Compare embroidery and fit in QC before you ship.",
  },
};

const CATEGORY_GUIDES: Record<string, { href: string; label: string }[]> = {
  shoes: [
    { href: "/guides/best-rep-sneakers", label: "Best rep sneakers guide" },
    { href: "/guides/qc-checklist-for-shoes", label: "Shoe QC checklist" },
    { href: "/guides/best-nike-finds", label: "Best Nike finds" },
  ],
  "hoodies-and-pants": [
    { href: "/guides/best-hoodie-finds", label: "Best hoodie finds" },
    { href: "/guides/best-streetwear-finds", label: "Streetwear guide" },
    { href: "/best-litbuy-hoodies", label: "Best LitBuy hoodies" },
  ],
  "coats-and-jackets": [
    { href: "/guides/best-jacket-finds", label: "Best jacket finds" },
    { href: "/guides/best-winter-finds", label: "Winter finds guide" },
    { href: "/best-litbuy-jackets", label: "Best LitBuy jackets" },
  ],
  hoodies: [
    { href: "/guides/best-hoodie-finds", label: "Best hoodie finds" },
    { href: "/best-litbuy-hoodies", label: "Best LitBuy hoodies" },
  ],
  jackets: [
    { href: "/guides/best-jacket-finds", label: "Best jacket finds" },
    { href: "/best-litbuy-jackets", label: "Best LitBuy jackets" },
  ],
  tshirts: [
    { href: "/guides/best-tshirt-finds", label: "Best t-shirt finds" },
    { href: "/guides/best-summer-finds", label: "Summer finds guide" },
  ],
  bags: [
    { href: "/guides/best-bag-finds", label: "Best bag finds" },
    { href: "/guides/qc-checklist-for-bags", label: "Bag QC checklist" },
  ],
  accessories: [
    { href: "/guides/best-accessory-finds", label: "Accessory guide" },
    { href: "/guides/best-bag-finds", label: "Bag finds guide" },
  ],
  electronics: [
    { href: "/guides/how-to-use-litbuy-finds", label: "How to use LitBuy Finds" },
  ],
  default: [
    { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
    { href: "/guides/how-to-order-from-litbuy", label: "How to order" },
  ],
};

const BRAND_GUIDES: Record<string, { href: string; label: string }[]> = {
  nike: [
    { href: "/guides/best-nike-finds", label: "Best Nike finds guide" },
    { href: "/top-nike-finds", label: "Top Nike product list" },
  ],
  jordan: [{ href: "/guides/best-jordan-finds", label: "Best Jordan guide" }],
  adidas: [{ href: "/guides/best-adidas-finds", label: "Best Adidas guide" }],
  "new-balance": [
    { href: "/guides/best-new-balance-finds", label: "New Balance guide" },
  ],
  asics: [{ href: "/guides/best-asics-finds", label: "Asics guide" }],
  "louis-vuitton": [
    { href: "/guides/best-louis-vuitton-finds", label: "LV finds guide" },
    { href: "/top-louis-vuitton-finds", label: "Top LV list" },
  ],
  gucci: [
    { href: "/guides/best-gucci-finds", label: "Gucci guide" },
    { href: "/top-gucci-finds", label: "Top Gucci list" },
  ],
  prada: [{ href: "/guides/best-prada-finds", label: "Prada guide" }],
  moncler: [{ href: "/guides/best-moncler-finds", label: "Moncler guide" }],
  supreme: [{ href: "/guides/best-supreme-finds", label: "Supreme guide" }],
  "ralph-lauren": [
    { href: "/guides/best-ralph-lauren-finds", label: "Ralph Lauren guide" },
  ],
  "chrome-hearts": [
    { href: "/guides/best-chrome-hearts-finds", label: "Chrome Hearts guide" },
  ],
};

const CATEGORY_FAQS: Record<string, { question: string; answer: string }[]> = {
  shoes: [
    {
      question: "How do I find sneaker listings on LitBuy Finds?",
      answer:
        "Use this category page to filter by brand and price, open product details for QC references, then follow the agent link to LitBuy.",
    },
    {
      question: "Should I request QC for shoes?",
      answer:
        "Most buyers request warehouse QC for pairs above a comfortable price point. Compare photos to listing references before you ship.",
    },
    {
      question: "What are the best LitBuy sneakers?",
      answer:
        "Nike Dunks, Jordan 1s, and Adidas Campus lead clicks. See our best sneakers page and Popular Today rail for community-ranked picks.",
    },
  ],
  hoodies: [
    {
      question: "What are the best LitBuy hoodies?",
      answer:
        "Stussy, Corteiz, Nike tech fleece, and Supreme graphics are among the most saved. Filter this page by brand or visit /best-hoodies for editor picks.",
    },
    {
      question: "How do I check hoodie QC?",
      answer:
        "Look at print placement, drawstrings, and tag photos in warehouse QC. Compare measurements to a hoodie you already own.",
    },
  ],
  jackets: [
    {
      question: "What jackets are popular on LitBuy?",
      answer:
        "Moncler puffers, Stone Island shells, and Canada Goose styles lead winter searches. Puffers are bulky — factor volumetric shipping weight.",
    },
    {
      question: "When should I order outerwear?",
      answer:
        "Order six to eight weeks before your local cold season to allow warehouse QC and international shipping time.",
    },
  ],
  bags: [
    {
      question: "Are designer bags safe to buy on LitBuy?",
      answer:
        "Many buyers order designer-style bags through agents. Always request detailed warehouse QC and compare hardware, stitching, and monogram alignment before shipping.",
    },
  ],
  accessories: [
    {
      question: "What accessories are good for first hauls?",
      answer:
        "Hats, belts, and small leather goods add variety without heavy freight. They are lower risk than large outerwear pieces.",
    },
  ],
  "hoodies-and-pants": [
    {
      question: "What is in the hoodies and pants category?",
      answer:
        "Streetwear hoodies, crewnecks, sweatpants, cargos, and layer staples from brands like Stussy, Corteiz, Nike, and Essentials — indexed from LitBuy spreadsheet imports.",
    },
    {
      question: "How do I browse more hoodie finds?",
      answer:
        "Open Hoodie finds for a focused hoodie database, Clothing finds for broader fashion, or the LitBuy spreadsheet guide to understand how rows become product pages.",
    },
    {
      question: "Should I QC hoodies and pants?",
      answer:
        "Yes for graphic embroidery and logo placement. Compare measurements to garments you already own before shipping.",
    },
  ],
  "coats-and-jackets": [
    {
      question: "What jackets are in this category?",
      answer:
        "Puffers, parkas, shells, and designer outerwear — Moncler, Canada Goose, The North Face, and Arc'teryx-style pieces lead winter searches.",
    },
    {
      question: "How do jacket finds relate to the LitBuy spreadsheet?",
      answer:
        "Outerwear rows from LitBuy spreadsheets become searchable product pages on Jacket finds and this category hub, with QC badges and agent links.",
    },
    {
      question: "What should I check in jacket QC?",
      answer:
        "Badge stitching, zipper branding, fill distribution, and cuff finish. Puffers are bulky — factor volumetric shipping weight.",
    },
  ],
  "tshirts-and-shorts": [
    {
      question: "What is in t-shirts and shorts?",
      answer:
        "Graphic tees, staples, summer shorts, and warm-weather essentials from the LitBuy Finds catalog — good budget haul fillers.",
    },
    {
      question: "Are tees good for first LitBuy orders?",
      answer:
        "Yes. Tees and shorts are lower risk and lighter to ship. Confirm size charts on the agent listing before ordering.",
    },
  ],
  electronics: [
    {
      question: "Should I buy electronics through LitBuy?",
      answer:
        "Read listing specs carefully and confirm model numbers. Consider insurance on higher-value tech shipments and review LitBuy return policy before ordering.",
    },
  ],
  default: [
    {
      question: "How do LitBuy Finds listings work?",
      answer:
        "Each row is a product listing with photos, price, and an agent link. LitBuy Finds helps you browse — checkout happens on LitBuy.",
    },
    {
      question: "Are prices always exact?",
      answer:
        "Prices come from the source catalog and may change on LitBuy. Always confirm the latest price on the agent listing before buying.",
    },
  ],
};

const BRAND_CATEGORY_LINES: Record<string, string> = {
  nike: "sneakers, hoodies, tech fleece and jackets",
  jordan: "sneakers, retros and QC-approved pairs",
  adidas: "Campus, Samba, sneakers and streetwear",
  moncler: "jackets, vests and outerwear",
  stussy: "hoodies, tees and streetwear",
  "ralph-lauren": "polos, knits and classic pieces",
  supreme: "hoodies, tees and accessories",
  gucci: "bags, belts and apparel",
  "louis-vuitton": "bags and accessories",
};

const BRAND_FAQS: Record<string, { question: string; answer: string }[]> = {
  default: [
    {
      question: "How are brand pages built?",
      answer:
        "We detect brand names from product titles in the catalog. Counts update when the dataset syncs.",
    },
    {
      question: "What should I check before ordering?",
      answer:
        "Compare listing photos, read QC references when available, and review warehouse QC before international shipping.",
    },
  ],
};

export function getCategorySeo(slug: string, name: string, count: number): LandingCopy {
  const copy = CATEGORY_COPY[slug];
  const title = buildCategoryMetaTitle(name, slug);
  const description = buildCategoryMetaDescription(name, count);

  if (copy) {
    return { title, description, intro: copy.intro };
  }

  return {
    title,
    description,
    intro: `Explore ${name.toLowerCase()} from the LitBuy Finds catalog. Filter by brand and price, open product details for QC references, and buy through verified affiliate links.`,
  };
}

export function getBrandSeo(slug: string, name: string, count: number): LandingCopy {
  const copy = BRAND_COPY[slug];
  const categoryLine =
    BRAND_CATEGORY_LINES[slug] ?? "sneakers, hoodies, jackets and accessories";
  const title = buildBrandMetaTitle(name, slug);
  const description = buildBrandMetaDescription(name, count, categoryLine);

  if (copy) {
    return {
      title,
      description,
      intro: copy.intro,
    };
  }

  return {
    title,
    description,
    intro: `A focused view of ${name} products from the LitBuy Finds catalog. Save favorites, compare prices, and buy through verified LitBuy links.`,
  };
}

export function getCategoryRelatedGuides(slug: string) {
  return CATEGORY_GUIDES[slug] ?? CATEGORY_GUIDES.default;
}

export function getBrandRelatedGuides(slug: string) {
  return (
    BRAND_GUIDES[slug] ?? [
      { href: "/guides", label: "All guides" },
      { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
    ]
  );
}

export function getCategoryFaqs(slug: string) {
  return CATEGORY_FAQS[slug] ?? CATEGORY_FAQS.default;
}

export function getBrandFaqs(slug: string, name = "this brand") {
  const custom = BRAND_FAQS[slug];
  if (custom) return custom;

  return [
    {
      question: `What are the best ${name} LitBuy finds?`,
      answer: `Check the trending and top product rails on this page — they rotate daily based on engagement, QC availability, and catalog quality.`,
    },
    {
      question: `Are ${name} finds QC approved?`,
      answer: `Many ${name} listings include QC reference links. Request warehouse QC on LitBuy after purchase before international shipping.`,
    },
    {
      question: `What ${name} products are most popular?`,
      answer: `Sneakers and outerwear tend to lead clicks. Use filters on this page to narrow by category and price.`,
    },
  ];
}
