import { buildGuide } from "./build";
import { CORE_LINKS } from "./shared";
import type { GuidePage } from "./types";

export const FASHION_GUIDES: Record<string, GuidePage> = {
  "best-streetwear-finds": buildGuide("best-streetwear-finds", "fashion", {
    title: "How to Browse Streetwear Finds",
    metaDescription:
      "Learn how to browse streetwear finds on LitBuy Finds — layering logic, category shortcuts, and where to start when you want hoodies, pants, and statement pieces.",
    badge: "Fashion guide",
    h1: "How to browse streetwear finds",
    intro:
      "Streetwear on LitBuy Finds spans hoodies, sweats, graphic layers, and accessories pulled from spreadsheet drops. This guide is about how to navigate that catalog — not a ranked product list.",
    cardDescription:
      "Browse streetwear by layer, mood, and category instead of scrolling blind.",
    sections: [
      {
        heading: "Start with a collection, not a keyword",
        paragraphs: [
          "Streetwear listings are tagged inconsistently — one seller calls it a crewneck, another a sweatshirt. Collections like our streetwear top list group stronger entries so you see shape and price before diving into filters.",
          "Open the streetwear collection first, then note which brands or silhouettes keep appearing. That tells you what is actively dropping this week.",
        ],
        links: [{ href: "/top-streetwear-finds", label: "Top streetwear finds" }],
      },
      {
        heading: "Build outfits by layer",
        paragraphs: [
          "Think in three layers: base (tees), mid (hoodies and crewnecks), outer (jackets or vests). Browse each category separately instead of hoping one search catches everything.",
          "When you find a mid-layer you like, check the same brand page for matching bottoms. Sellers often list coordinated sets under slightly different titles.",
        ],
        links: [
          { href: "/categories/hoodies-and-pants", label: "Hoodies and pants" },
          { href: "/categories/tshirts", label: "T-shirts" },
        ],
      },
      {
        heading: "Use price and recency as filters",
        paragraphs: [
          "Sort mentally by price band before you fall in love with a photo. Streetwear hauls get expensive fast when you stack three layers without a budget.",
          "Recently added and trending pages surface fresh rows from the latest sheet imports — useful when you want current drops rather than older catalog entries.",
        ],
        links: [
          { href: "/trending", label: "Trending finds" },
          { href: "/recently-added", label: "Recently added" },
        ],
      },
      {
        heading: "Save links while you compare",
        paragraphs: [
          "Streetwear sizing varies by batch. Keep two or three options in your wishlist, open each product page, and read size notes before you buy through LitBuy.",
          "When QC references exist on a listing, use them to compare logo placement and fabric weight — especially on branded graphic pieces.",
        ],
        links: [{ href: "/guides/how-to-use-litbuy-finds", label: "How to find products" }],
      },
    ],
    faqs: [
      {
        question: "Should I browse streetwear by brand or category?",
        answer:
          "Start with category when you know the piece type (hoodie, pants, jacket). Switch to brand pages when you want a specific label's styling cues across multiple item types.",
      },
      {
        question: "Why do similar streetwear items have different prices?",
        answer:
          "Price reflects batch, materials, and seller — not just the photo. Compare multiple listings and read listing details before assuming the cheapest row is the same product.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-hoodie-finds": buildGuide("best-hoodie-finds", "fashion", {
    title: "How to Browse Hoodie Finds",
    metaDescription:
      "A practical guide to browsing hoodie finds on LitBuy Finds — fleece weights, sizing notes, brand pages, and how to compare listings before you buy.",
    badge: "Fashion guide",
    h1: "How to browse hoodie finds",
    intro:
      "Hoodies are one of the densest categories in the catalog. The goal here is to browse smarter: know what to filter for, where hoodies live on the site, and how to compare batches without treating every thumbnail as interchangeable.",
    cardDescription:
      "Find hoodies by weight, fit, and brand — not endless scrolling.",
    sections: [
      {
        heading: "Go straight to the hoodie category",
        paragraphs: [
          "The dedicated hoodie category filters out unrelated sweatshirts mis-tagged from older spreadsheet rows. Start there when you want pullovers and zip hoodies specifically.",
          "From the category page you can scan price spread quickly — budget fleece sits lower, heavier branded pieces cluster higher.",
        ],
        links: [{ href: "/categories/hoodies", label: "Hoodie category" }],
      },
      {
        heading: "Read weight and season into the listing",
        paragraphs: [
          "Listing titles often hint at fleece weight or season — heavyweight, brushed interior, thin summer fleece. Photos alone rarely show thickness.",
          "If you are building a winter rotation, pair hoodie browsing with jacket and coat categories so you are not stacking three mid-layers with no outer shell.",
        ],
        links: [{ href: "/categories/coats-and-jackets", label: "Coats and jackets" }],
      },
      {
        heading: "Compare fit across brands",
        paragraphs: [
          "Oversized streetwear hoodies and slim athletic cuts live in the same category. Open the brand page when you already know a label runs large or small.",
          "Check size charts on the LitBuy listing when available. Chinese sizing frequently runs smaller than US or EU expectations.",
        ],
        links: [{ href: "/brands", label: "Browse brands" }],
      },
      {
        heading: "Cross-check with streetwear collections",
        paragraphs: [
          "Editorial streetwear lists sometimes surface hoodies that are trending before they appear in your default sort order. Use both the category lane and collection pages when hunting a specific aesthetic.",
        ],
        links: [{ href: "/top-streetwear-finds", label: "Top streetwear finds" }],
      },
    ],
    faqs: [
      {
        question: "How do I tell if a hoodie is oversized from the catalog?",
        answer:
          "Look for keywords like oversized, boxy, or relaxed in the title. When unsure, open QC references or community photos linked on the product page and compare shoulder width to a reference item.",
      },
      {
        question: "Are zip hoodies and pullovers in the same place?",
        answer:
          "Yes — both live in the hoodie category. Use search or title keywords if you only want full-zip styles.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-jacket-finds": buildGuide("best-jacket-finds", "fashion", {
    title: "How to Browse Jacket Finds",
    metaDescription:
      "How to browse jacket and outerwear finds on LitBuy Finds — shells, puffers, bombers, seasonal browsing tips, and internal links to the right categories.",
    badge: "Fashion guide",
    h1: "How to browse jacket finds",
    intro:
      "Jackets cover everything from lightweight windbreakers to insulated puffers. Browsing works best when you match outerwear type to season first, then narrow by brand and price.",
    cardDescription:
      "Browse outerwear by season and silhouette before you commit.",
    sections: [
      {
        heading: "Use the jacket category as your home base",
        paragraphs: [
          "The jacket category collects standalone outerwear listings — bombers, coaches jackets, light shells, and similar pieces that are not bundled into broader streetwear tags.",
          "Scan thumbnails for length and collar type before opening listings. A cropped bomber and a long parka solve different problems.",
        ],
        links: [{ href: "/categories/jackets", label: "Jacket category" }],
      },
      {
        heading: "Layer heavier pieces from coat collections",
        paragraphs: [
          "When temperatures drop, many insulated and puffer-style listings move into coats and jackets. Browse both lanes if your first category pass feels thin.",
          "Plan a full outfit: tee, hoodie or knit, then outer layer. Buying the shell last helps you match color and proportion.",
        ],
        links: [{ href: "/categories/coats-and-jackets", label: "Coats and jackets" }],
      },
      {
        heading: "Filter by brand when details matter",
        paragraphs: [
          "Badge placement, zipper hardware, and quilting patterns vary by label. Brand pages group outerwear from the same sellers, which makes side-by-side comparison faster.",
        ],
        links: [{ href: "/brands/moncler", label: "Moncler finds" }],
      },
      {
        heading: "Watch trending for seasonal drops",
        paragraphs: [
          "Outerwear spikes on trending when new sheet rows import. Check trending alongside the category page during fall and winter refresh cycles.",
        ],
        links: [{ href: "/trending", label: "Trending finds" }],
      },
    ],
    faqs: [
      {
        question: "Should I browse jackets or coats first?",
        answer:
          "Start with jackets for lightweight and mid-weight pieces. Move to coats and jackets when you need insulation, longer cuts, or puffer-style construction.",
      },
      {
        question: "How do I estimate warmth from catalog photos?",
        answer:
          "Read the title for fill, lining, or shell material notes. Photos show silhouette more than warmth — when QC links exist, use them to judge puff loft and lining thickness.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-tshirt-finds": buildGuide("best-tshirt-finds", "fashion", {
    title: "How to Browse T-Shirt Finds",
    metaDescription:
      "How to browse t-shirt finds on LitBuy Finds — graphic tees, blanks, sizing, and pairing tees with shorts or layers for everyday rotation.",
    badge: "Fashion guide",
    h1: "How to browse t-shirt finds",
    intro:
      "T-shirts are the fastest-moving lane in fashion finds — small price, high volume, endless graphic variations. Browse with a clear use case: daily blanks, statement graphics, or summer rotation pieces.",
    cardDescription:
      "Graphic tees, staples, and rotation pieces — browse with intent.",
    sections: [
      {
        heading: "Start in the t-shirt category",
        paragraphs: [
          "The t-shirt category isolates tops from hoodies and jackets that sometimes share tags in source spreadsheets. You get a cleaner scroll for tees and long-sleeve tops.",
          "Note fabric keywords in titles — heavyweight cotton, vintage wash, mesh — before assuming every tee fits the same.",
        ],
        links: [{ href: "/categories/tshirts", label: "T-shirt category" }],
      },
      {
        heading: "Pair with warm-weather categories",
        paragraphs: [
          "Building a summer fit? Browse tees alongside shorts in the combined warm-weather category. Sellers often list matching sets with slightly different product names.",
        ],
        links: [{ href: "/categories/tshirts-and-shorts", label: "T-shirts and shorts" }],
      },
      {
        heading: "Use brand pages for consistent sizing",
        paragraphs: [
          "Once you know a brand's tee runs long or boxy, stay on that brand page for the rest of your cart. Graphic batches from the same seller usually share a blank.",
        ],
        links: [{ href: "/brands", label: "All brands" }],
      },
      {
        heading: "Stack basics before graphics",
        paragraphs: [
          "Neutral blanks anchor a wardrobe; graphics add personality. Browse price-sorted basics first if you are filling gaps, then hunt statement pieces on trending or recently added.",
        ],
        links: [
          { href: "/deals", label: "Budget finds" },
          { href: "/recently-added", label: "Recently added" },
        ],
      },
    ],
    faqs: [
      {
        question: "How many tees should I compare before buying?",
        answer:
          "For graphics, compare at least two listings at similar price points — print placement and blank quality differ. For basics, prioritize size notes and fabric weight over logo details.",
      },
      {
        question: "Are long-sleeve tees in the same category?",
        answer:
          "Many long-sleeve tops appear in the t-shirt category or warm-weather combined lane. Search by keyword if you need long-sleeve specifically.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-pants-finds": buildGuide("best-pants-finds", "fashion", {
    title: "How to Browse Pants and Sweatpants Finds",
    metaDescription:
      "How to browse pants, joggers, and sweatpants on LitBuy Finds — fits, fabrics, and the streetwear category where most bottoms live.",
    badge: "Fashion guide",
    h1: "How to browse pants finds",
    intro:
      "Bottoms on LitBuy Finds mostly live inside the broader streetwear category — sweats, cargos, denim, and joggers share space with hoodies. Browse with fit and fabric in mind, not just color.",
    cardDescription:
      "Joggers, cargos, and sweats — navigate the streetwear lane.",
    sections: [
      {
        heading: "Browse the streetwear category for bottoms",
        paragraphs: [
          "Hoodies and pants share a category because spreadsheet curators group full streetwear fits together. Filter visually for trousers and joggers, or search within the page for keywords like cargo, wide, or sweatpant.",
          "This lane is wider than a dedicated pants filter — expect hoodies mixed in. That is normal; scroll with silhouette in mind.",
        ],
        links: [{ href: "/categories/hoodies-and-pants", label: "Streetwear category" }],
      },
      {
        heading: "Match tops you already saved",
        paragraphs: [
          "If you picked a hoodie first, search the same brand for matching sweats. Coordinated sets often list separately with different titles.",
        ],
        links: [{ href: "/categories/hoodies", label: "Hoodie category" }],
      },
      {
        heading: "Think taper and length",
        paragraphs: [
          "Wide-leg cargos, stacked joggers, and straight denim need different shoes. Read title cues and QC photos for cuff and inseam hints when listed.",
          "Gym and casual rotations overlap — athletic joggers and lifestyle sweats sit in the same category. Decide use case before comparing prices.",
        ],
      },
      {
        heading: "Use collections for curated sets",
        paragraphs: [
          "Streetwear top lists sometimes highlight coordinated bottom pieces trending with a specific aesthetic. Check collections when category scrolling feels noisy.",
        ],
        links: [{ href: "/top-streetwear-finds", label: "Top streetwear finds" }],
      },
    ],
    faqs: [
      {
        question: "Where do cargo pants show up?",
        answer:
          "Mostly in the streetwear category with cargo or utility in the title. Use search on the category page or site-wide search if you want a specific pocket layout.",
      },
      {
        question: "How do I avoid wrong sizing on pants?",
        answer:
          "Check waist and length notes on the LitBuy listing. Compare QC photos for drawstring and cuff details. When between sizes, read buyer comments if the listing links to them.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-accessory-finds": buildGuide("best-accessory-finds", "fashion", {
    title: "How to Browse Accessory Finds",
    metaDescription:
      "How to browse accessory finds on LitBuy Finds — belts, hats, jewelry, small leather goods, and how accessories complete an outfit without overspending.",
    badge: "Fashion guide",
    h1: "How to browse accessory finds",
    intro:
      "Accessories are the finishing layer — belts, caps, wallets, chains, and small leather pieces. They are easy to impulse-add to a haul, so browse with a short list of what your wardrobe actually needs.",
    cardDescription:
      "Belts, hats, jewelry, and small leather — browse with a plan.",
    sections: [
      {
        heading: "Open the accessories category first",
        paragraphs: [
          "The accessories category groups small goods that do not belong in apparel lanes. Start here instead of searching random keywords — tags for belts and hats are more consistent here.",
        ],
        links: [{ href: "/categories/accessories", label: "Accessories category" }],
      },
      {
        heading: "One statement piece per haul",
        paragraphs: [
          "Accessories ship light but add up in cart total. Pick one focal piece — a belt, chain, or cap — and build around outfits you already own.",
          "Match metal tone and leather color to bags or shoes you plan to buy in the same haul for a coherent look.",
        ],
        links: [{ href: "/categories/bags", label: "Bag category" }],
      },
      {
        heading: "Check hardware in QC when available",
        paragraphs: [
          "Buckles, clasps, and engraving show up clearly in QC photos. For branded accessories, compare logo placement across two listings before choosing.",
        ],
        links: [{ href: "/guides/how-to-check-qc-photos", label: "How to check QC photos" }],
      },
      {
        heading: "Browse by brand for consistent styling",
        paragraphs: [
          "Label-specific accessories often share packaging and hardware families. Brand pages help you see caps, belts, and small leather from the same aesthetic line.",
        ],
        links: [{ href: "/brands", label: "Browse brands" }],
      },
    ],
    faqs: [
      {
        question: "Are sunglasses and jewelry in accessories?",
        answer:
          "Yes — eyewear, chains, rings, and similar small items typically live in the accessories category alongside belts and hats.",
      },
      {
        question: "Should I buy accessories with my first haul?",
        answer:
          "Many buyers add one small accessory after core apparel and shoes are approved in QC. Accessories are low risk for shipping weight but easy to overbuy.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-bag-finds": buildGuide("best-bag-finds", "fashion", {
    title: "How to Browse Bag Finds",
    metaDescription:
      "How to browse bag finds on LitBuy Finds — totes, crossbody, backpacks, designer styles, and how to compare size and hardware before buying.",
    badge: "Fashion guide",
    h1: "How to browse bag finds",
    intro:
      "Bags range from everyday totes to statement designer silhouettes. Browse by carry style and size first — a crossbody, backpack, and duffle solve different trips.",
    cardDescription:
      "Totes, crossbody, and designer bags — browse by carry style.",
    sections: [
      {
        heading: "Start with the bag category",
        paragraphs: [
          "The bag category collects backpacks, totes, messenger styles, and handheld pieces. Scan for dimensions in titles when listed — catalog photos rarely show scale.",
        ],
        links: [{ href: "/categories/bags", label: "Bag category" }],
      },
      {
        heading: "Use designer bag collections for focused browsing",
        paragraphs: [
          "When you want label-specific silhouettes — monogram canvas, quilting patterns, hardware families — designer bag collections narrow the field faster than scrolling the full category.",
        ],
        links: [{ href: "/top-designer-bags", label: "Top designer bags" }],
      },
      {
        heading: "Compare hardware and strap options",
        paragraphs: [
          "Open multiple listings at the same price tier. Strap length, clasp type, and interior pockets vary by batch even when exteriors look similar.",
          "QC photos are especially useful for bags — stitching on handles and logo alignment show clearly at warehouse angles.",
        ],
        links: [{ href: "/guides/how-to-check-qc-photos", label: "QC photo guide" }],
      },
      {
        heading: "Pair bags with your accessory lane",
        paragraphs: [
          "Wallets, card holders, and key charms often list under accessories. Browse both categories if you want a matched set for travel or daily carry.",
        ],
        links: [{ href: "/categories/accessories", label: "Accessories" }],
      },
    ],
    faqs: [
      {
        question: "How do I judge bag size from photos?",
        answer:
          "Look for dimension notes in the title or listing. Compare against QC photos that include common reference objects. When in doubt, favor slightly larger daily bags over too-small crossbodies.",
      },
      {
        question: "Should I browse bags by brand or collection?",
        answer:
          "Use brand pages when you know the label. Use designer bag collections when you want curated silhouettes across multiple brands at once.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),
};
