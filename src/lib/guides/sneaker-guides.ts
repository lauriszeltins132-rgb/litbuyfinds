import { buildGuide } from "./build";
import { CORE_LINKS } from "./shared";
import type { GuidePage } from "./types";

export const SNEAKER_GUIDES: Record<string, GuidePage> = {
  "best-rep-sneakers": buildGuide("best-rep-sneakers", "sneakers", {
    title: "Best Rep Sneakers — How to Browse",
    metaDescription:
      "How to browse popular rep sneaker finds on LitBuy Finds — collections, trending picks, and what to compare before you buy through an agent.",
    badge: "Sneaker guide",
    h1: "Best rep sneakers",
    intro:
      "There is no single best pair for everyone — batches, budgets, and fit preferences differ. This guide points you to the right discovery pages so you can compare silhouettes and prices without scrolling a raw spreadsheet.",
    cardDescription:
      "Where to browse popular sneaker finds and how to narrow down.",
    sections: [
      {
        heading: "Start with curated collections",
        paragraphs: [
          "Top rep sneakers and best rep sneakers pages group high-traffic silhouettes — runners, basketball shapes, and everyday retro styles — with photos and agent links ready to open.",
        ],
        links: [
          { href: "/top-rep-sneakers", label: "Top rep sneakers" },
          { href: "/best-rep-sneakers", label: "Best rep sneakers" },
        ],
      },
      {
        heading: "Compare before you commit",
        paragraphs: [
          "Open a few listings side by side. Note price, listed batch if available, and whether QC references exist. Save favorites to your wishlist while you decide.",
        ],
        links: [
          { href: "/trending", label: "Trending finds" },
          { href: "/wishlist", label: "Saved items" },
        ],
      },
      {
        heading: "Read sizing and QC notes",
        paragraphs: [
          "Sneaker sizing varies by factory. Check comments when present and plan to request warehouse QC on pairs that matter. Our shoe QC checklist covers what to look for in photos.",
        ],
        links: [
          { href: "/guides/qc-checklist-for-shoes", label: "Shoe QC checklist" },
          { href: "/categories/shoes", label: "All shoe finds" },
        ],
      },
      {
        heading: "Buy through LitBuy when ready",
        paragraphs: [
          "When a pair looks right, click through to LitBuy, confirm size and colorway, and pay. Wait for warehouse QC before you add it to an international haul.",
        ],
        links: [{ href: "/guides/how-to-order-from-litbuy", label: "How to order" }],
      },
    ],
    faqs: [
      {
        question: "Which silhouette should a beginner start with?",
        answer:
          "Many buyers start with a widely reviewed model in their size range — something with lots of QC albums and sizing notes online. Browse trending first, then pick a price you are comfortable testing.",
      },
      {
        question: "Are the top lists updated?",
        answer:
          "Collections reflect catalog imports and popularity signals. Check recently added for fresh drops that have not landed on top lists yet.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-nike-finds": buildGuide("best-nike-finds", "sneakers", {
    title: "Best Nike Finds — How to Browse",
    metaDescription:
      "How to find Nike sneaker and apparel listings on LitBuy Finds — top Nike collections, brand filters, and browsing tips without hype.",
    badge: "Nike guide",
    h1: "Best Nike finds",
    intro:
      "Nike covers a huge slice of the catalog — Dunks, Air Max, trainers, and collab colorways. Use brand pages and Nike-focused collections to filter noise and compare options quickly.",
    cardDescription:
      "Nike sneakers and gear — where to browse on LitBuy Finds.",
    sections: [
      {
        heading: "Nike-focused collections",
        paragraphs: [
          "Top Nike finds surfaces listings tagged or titled with Nike across shoes and apparel. Good when you want inspiration without picking a single model first.",
        ],
        links: [{ href: "/top-nike-finds", label: "Top Nike finds" }],
      },
      {
        heading: "Filter the full Nike brand page",
        paragraphs: [
          "The Nike brand hub shows everything we detect as Nike in the catalog — sneakers, tees, socks, and accessories. Sort by price or recency depending on whether you are hunting a grail or a budget pickup.",
        ],
        links: [{ href: "/brands/nike", label: "Browse Nike brand" }],
      },
      {
        heading: "Cross-check silhouettes",
        paragraphs: [
          "Popular Nike shapes also appear on general shoe and trending pages. If a colorway sold out in one collection, search by model name — imports sometimes land under different titles.",
        ],
        links: [
          { href: "/categories/shoes", label: "Shoe category" },
          { href: "/trending", label: "Trending" },
        ],
      },
    ],
    faqs: [
      {
        question: "Does Nike include Jordan on this site?",
        answer:
          "Jordan is tracked as its own brand for browsing. Nike pages may still show overlapping styles — use the Jordan guide if you want Jumpman-specific filters.",
      },
      {
        question: "How do I find collab colorways?",
        answer:
          "Search the catalog by collab keywords or scan trending after major drops. Curated Nike collections often pick up hype pairs once they are imported.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-jordan-finds": buildGuide("best-jordan-finds", "sneakers", {
    title: "Best Jordan Finds — How to Browse",
    metaDescription:
      "How to browse Jordan sneaker finds on LitBuy Finds — brand filters, popular silhouettes, and what to check before ordering through an agent.",
    badge: "Jordan guide",
    h1: "Best Jordan finds",
    intro:
      "Jordan spans retro highs, mids, lows, and modern performance lines. The brand page is the fastest way to see what is in the catalog right now — then narrow by price and photo quality.",
    cardDescription:
      "Jordan sneakers — browse by brand, silhouette, and budget.",
    sections: [
      {
        heading: "Start on the Jordan brand hub",
        paragraphs: [
          "The Jordan brand page aggregates detected listings across colorways and years. Use it when you know you want Jumpman-branded shoes rather than general Nike trainers.",
        ],
        links: [{ href: "/brands/jordan", label: "Browse Jordan brand" }],
      },
      {
        heading: "Know your silhouette",
        paragraphs: [
          "1s, 3s, 4s, 11s, and mids each fit differently and vary by batch. Decide silhouette first, then compare prices within that shape instead of scrolling the entire brand feed.",
        ],
      },
      {
        heading: "QC matters on structured pairs",
        paragraphs: [
          "Jordan retros with firm toe boxes and clear panel lines show flaws in photos. Request warehouse QC and use our shoe checklist — especially on higher-priced pairs.",
        ],
        links: [
          { href: "/guides/qc-checklist-for-shoes", label: "Shoe QC checklist" },
          { href: "/qc", label: "QC references" },
        ],
      },
      {
        heading: "Watch trending for new drops",
        paragraphs: [
          "Fresh Jordan colorways often spike on trending before they settle into brand filters. Recently added is another lane if you want imports from the latest sheet.",
        ],
        links: [{ href: "/trending", label: "Trending finds" }],
      },
    ],
    faqs: [
      {
        question: "Are mids cheaper than highs?",
        answer:
          "Usually, yes — mids often sit lower in the catalog on average. Compare within the same silhouette family rather than across completely different models.",
      },
      {
        question: "How do I search a specific colorway?",
        answer:
          "Use catalog search with model number or nickname — for example Chicago, Bred, or UNC. Spelling varies in source rows, so try short keywords if the full name fails.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-adidas-finds": buildGuide("best-adidas-finds", "sneakers", {
    title: "Best Adidas Finds — How to Browse",
    metaDescription:
      "How to browse Adidas sneaker finds — Samba, Campus, Gazelle, runners, and more on LitBuy Finds with brand filters and browsing tips.",
    badge: "Adidas guide",
    h1: "Best Adidas finds",
    intro:
      "Adidas has come back strong in everyday rotation — terrace classics, Sambas, and boost runners all show up in the catalog. The brand page is your home base; trending catches viral colorways early.",
    cardDescription:
      "Adidas sneakers — Sambas, Campus, runners, and more.",
    sections: [
      {
        heading: "Browse the Adidas brand page",
        paragraphs: [
          "Filter the full Adidas inventory for shoes, slides, and apparel. Price sorting helps when you want entry-level terrace styles versus premium collaborations.",
        ],
        links: [{ href: "/brands/adidas", label: "Browse Adidas brand" }],
      },
      {
        heading: "Terrace and lifestyle staples",
        paragraphs: [
          "Samba, Gazelle, and Campus listings cluster heavily in Adidas searches. Compare gum sole shades and suede tone in listing photos — batches differ in material depth.",
        ],
      },
      {
        heading: "Runners and sport lines",
        paragraphs: [
          "Ultraboost, Samba alternatives, and training silhouettes appear alongside lifestyle pairs. Check sole type if you need grip for actual sport versus casual wear.",
        ],
        links: [{ href: "/categories/shoes", label: "All shoes" }],
      },
      {
        heading: "Pair with QC on suede pairs",
        paragraphs: [
          "Suede creasing and toe shape show in warehouse photos. Worth a QC pass on pairs above your comfort zone price — our checklist covers what to scan quickly.",
        ],
        links: [{ href: "/guides/qc-checklist-for-shoes", label: "Shoe QC checklist" }],
      },
    ],
    faqs: [
      {
        question: "Why do two Sambas at different prices look similar?",
        answer:
          "Different factories and material grades sit at different price points. Read titles, compare photos, and check QC references when available.",
      },
      {
        question: "Are Adidas slides worth browsing here?",
        answer:
          "Yes — slides and foam sandals often land under Adidas brand filters at low prices. QC is still useful for strap alignment and sole mold.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-new-balance-finds": buildGuide("best-new-balance-finds", "sneakers", {
    title: "Best New Balance Finds — How to Browse",
    metaDescription:
      "How to browse New Balance sneaker finds — 550, 2002R, 990 series, and daily runners on LitBuy Finds with brand-first discovery tips.",
    badge: "New Balance guide",
    h1: "Best New Balance finds",
    intro:
      "New Balance punches above its weight for daily wear — retro runners, dad-shoe silhouettes, and clean colorways at a range of prices. Start on the brand hub, then drill into the shape you actually want to wear.",
    cardDescription:
      "New Balance 550, 2002R, 990s — where to browse and compare.",
    sections: [
      {
        heading: "New Balance brand hub",
        paragraphs: [
          "The New Balance page lists detected NB footwear and apparel in one feed. Sort by recently added if you are chasing new gray colorways or collab tones.",
        ],
        links: [{ href: "/brands/new-balance", label: "Browse New Balance" }],
      },
      {
        heading: "Pick your silhouette family",
        paragraphs: [
          "550s skew lifestyle retro. 2002R and 1906R bring chunkier midsole lines. 990 series sits at a higher price tier in most catalogs. Filter mentally before you compare ten unrelated models.",
        ],
      },
      {
        heading: "Check N logo and suede panels",
        paragraphs: [
          "NB QC often comes down to N placement, suede cut, and midsole curve. Warehouse photos make batch differences obvious — use the shoe checklist when you are unsure.",
        ],
        links: [{ href: "/guides/qc-checklist-for-shoes", label: "Shoe QC checklist" }],
      },
      {
        heading: "Budget-friendly NB picks",
        paragraphs: [
          "Not every NB listing is a premium 990. Scan lower price bands on the brand page or under-$50 collections for simpler runners and sale colorways.",
        ],
        links: [{ href: "/deals", label: "Deals under $30" }],
      },
    ],
    faqs: [
      {
        question: "Do New Balance sizes run true?",
        answer:
          "Depends on model and factory. 550s often run slightly small in some batches — read buyer sizing notes and consider half size up when unsure.",
      },
      {
        question: "Where do collab pairs show up?",
        answer:
          "Search by collab name or check trending after a drop. They import like any other row once curators add them to the sheet.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-asics-finds": buildGuide("best-asics-finds", "sneakers", {
    title: "Best Asics Finds — How to Browse",
    metaDescription:
      "How to browse Asics sneaker finds — Gel-Kayano, Gel-NYC, GT-2160, and sport styles on LitBuy Finds with brand filters and QC tips.",
    badge: "Asics guide",
    h1: "Best Asics finds",
    intro:
      "Asics has moved from pure performance to street rotation — gel cushioning, layered uppers, and Y2K runners are all over the catalog. The brand page collects them; trending shows what buyers click this week.",
    cardDescription:
      "Asics Gel runners and lifestyle pairs — how to browse.",
    sections: [
      {
        heading: "Asics brand page",
        paragraphs: [
          "Browse all detected Asics listings in one place — running staples, Gel-NYC lifestyle pairs, and retro sport styles. Photo-first sorting helps when color accuracy matters.",
        ],
        links: [{ href: "/brands/asics", label: "Browse Asics brand" }],
      },
      {
        heading: "Lifestyle vs performance",
        paragraphs: [
          "Gel-NYC and similar fashion-forward shapes prioritize look over marathon specs. True performance models may appear too — read titles for intended use if you need arch support for sport.",
        ],
      },
      {
        heading: "Gel detailing and panel layers",
        paragraphs: [
          "Asics QC focus areas include gel window clarity, tiger stripe alignment, and layered mesh symmetry. Request angles that show both medial and lateral sides.",
        ],
        links: [{ href: "/guides/qc-checklist-for-shoes", label: "Shoe QC checklist" }],
      },
      {
        heading: "Find complementary styles",
        paragraphs: [
          "Asics pairs often sit next to New Balance and Adidas on trending — good for building a rotation with similar vibe at different price points.",
        ],
        links: [{ href: "/trending", label: "Trending finds" }],
      },
    ],
    faqs: [
      {
        question: "Are Asics wide-foot friendly?",
        answer:
          "Some Gel models run narrow depending on batch. Check width notes in listing text and compare insole photos in QC when available.",
      },
      {
        question: "Is Asics only for runners?",
        answer:
          "Not anymore — a large share of catalog Asics is lifestyle. Filter by model name if you specifically want a trail or marathon shoe.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-sneakers-under-50": buildGuide("best-sneakers-under-50", "sneakers", {
    title: "Best Sneakers Under $50 — How to Browse",
    metaDescription:
      "How to find sneaker picks under $50 on LitBuy Finds — budget collections, shoe category filters, and realistic expectations for sub-$50 pairs.",
    badge: "Budget sneakers",
    h1: "Best sneakers under $50",
    intro:
      "Fifty dollars is a sweet spot for a test pair or daily beater — not every silhouette lands here, but plenty of casual styles do. Use price-capped collections first, then widen to the shoe category if you need more options.",
    cardDescription:
      "Sub-$50 sneaker finds — collections, filters, and smart buys.",
    sections: [
      {
        heading: "Budget collections",
        paragraphs: [
          "Top products under $50 gathers sub-fifty listings across categories with photos prioritized. Sneakers rotate in as imports update — check back if your size is not there today.",
        ],
        links: [{ href: "/top-products-under-50", label: "Top under $50" }],
      },
      {
        heading: "Filter the shoe category",
        paragraphs: [
          "The shoes category is the full footwear feed. Mentally cap at $50 while you scroll, or use deals pages for even lower entry points on slides and simple runners.",
        ],
        links: [
          { href: "/categories/shoes", label: "All shoes" },
          { href: "/deals", label: "Deals under $30" },
        ],
      },
      {
        heading: "Set expectations at this price",
        paragraphs: [
          "Under $50 usually means simpler materials and fewer QC requests included. Great for first hauls and beaters — less ideal when you want premium batch consistency on hyped silhouettes.",
        ],
      },
      {
        heading: "Still request QC on your test pair",
        paragraphs: [
          "Budget does not mean skip warehouse photos. Wrong size on a cheap pair still wastes shipping. A quick QC pass beats receiving unwearable shoes.",
        ],
        links: [
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC" },
          { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I get Jordan or Dunk styles under $50?",
        answer:
          "Sometimes simpler colorways or sale rows dip under $50, but most popular silhouettes sit higher. Browse budget collections first, then search by model if you have a specific shape in mind.",
      },
      {
        question: "Does under $50 include shipping?",
        answer:
          "Listed prices are item cost before agent fees and international freight. All-in cost is higher — budget $60–$80 total for a single pair on many shipping lines.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),
};
