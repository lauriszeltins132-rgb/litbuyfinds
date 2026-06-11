import { buildGuide } from "./build";
import { CORE_LINKS } from "./shared";
import type { GuidePage } from "./types";

export const BRAND_GUIDES: Record<string, GuidePage> = {
  "best-louis-vuitton-finds": buildGuide("best-louis-vuitton-finds", "brands", {
    title: "How to Browse Louis Vuitton Finds",
    metaDescription:
      "How to browse Louis Vuitton finds on LitBuy Finds — monogram canvas, leather goods, brand pages, and top lists for focused discovery.",
    badge: "Brand guide",
    h1: "How to browse Louis Vuitton finds",
    intro:
      "Louis Vuitton listings span bags, belts, wallets, and apparel with heavy visual branding. Browse by product type first — canvas patterns and hardware families cluster differently across categories.",
    cardDescription:
      "Monogram, Damier, and leather goods — browse LV by product type.",
    sections: [
      {
        heading: "Use the LV top list for curated entry points",
        paragraphs: [
          "The Louis Vuitton top list surfaces stronger catalog rows without scrolling the entire brand page. Start there when you know you want LV but not which silhouette yet.",
          "Note which product types repeat — bags, card holders, belts — then jump to the brand page for depth in that lane.",
        ],
        links: [{ href: "/top-louis-vuitton-finds", label: "Top Louis Vuitton finds" }],
      },
      {
        heading: "Drill into the brand page for full catalog",
        paragraphs: [
          "The brand page aggregates every LV-tagged row from spreadsheet imports. Filter visually by canvas vs leather, or search within the page for keywords like keepall, wallet, or belt.",
        ],
        links: [{ href: "/brands/louis-vuitton", label: "Louis Vuitton brand page" }],
      },
      {
        heading: "Compare pattern and hardware across listings",
        paragraphs: [
          "Monogram, Damier, and solid leather batches sit at different price points. Open two listings at similar prices and compare strap length, clasp type, and interior layout in photos.",
          "When QC links exist, use them for stitching on handles and zip pulls — details that thumbnails hide.",
        ],
        links: [{ href: "/categories/bags", label: "Bag category" }],
      },
      {
        heading: "Cross-browse accessories and bags",
        paragraphs: [
          "LV small leather goods often live in accessories as well as bags. Check both categories if you are building a travel set with matching canvas.",
        ],
        links: [{ href: "/categories/accessories", label: "Accessories" }],
      },
    ],
    faqs: [
      {
        question: "Should I start on the top list or brand page?",
        answer:
          "Use the top list for inspiration and current highlights. Use the brand page when you know the product type and want every matching listing in the catalog.",
      },
      {
        question: "How do I compare similar LV bags?",
        answer:
          "Match price tier first, then compare dimensions in titles, hardware color, and strap options. QC photos help when two thumbnails look identical.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-gucci-finds": buildGuide("best-gucci-finds", "brands", {
    title: "How to Browse Gucci Finds",
    metaDescription:
      "How to browse Gucci finds on LitBuy Finds — GG canvas, apparel, accessories, top lists, and brand-page browsing tips.",
    badge: "Brand guide",
    h1: "How to browse Gucci finds",
    intro:
      "Gucci finds cover belts, bags, hoodies, and logo-heavy accessories. The brand aesthetic is loud — browse with one focal category so you do not mix incompatible pieces in one cart.",
    cardDescription:
      "GG canvas, belts, and apparel — browse Gucci with focus.",
    sections: [
      {
        heading: "Start with the Gucci top list",
        paragraphs: [
          "The Gucci top list highlights catalog entries that are actively browsed or recently imported. Good for spotting trending belts, bags, and graphic pieces without keyword guessing.",
        ],
        links: [{ href: "/top-gucci-finds", label: "Top Gucci finds" }],
      },
      {
        heading: "Open the brand page for depth",
        paragraphs: [
          "Every Gucci-tagged row lives on the brand page. Scroll by product type — accessories cluster separately from apparel — or use site search with Gucci plus item keywords.",
        ],
        links: [{ href: "/brands/gucci", label: "Gucci brand page" }],
      },
      {
        heading: "Match logo scale to your wardrobe",
        paragraphs: [
          "Gucci listings range from subtle hardware to full-panel graphics. Decide whether you want a statement belt or a quieter bag before comparing ten similar thumbnails.",
        ],
        links: [{ href: "/categories/accessories", label: "Accessories" }],
      },
      {
        heading: "Pair apparel with accessories carefully",
        paragraphs: [
          "Double-logo outfits happen fast. If you pick a loud hoodie, consider a simpler belt or bag from the same brand page — or browse neutral categories for balance.",
        ],
        links: [{ href: "/categories/hoodies-and-pants", label: "Streetwear category" }],
      },
    ],
    faqs: [
      {
        question: "Where do Gucci belts show up?",
        answer:
          "Mostly on the Gucci brand page and in accessories. Search belt on the brand page if the default sort buries them under apparel.",
      },
      {
        question: "Are Gucci sneakers on the brand page?",
        answer:
          "Footwear tagged Gucci appears on the brand page and in the shoes category. Browse both if you want a full head-to-toe brand lane.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-prada-finds": buildGuide("best-prada-finds", "brands", {
    title: "How to Browse Prada Finds",
    metaDescription:
      "How to browse Prada finds on LitBuy Finds — nylon bags, logo apparel, brand-page filters, and how to compare minimalist listings.",
    badge: "Brand guide",
    h1: "How to browse Prada finds",
    intro:
      "Prada finds lean toward clean lines, nylon constructions, and subtle triangle logos. Browse the brand page with material keywords — nylon, leather, re-edition — to separate bag batches from apparel.",
    cardDescription:
      "Nylon, leather, and triangle logo — navigate Prada finds.",
    sections: [
      {
        heading: "Start on the Prada brand page",
        paragraphs: [
          "The Prada brand page is your main lane. Listings span bags, jackets, and accessories with varying logo visibility. Scan titles for material and silhouette before opening every card.",
        ],
        links: [{ href: "/brands/prada", label: "Prada brand page" }],
      },
      {
        heading: "Separate bags from apparel mentally",
        paragraphs: [
          "Nylon crossbody and shoulder styles dominate many Prada searches. Apparel pieces often use different sellers and sizing notes. Browse one product type per session.",
        ],
        links: [{ href: "/categories/bags", label: "Bag category" }],
      },
      {
        heading: "Compare hardware and strap configs",
        paragraphs: [
          "Similar nylon silhouettes differ in strap width, clasp color, and interior pockets. Open two listings at the same price and read QC references when available.",
        ],
        links: [{ href: "/guides/how-to-check-qc-photos", label: "QC photo guide" }],
      },
      {
        heading: "Check outerwear in seasonal categories",
        paragraphs: [
          "Prada jackets and coats sometimes appear in outerwear categories with lighter tagging. Cross-browse when the brand page feels thin on layers.",
        ],
        links: [{ href: "/categories/coats-and-jackets", label: "Coats and jackets" }],
      },
    ],
    faqs: [
      {
        question: "How do I find Prada nylon bags specifically?",
        answer:
          "Search nylon or re-edition on the brand page. Filter visually for triangular logo placement and crossbody strap styles in thumbnails.",
      },
      {
        question: "Is Prada sizing consistent across listings?",
        answer:
          "Sizing varies by batch and seller. Always read size notes on the LitBuy listing and compare QC photos for shoulder and length when buying apparel.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-chrome-hearts-finds": buildGuide("best-chrome-hearts-finds", "brands", {
    title: "How to Browse Chrome Hearts Finds",
    metaDescription:
      "How to browse Chrome Hearts finds on LitBuy Finds — jewelry, hoodies, denim, and gothic hardware across the brand catalog.",
    badge: "Brand guide",
    h1: "How to browse Chrome Hearts finds",
    intro:
      "Chrome Hearts spans jewelry, heavyweight apparel, and leather accessories with distinctive gothic hardware. Browse by item type — rings and chains behave differently in hauls than hoodies and denim.",
    cardDescription:
      "Jewelry, denim, and hardware-heavy pieces — browse Chrome Hearts.",
    sections: [
      {
        heading: "Open the Chrome Hearts brand page",
        paragraphs: [
          "All CH-tagged listings aggregate on the brand page. Jewelry, tees, and outerwear share space — decide your lane before scrolling.",
        ],
        links: [{ href: "/brands/chrome-hearts", label: "Chrome Hearts brand page" }],
      },
      {
        heading: "Browse jewelry in accessories",
        paragraphs: [
          "Chains, rings, and pendants often double-tag under accessories. Check both the brand page and accessories category when hunting small hardware pieces.",
        ],
        links: [{ href: "/categories/accessories", label: "Accessories category" }],
      },
      {
        heading: "Apparel runs heavy — plan haul weight",
        paragraphs: [
          "Chrome Hearts hoodies and denim add significant weight to international shipments. Browse apparel alongside shipping guides if you are stacking multiple pieces.",
        ],
        links: [{ href: "/guides/how-shipping-works-with-agents", label: "Shipping and hauls" }],
      },
      {
        heading: "Use QC for engraving and cross details",
        paragraphs: [
          "Hardware engraving and cross motifs are the main comparison points. QC photos show fine details that listing thumbnails compress.",
        ],
        links: [{ href: "/guides/how-to-check-qc-photos", label: "How to check QC photos" }],
      },
    ],
    faqs: [
      {
        question: "Should I buy Chrome Hearts jewelry with clothing?",
        answer:
          "You can, but jewelry ships light while denim and hoodies add bulk. Many buyers approve apparel QC first, then add jewelry to the same haul.",
      },
      {
        question: "How do I spot style variations on the brand page?",
        answer:
          "Read title keywords — dagger, floral, classic cross — and compare QC for engraving depth. Similar photos can be different batches.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-moncler-finds": buildGuide("best-moncler-finds", "brands", {
    title: "How to Browse Moncler Finds",
    metaDescription:
      "How to browse Moncler finds on LitBuy Finds — puffers, vests, badge placement, and seasonal outerwear on the brand page.",
    badge: "Brand guide",
    h1: "How to browse Moncler finds",
    intro:
      "Moncler finds center on insulated outerwear — puffers, vests, and lightweight down layers. Browse seasonally and compare badge placement, quilting, and length in listing photos.",
    cardDescription:
      "Puffers, vests, and down layers — browse Moncler outerwear.",
    sections: [
      {
        heading: "Start on the Moncler brand page",
        paragraphs: [
          "The Moncler brand page collects down jackets, vests, and related apparel. Sort mentally by length — cropped vs long — before comparing prices.",
        ],
        links: [{ href: "/brands/moncler", label: "Moncler brand page" }],
      },
      {
        heading: "Cross-browse coats and jackets",
        paragraphs: [
          "Some Moncler rows tag into the broader outerwear category. If the brand page feels limited, check coats and jackets for additional puffer listings.",
        ],
        links: [{ href: "/categories/coats-and-jackets", label: "Coats and jackets" }],
      },
      {
        heading: "Compare badge and quilting in QC",
        paragraphs: [
          "Arm patch placement and baffle pattern are common comparison points. Open QC when linked — warehouse angles show puff loft better than flat seller photos.",
        ],
        links: [{ href: "/guides/how-to-check-qc-photos", label: "QC photo guide" }],
      },
      {
        heading: "Layer with hoodies for transitional weather",
        paragraphs: [
          "Light Moncler vests pair with hoodies from the streetwear category. Browse both when building a fall rotation instead of only heavy puffers.",
        ],
        links: [{ href: "/categories/hoodies", label: "Hoodie category" }],
      },
    ],
    faqs: [
      {
        question: "How do I choose between Moncler listings at similar prices?",
        answer:
          "Compare fill weight notes in titles, patch style, hood vs stand collar, and length. QC photos help judge quilting consistency.",
      },
      {
        question: "Are Moncler vests on the same brand page?",
        answer:
          "Yes — vests and jackets share the Moncler brand page. Search vest if you want sleeveless styles only.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-ralph-lauren-finds": buildGuide("best-ralph-lauren-finds", "brands", {
    title: "How to Browse Ralph Lauren Finds",
    metaDescription:
      "How to browse Ralph Lauren finds on LitBuy Finds — polos, knits, preppy layers, and the brand page for classic rotation pieces.",
    badge: "Brand guide",
    h1: "How to browse Ralph Lauren finds",
    intro:
      "Ralph Lauren finds skew preppy — polos, knits, oxford shirts, and classic outerwear. Browse the brand page when you want clean rotation pieces rather than loud streetwear graphics.",
    cardDescription:
      "Polos, knits, and preppy layers — browse Ralph Lauren finds.",
    sections: [
      {
        heading: "Use the Ralph Lauren brand page",
        paragraphs: [
          "The brand page groups polo shirts, sweaters, jackets, and accessories under one label. Start here for a full view of preppy staples in the catalog.",
        ],
        links: [{ href: "/brands/ralph-lauren", label: "Ralph Lauren brand page" }],
      },
      {
        heading: "Browse by garment type",
        paragraphs: [
          "Polos and tees behave differently from cable knits and outerwear in sizing. Open one garment category per session — tees in the t-shirt lane, layers in jackets.",
        ],
        links: [
          { href: "/categories/tshirts", label: "T-shirt category" },
          { href: "/categories/jackets", label: "Jacket category" },
        ],
      },
      {
        heading: "Look for pony placement variants",
        paragraphs: [
          "Logo size and position vary by listing. Compare chest pony vs sleeve embroidery in photos and QC when you care about a specific look.",
        ],
      },
      {
        heading: "Pair with budget lanes for basics",
        paragraphs: [
          "Simple RL tees and polos sometimes overlap with budget collections. Check deals when you want rotation basics at lower price points.",
        ],
        links: [{ href: "/deals", label: "Budget finds under $30" }],
      },
    ],
    faqs: [
      {
        question: "Where do Ralph Lauren polos show up?",
        answer:
          "Primarily on the Ralph Lauren brand page and sometimes in the t-shirt category. Search polo on the brand page for a tighter list.",
      },
      {
        question: "How does Ralph Lauren sizing compare to streetwear?",
        answer:
          "Many RL listings follow a more classic fit than oversized streetwear. Read size charts on LitBuy listings and compare QC shoulder measurements when available.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-supreme-finds": buildGuide("best-supreme-finds", "brands", {
    title: "How to Browse Supreme Finds",
    metaDescription:
      "How to browse Supreme finds on LitBuy Finds — box logos, accessories, seasonal drops, and navigating the brand page.",
    badge: "Brand guide",
    h1: "How to browse Supreme finds",
    intro:
      "Supreme listings mix box logo hoodies, tees, accessories, and collab pieces with inconsistent naming from spreadsheet sources. Browse the brand page and use drop-era keywords when you hunt specific graphics.",
    cardDescription:
      "Box logos, accessories, and seasonal graphics — browse Supreme.",
    sections: [
      {
        heading: "Start on the Supreme brand page",
        paragraphs: [
          "The Supreme brand page is the hub for every tagged row. Hoodies, tees, and accessories interleave — filter by thumbnail shape or search box logo, tee, or beanie.",
        ],
        links: [{ href: "/brands/supreme", label: "Supreme brand page" }],
      },
      {
        heading: "Separate apparel from accessories",
        paragraphs: [
          "Keychains, caps, and small goods ship differently than hoodies. Browse accessories when you want a light add-on; stay on brand apparel for box logo layers.",
        ],
        links: [{ href: "/categories/accessories", label: "Accessories" }],
      },
      {
        heading: "Check streetwear collections for hype pieces",
        paragraphs: [
          "Trending Supreme rows often surface in streetwear collections before you find them on a long brand scroll. Cross-check when hunting current graphics.",
        ],
        links: [
          { href: "/top-streetwear-finds", label: "Top streetwear finds" },
          { href: "/trending", label: "Trending finds" },
        ],
      },
      {
        heading: "Compare print placement in QC",
        paragraphs: [
          "Box logo centering and tag details matter for graphic pieces. QC photos show print edges and neck tag layout more clearly than compressed listing images.",
        ],
        links: [{ href: "/guides/how-to-check-qc-photos", label: "QC photo guide" }],
      },
    ],
    faqs: [
      {
        question: "How do I find box logo hoodies specifically?",
        answer:
          "Search box logo or bogo on the Supreme brand page. Compare multiple listings at similar prices and use QC for logo centering.",
      },
      {
        question: "Are Supreme accessories worth a separate browse?",
        answer:
          "Yes — accessories are lower weight and often simpler to QC. Browse the brand page and accessories category when you want caps, bags, or small goods.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),
};
