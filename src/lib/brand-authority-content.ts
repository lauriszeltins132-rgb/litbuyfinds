import type { StaticPageSection } from "./static-pages";

export type BrandAuthorityContent = {
  whyPopular: string[];
  buyingTips: string[];
  sections: StaticPageSection[];
  faqs: { question: string; answer: string }[];
};

const SHARED_FAQ = (brand: string) => [
  {
    question: `What are the best ${brand} LitBuy finds?`,
    answer: `Check trending rails and the product grid on this page — picks rotate daily based on QC availability, photos, and engagement.`,
  },
  {
    question: `Are ${brand} finds QC approved?`,
    answer: `Many ${brand} listings include QC reference links. Request warehouse QC on LitBuy after purchase before international shipping.`,
  },
  {
    question: `What ${brand} products are most popular?`,
    answer: `Use category filters on this brand page to narrow sneakers, outerwear, or accessories. Compare photos before ordering.`,
  },
];

function sections(
  brand: string,
  popular: string,
  blocks: { heading: string; paragraphs: string[]; links?: { href: string; label: string }[] }[]
): StaticPageSection[] {
  return [
    {
      heading: `Why ${brand} is popular on LitBuy`,
      paragraphs: [popular],
    },
    ...blocks,
  ];
}

export const BRAND_AUTHORITY: Record<string, BrandAuthorityContent> = {
  nike: {
    whyPopular: [
      "Nike Dunks, Air Jordan collabs, and tech fleece dominate search volume on LitBuy Finds.",
    ],
    buyingTips: [
      "Compare toe box and swoosh placement in QC photos before shipping.",
      "Check EU vs US sizing on every listing — batches vary.",
    ],
    sections: sections(
      "Nike",
      "Nike leads sneaker and streetwear searches across Weidian and Taobao. Dunks, Air Max, and Jordan-adjacent Nike styles are the most saved finds on LitBuy Finds.",
      [
        {
          heading: "Top Nike categories",
          paragraphs: [
            "Sneakers remain the entry point for most buyers — especially Dunks and Air Max lines. Tech fleece and Nike ACG outerwear are popular for seasonal hauls.",
            "Filter this page by price to find budget pairs under $50 or higher-tier batches with QC references.",
          ],
          links: [
            { href: "/latest-finds", label: "Latest finds" },
            { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
            { href: "/litbuy-qc", label: "QC database" },
            { href: "/best-sneakers", label: "Best sneakers" },
            { href: "/best-under-50", label: "Under $50" },
          ],
        },
        {
          heading: "QC and batch tips",
          paragraphs: [
            "Reference QC on find pages helps compare materials between batches. Always request warehouse QC on LitBuy for your exact pair before approving shipment.",
          ],
          links: [{ href: "/litbuy-qc", label: "LitBuy QC guide" }],
        },
      ]
    ),
    faqs: SHARED_FAQ("Nike"),
  },
  jordan: {
    whyPopular: ["Air Jordan retros and mids are among the highest-clicked sneaker finds."],
    buyingTips: ["Inspect wings logo and hourglass shape on Jordan 1 highs in QC."],
    sections: sections(
      "Jordan",
      "Jordan brand heat drives consistent traffic — Jordan 1, 4, and 11 silhouettes lead the catalog.",
      [
        {
          heading: "Popular Jordan silhouettes",
          paragraphs: [
            "High-tops and mids dominate searches. Collab colorways rotate through trending rails weekly.",
          ],
          links: [
            { href: "/latest-finds", label: "Latest finds" },
            { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
            { href: "/litbuy-qc", label: "QC database" },
            { href: "/best-jordan-finds-2026", label: "Jordan 2026" },
            { href: "/best-sneakers", label: "Best sneakers" },
          ],
        },
      ]
    ),
    faqs: SHARED_FAQ("Jordan"),
  },
  adidas: {
    whyPopular: ["Campus, Samba, and Gazelle styles surged in replica fashion searches."],
    buyingTips: ["Check three-stripe alignment and sole shape in QC photos."],
    sections: sections(
      "Adidas",
      "Adidas lifestyle runners and terrace shoes are a core LitBuy category alongside Nike.",
      [
        {
          heading: "Adidas finds to watch",
          paragraphs: [
            "Campus and Samba colorways are community favorites. Compare listing photos to reference QC before you buy.",
          ],
          links: [{ href: "/guides/best-adidas-finds", label: "Adidas guide" }],
        },
      ]
    ),
    faqs: SHARED_FAQ("Adidas"),
  },
  moncler: {
    whyPopular: ["Moncler puffers are high-consideration outerwear buys with heavy QC scrutiny."],
    buyingTips: ["Inspect badge stitching and fill distribution. Budget for volumetric shipping."],
    sections: sections(
      "Moncler",
      "Moncler outerwear is one of the most searched jacket brands on LitBuy Finds — puffers and vests lead.",
      [
        {
          heading: "Buying Moncler on LitBuy",
          paragraphs: [
            "Outerwear is bulky — consolidate with lighter items in one haul. QC badge and zipper brand matter most.",
          ],
          links: [
            { href: "/latest-finds", label: "Latest finds" },
            { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
            { href: "/litbuy-qc", label: "QC database" },
            { href: "/best-jackets", label: "Best jackets" },
            { href: "/guides/best-moncler-finds", label: "Moncler guide" },
          ],
        },
      ]
    ),
    faqs: SHARED_FAQ("Moncler"),
  },
  stussy: {
    whyPopular: ["Stussy hoodies and tees are staple streetwear picks under $50."],
    buyingTips: ["Check logo embroidery and drawstring quality in QC."],
    sections: sections(
      "Stussy",
      "Stussy represents California streetwear basics — hoodies, zip-ups, and graphic tees dominate the catalog lane.",
      [
        {
          heading: "Stussy on Weidian and Taobao",
          paragraphs: [
            "Most Stussy finds link through LitBuy agent URLs on Chinese marketplaces. Compare print placement across QC threads before ordering.",
          ],
          links: [
            { href: "/best-hoodies", label: "Best hoodies" },
            { href: "/best-under-50", label: "Under $50" },
          ],
        },
      ]
    ),
    faqs: SHARED_FAQ("Stussy"),
  },
  corteiz: {
    whyPopular: ["Corteiz hoodies and cargos are trending in UK streetwear communities."],
    buyingTips: ["Verify Alcatraz logo placement and zip quality."],
    sections: sections(
      "Corteiz",
      "Corteiz (CRTZ) exploded in search volume — hoodies, tracksuits, and cargos are the main lanes.",
      [
        {
          heading: "Corteiz buying guide",
          paragraphs: [
            "Demand spikes around drops — check Recently Added for fresh listings. QC references help compare logo and tag details.",
          ],
          links: [
            { href: "/latest-finds", label: "Latest finds" },
            { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
            { href: "/best-hoodies", label: "Best hoodies" },
          ],
        },
      ]
    ),
    faqs: SHARED_FAQ("Corteiz"),
  },
  "stone-island": {
    whyPopular: ["Stone Island badges and nylon jackets are niche but high-intent searches."],
    buyingTips: ["Inspect compass badge stitching and garment dye consistency."],
    sections: sections(
      "Stone Island",
      "Stone Island sits at the intersection of streetwear and technical outerwear — badges and nylon crinkle pieces lead.",
      [
        {
          heading: "Stone Island QC focus",
          paragraphs: [
            "Badge quality separates good batches from bad. Use QC photos to compare arm patch shape and button branding.",
          ],
          links: [{ href: "/best-jackets", label: "Best jackets" }],
        },
      ]
    ),
    faqs: SHARED_FAQ("Stone Island"),
  },
  "ralph-lauren": {
    whyPopular: ["Polo shirts and knits are affordable entry points for designer-leaning hauls."],
    buyingTips: ["Compare pony logo embroidery and collar shape."],
    sections: sections(
      "Ralph Lauren",
      "Ralph Lauren polos, sweaters, and jackets appeal to buyers wanting classic prep aesthetics at agent prices.",
      [
        {
          heading: "Ralph Lauren categories",
          paragraphs: [
            "Polos and quarter-zips are the most listed items. Filter by price for budget-friendly rotation pieces.",
          ],
          links: [{ href: "/guides/best-ralph-lauren-finds", label: "Ralph Lauren guide" }],
        },
      ]
    ),
    faqs: SHARED_FAQ("Ralph Lauren"),
  },
  balenciaga: {
    whyPopular: ["Balenciaga runners and oversized hoodies drive designer streetwear clicks."],
    buyingTips: ["Check sole shape on runners and logo placement on hoodies."],
    sections: sections(
      "Balenciaga",
      "Balenciaga statement sneakers and hoodies remain popular despite higher shipping weight on footwear.",
      [
        {
          heading: "Balenciaga finds",
          paragraphs: [
            "Triple S and Track-style silhouettes appear frequently. Always confirm live LitBuy price at checkout.",
          ],
          links: [{ href: "/best-sneakers", label: "Sneakers" }],
        },
      ]
    ),
    faqs: SHARED_FAQ("Balenciaga"),
  },
  "louis-vuitton": {
    whyPopular: ["LV bags and belts are among the most searched designer accessories."],
    buyingTips: ["QC monogram alignment and hardware engraving carefully."],
    sections: sections(
      "Louis Vuitton",
      "Louis Vuitton bags, belts, and small leather goods dominate designer accessory searches on LitBuy Finds.",
      [
        {
          heading: "LV bag buying tips",
          paragraphs: [
            "Bags are high-value — warehouse QC is essential. Compare canvas pattern alignment in reference photos.",
          ],
          links: [
            { href: "/best-bags", label: "Best bags" },
            { href: "/guides/best-louis-vuitton-finds", label: "LV guide" },
          ],
        },
      ]
    ),
    faqs: SHARED_FAQ("Louis Vuitton"),
  },
  dior: {
    whyPopular: ["Dior B30 sneakers and Saddle bags trend in designer fashion finds."],
    buyingTips: ["Inspect oblique pattern and hardware on bags."],
    sections: sections(
      "Dior",
      "Dior sneakers and handbags attract buyers looking for luxury branding at agent marketplace prices.",
      [
        {
          heading: "Dior on LitBuy",
          paragraphs: [
            "Footwear and bags lead the Dior lane. Request detailed QC before shipping internationally.",
          ],
          links: [{ href: "/best-bags", label: "Best bags" }],
        },
      ]
    ),
    faqs: SHARED_FAQ("Dior"),
  },
  burberry: {
    whyPopular: ["Burberry check patterns on scarves and outerwear are seasonal favorites."],
    buyingTips: ["Verify check alignment at seams on scarves and coats."],
    sections: sections(
      "Burberry",
      "Burberry heritage checks and trench-style pieces appear across accessories and outerwear categories.",
      [
        {
          heading: "Burberry finds",
          paragraphs: [
            "Scarves and puffers are popular entry points. Compare listing photos to QC references when available.",
          ],
          links: [{ href: "/best-jackets", label: "Jackets" }],
        },
      ]
    ),
    faqs: SHARED_FAQ("Burberry"),
  },
  ami: {
    whyPopular: ["Ami heart-logo knits and tees are affordable designer-streetwear staples."],
    buyingTips: ["Check heart embroidery size and placement."],
    sections: sections(
      "Ami",
      "Ami Paris heart-logo pieces are popular for minimal designer streetwear — knits and tees lead.",
      [
        {
          heading: "Ami buying guide",
          paragraphs: [
            "Heart logo consistency matters most in QC. Browse hoodies and sweaters on this brand page.",
          ],
          links: [{ href: "/best-hoodies", label: "Best hoodies" }],
        },
      ]
    ),
    faqs: SHARED_FAQ("Ami"),
  },
  prada: {
    whyPopular: ["Prada nylon bags and Re-Nylon pieces are consistent searches."],
    buyingTips: ["Inspect triangle logo plaque and zipper brands."],
    sections: sections(
      "Prada",
      "Prada bags and apparel attract buyers focused on understated luxury branding.",
      [
        {
          heading: "Prada finds",
          paragraphs: [
            "Nylon crossbody and tote styles dominate. QC hardware before approving warehouse photos.",
          ],
          links: [{ href: "/guides/best-prada-finds", label: "Prada guide" }],
        },
      ]
    ),
    faqs: SHARED_FAQ("Prada"),
  },
  gucci: {
    whyPopular: ["Gucci belts, bags, and slides remain top designer accessory searches."],
    buyingTips: ["Check GG pattern spacing and buckle engraving."],
    sections: sections(
      "Gucci",
      "Gucci belts and bags are among the most clicked designer finds — QC references are critical.",
      [
        {
          heading: "Gucci on LitBuy",
          paragraphs: [
            "Start with belts and small leather goods for lower-risk hauls. Bags require careful QC review.",
          ],
          links: [
            { href: "/best-bags", label: "Best bags" },
            { href: "/guides/best-gucci-finds", label: "Gucci guide" },
          ],
        },
      ]
    ),
    faqs: SHARED_FAQ("Gucci"),
  },
  "chrome-hearts": {
    whyPopular: ["Chrome Hearts jewelry and hoodies have a dedicated niche community."],
    buyingTips: ["Inspect cross motif engraving and hardware weight."],
    sections: sections(
      "Chrome Hearts",
      "Chrome Hearts crosses, rings, and graphic hoodies attract high-intent niche buyers.",
      [
        {
          heading: "Chrome Hearts QC",
          paragraphs: [
            "Hardware quality varies by batch — reference QC is essential for jewelry and belts.",
          ],
          links: [{ href: "/guides/best-chrome-hearts-finds", label: "Chrome Hearts guide" }],
        },
      ]
    ),
    faqs: SHARED_FAQ("Chrome Hearts"),
  },
  bape: {
    whyPopular: ["Bape shark hoodies and camo tees are iconic streetwear searches."],
    buyingTips: ["Check shark face symmetry and zipper pulls."],
    sections: sections(
      "Bape",
      "A Bathing Ape hoodies and tees remain a core streetwear lane on LitBuy Finds.",
      [
        {
          heading: "Bape buying tips",
          paragraphs: [
            "Shark hoodies are the grail — compare zip and teeth print in QC. Tees are lower-risk entry points.",
          ],
          links: [{ href: "/best-hoodies", label: "Best hoodies" }],
        },
      ]
    ),
    faqs: SHARED_FAQ("Bape"),
  },
};

const EXTENDED_BRAND_COPY: Record<
  string,
  { focus: string; categories: string; qcTip: string; links: { href: string; label: string }[] }
> = {
  nike: {
    focus: "Dunks, Air Max, tech fleece, and Jordan-adjacent Nike silhouettes",
    categories: "sneakers, hoodies, jackets, and accessories",
    qcTip: "Nike batches vary widely — compare swoosh placement and toe box height in QC photos.",
    links: [
      { href: "/best-sneakers", label: "Best sneakers" },
      { href: "/categories/shoes", label: "Shoe category" },
    ],
  },
  jordan: {
    focus: "Air Jordan 1, 4, and 11 retros",
    categories: "high-tops, mids, and collab colorways",
    qcTip: "Jordan 1 highs need hourglass shape and wings logo checks in warehouse QC.",
    links: [
      { href: "/brands/nike", label: "Nike finds" },
      { href: "/best-sneakers", label: "Best sneakers" },
    ],
  },
  adidas: {
    focus: "Campus, Samba, and terrace classics",
    categories: "sneakers and streetwear apparel",
    qcTip: "Check three-stripe alignment and sole shape on Campus and Samba batches.",
    links: [{ href: "/best-sneakers", label: "Best sneakers" }],
  },
  moncler: {
    focus: "puffers, vests, and winter outerwear",
    categories: "coats, jackets, and seasonal layers",
    qcTip: "Inspect badge stitching and puff distribution — outerwear is bulky for shipping.",
    links: [{ href: "/best-jackets", label: "Best jackets" }],
  },
  stussy: {
    focus: "logo hoodies, graphic tees, and streetwear staples",
    categories: "hoodies, tees, and accessories",
    qcTip: "Compare print placement and tag photos when QC is available.",
    links: [{ href: "/best-hoodies", label: "Best hoodies" }],
  },
  corteiz: {
    focus: "Alcatraz hoodies, cargos, and UK streetwear graphics",
    categories: "hoodies, pants, and graphic pieces",
    qcTip: "Corteiz graphics need clean embroidery and accurate color matching in QC.",
    links: [{ href: "/best-hoodies", label: "Best hoodies" }],
  },
  "stone-island": {
    focus: "compass badges, soft shells, and nylon jackets",
    categories: "outerwear and streetwear layers",
    qcTip: "Badge quality and arm patch placement are the main QC checkpoints.",
    links: [{ href: "/best-jackets", label: "Best jackets" }],
  },
  "ralph-lauren": {
    focus: "polos, quarter-zips, and classic knits",
    categories: "tees, sweaters, and preppy staples",
    qcTip: "Check pony logo embroidery size and collar stitching.",
    links: [{ href: "/categories/tshirts", label: "T-shirts" }],
  },
  balenciaga: {
    focus: "oversized runners and statement hoodies",
    categories: "sneakers and designer streetwear",
    qcTip: "Runner sole shape and logo placement vary — always request warehouse QC.",
    links: [{ href: "/best-sneakers", label: "Best sneakers" }],
  },
  "louis-vuitton": {
    focus: "monogram bags, belts, and small leather goods",
    categories: "bags and designer accessories",
    qcTip: "Monogram alignment and hardware engraving are critical on high-value bags.",
    links: [{ href: "/best-bags", label: "Best bags" }],
  },
  dior: {
    focus: "B30 sneakers, Saddle bags, and oblique patterns",
    categories: "footwear and handbags",
    qcTip: "Inspect oblique canvas alignment and buckle hardware in QC photos.",
    links: [{ href: "/best-bags", label: "Best bags" }],
  },
  burberry: {
    focus: "check scarves, trench styles, and heritage outerwear",
    categories: "accessories and coats",
    qcTip: "Verify check pattern alignment at seams on scarves and coats.",
    links: [{ href: "/best-jackets", label: "Best jackets" }],
  },
  ami: {
    focus: "heart-logo knits, tees, and sweaters",
    categories: "hoodies, sweaters, and minimal designer streetwear",
    qcTip: "Heart embroidery size and placement are the main QC focus.",
    links: [{ href: "/best-hoodies", label: "Best hoodies" }],
  },
  prada: {
    focus: "nylon bags, Re-Nylon pieces, and triangle logos",
    categories: "bags and understated luxury apparel",
    qcTip: "Triangle logo plaque and zipper brand markings matter on bags.",
    links: [{ href: "/best-bags", label: "Best bags" }],
  },
  gucci: {
    focus: "GG belts, slides, and canvas bags",
    categories: "accessories and designer apparel",
    qcTip: "GG pattern spacing and buckle engraving need close QC review.",
    links: [{ href: "/best-bags", label: "Best bags" }],
  },
  "chrome-hearts": {
    focus: "cross jewelry, graphic hoodies, and denim",
    categories: "jewelry, apparel, and niche accessories",
    qcTip: "Hardware weight and cross motif engraving vary significantly by batch.",
    links: [{ href: "/categories/accessories", label: "Accessories" }],
  },
  bape: {
    focus: "shark hoodies, camo tees, and iconic graphics",
    categories: "hoodies, tees, and streetwear",
    qcTip: "Shark face symmetry and zipper pulls are essential QC checks.",
    links: [{ href: "/best-hoodies", label: "Best hoodies" }],
  },
};

for (const [slug, meta] of Object.entries(EXTENDED_BRAND_COPY)) {
  const brand = BRAND_AUTHORITY[slug];
  if (!brand) continue;
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace("Lv", "LV");
  brand.sections.push({
    heading: `${name} on Weidian and LitBuy`,
    paragraphs: [
      `When shoppers search for ${name} on LitBuy, Weidian, or Taobao, they are usually looking for ${meta.focus}. LitBuy Finds indexes spreadsheet-style catalog rows and turns them into searchable brand pages with photos, pricing, and verified agent links — so you can discover products before opening LitBuy to purchase.`,
      `The ${name} catalog on this page spans ${meta.categories}. Use filters to narrow price and category, open product pages for QC reference links when available, and compare listing photos to community references. After you purchase through LitBuy, request warehouse QC photos of your exact item before approving international shipping.`,
      `${meta.qcTip} Community favorites rotate through trending rails on this page — engagement, QC availability, and photo quality all factor into what ranks at the top each day. Pair this brand page with our best-of collections and beginner guides if you are new to agent buying.`,
    ],
    links: meta.links,
  });
}

export function getBrandAuthority(slug: string): BrandAuthorityContent | undefined {
  return BRAND_AUTHORITY[slug];
}
