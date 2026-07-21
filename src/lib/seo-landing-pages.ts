import type { StaticPageSection } from "./static-pages";
import { getEditorsPicks } from "./discovery";
import { getSpreadsheetMetadataCopy } from "./metadata-copy";
import { filterFeaturedEligible } from "./product-media";
import { hasExactPrice } from "./pricing";
import { getAllProducts, getTrendingProducts } from "./products";
import { TOP_LISTS } from "./top-lists";
import type { Product } from "./types";

export type SeoLandingConfig = {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  badge: string;
  h1: string;
  intro: string;
  sections: StaticPageSection[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
  getProducts: () => Product[];
  productSectionTitle: string;
};

function priced(items: Product[]) {
  return items.filter((p) => hasExactPrice(p.price));
}

function byCategory(...slugs: string[]) {
  return priced(getAllProducts().filter((p) => slugs.includes(p.category_slug)));
}

function withQc(limit = 72) {
  return filterFeaturedEligible(
    priced(getAllProducts().filter((p) => p.qc_link))
  ).slice(0, limit);
}

function byKeyword(...terms: string[]) {
  const lower = terms.map((t) => t.toLowerCase());
  return priced(
    getAllProducts().filter((p) =>
      lower.some((t) => p.product_name.toLowerCase().includes(t))
    )
  );
}

function byMaxPrice(max: number, limit = 96) {
  return filterFeaturedEligible(
    priced(getAllProducts().filter((p) => (p.price ?? Infinity) <= max))
  ).slice(0, limit);
}

function latestFinds(limit = 96) {
  return filterFeaturedEligible(
    priced(
      getAllProducts().filter((p) => p.category_slug === "latest-finds")
    )
  ).slice(0, limit);
}

const RESOURCE_LINKS = [
  { href: "/litbuy-finds", label: "LitBuy finds" },
  { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
  { href: "/litbuy-qc", label: "LitBuy QC" },
  { href: "/guides", label: "All guides" },
];

export const SEO_LANDING_PAGES: Record<string, SeoLandingConfig> = {
  "litbuy-spreadsheet": {
    slug: "litbuy-spreadsheet",
    path: "/litbuy-spreadsheet",
    title: getSpreadsheetMetadataCopy().title,
    metaDescription: getSpreadsheetMetadataCopy().description,
    badge: "LitBuy resource",
    h1: "LitBuy spreadsheet guide",
    intro:
      "The LitBuy spreadsheet lists thousands of Weidian and Taobao finds with prices and QC notes. LitBuy Finds turns that same catalog into searchable product pages with photos, filters, categories, and LitBuy buy buttons — so you spend less time scrolling rows and more time shortlisting real products.",
    sections: [
      {
        heading: "What a LitBuy spreadsheet contains",
        paragraphs: [
          "Most community spreadsheets list product names, thumbnail images, seller URLs, approximate prices, and sometimes QC photo references from previous buyers. They are powerful for power users but difficult to search on mobile and hard to share one product at a time.",
          "LitBuy Finds imports catalog data and normalizes it into product pages. Each page shows pricing, category, brand tags, QC status, and a direct LitBuy buy link — the same outcome as copying a row from a sheet, but faster to browse.",
        ],
        links: [
          { href: "/collections/litbuy-spreadsheet-alternative", label: "Spreadsheet alternative" },
          { href: "/litbuy-products", label: "Browse products" },
        ],
      },
      {
        heading: "How to use spreadsheets with LitBuy Finds",
        paragraphs: [
          "Start on the homepage and search by brand — Nike, Jordan, Moncler, and more. When you find something worth a closer look, open the product page, check QC references if available, then follow the LitBuy link to confirm size, batch, and live price.",
          "If you already have a spreadsheet URL or seller link, you can still paste it into LitBuy when ordering. LitBuy Finds is the discovery layer; LitBuy is where checkout, QC, and shipping happen.",
        ],
        links: [
          { href: "/guides/litbuy-spreadsheet", label: "Extended guide" },
          { href: "/litbuy-weidian", label: "Weidian finds" },
        ],
      },
      {
        heading: "Why curated pages beat raw rows",
        paragraphs: [
          "Spreadsheets do not filter by image quality, QC availability, or category automatically. LitBuy Finds ranks popular products, hides broken listings where possible, and surfaces related finds so you can build a haul without jumping between tabs.",
          "Collection pages like best Nike finds or QC-approved picks are designed for sharing in Discord, Reddit, and TikTok bios — cleaner than sending someone a 5,000-row Google Sheet.",
        ],
        links: [
          { href: "/best-litbuy-finds", label: "Best LitBuy finds" },
          { href: "/collections/best-qc-approved-finds", label: "QC finds" },
        ],
      },
      {
        heading: "Buying safely from spreadsheet links",
        paragraphs: [
          "Always confirm the live LitBuy price before paying — spreadsheet prices can lag behind seller updates. Request warehouse QC photos for anything you plan to ship internationally, especially jackets, bags, and sneakers.",
          "Use LitBuy Finds to shortlist products, then manage purchases in your LitBuy dashboard. That workflow keeps discovery separate from payment and tracking.",
        ],
        links: [
          { href: "/litbuy-qc", label: "LitBuy QC guide" },
          { href: "/how-to-buy", label: "How to buy" },
        ],
      },
      {
        heading: "Popular brands in the LitBuy spreadsheet universe",
        paragraphs: [
          "Nike and Jordan dominate sneaker rows, while Moncler, Canada Goose, and Arc'teryx lead jacket searches. Louis Vuitton, Gucci, and Goyard appear frequently in bag sections. Use brand pages on LitBuy Finds instead of scanning entire sheets when you know what you want.",
          "Category pages for shoes, coats and jackets, hoodies, and accessories mirror how spreadsheets are organized — but with filters, sort options, and shareable product URLs.",
        ],
        links: [
          { href: "/brands/nike", label: "Nike finds" },
          { href: "/brands/jordan", label: "Jordan finds" },
          { href: "/brands/moncler", label: "Moncler finds" },
          { href: "/categories/shoes", label: "Shoe category" },
        ],
      },
      {
        heading: "When to switch from spreadsheet to LitBuy Finds",
        paragraphs: [
          "Keep your spreadsheet for batch comparisons and seller notes you have collected over time. Use LitBuy Finds when you want to search on mobile, share a single product link, or browse QC-approved picks without downloading a new file every week.",
          "Many buyers bookmark both: the spreadsheet for reference and LitBuy Finds for daily discovery. The product grid below highlights current editor picks that would otherwise be buried mid-sheet.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is LitBuy Finds the same as a LitBuy spreadsheet?",
        answer:
          "They share the same product universe. LitBuy Finds is a searchable catalog built on spreadsheet and agent data — not a replacement for your LitBuy account.",
      },
      {
        question: "Can I still use my old spreadsheet?",
        answer:
          "Yes. Many buyers use both — spreadsheets for raw data and LitBuy Finds for faster discovery and sharing.",
      },
      {
        question: "How often is the catalog updated?",
        answer:
          "The dataset syncs daily. New finds appear in Recently Added and collection pages after each sync.",
      },
    ],
    relatedLinks: [
      { href: "/litbuy-finds", label: "LitBuy finds" },
      { href: "/litbuy-guide", label: "LitBuy guide hub" },
      ...RESOURCE_LINKS,
    ],
    getProducts: () => getEditorsPicks(48),
    productSectionTitle: "Featured LitBuy spreadsheet picks",
  },

  "litbuy-qc": {
    slug: "litbuy-qc",
    path: "/litbuy-qc",
    title: "LitBuy QC Photos Guide",
    metaDescription:
      "LitBuy QC explained — reference photos, warehouse QC, what to check before shipping, and where to find QC-approved finds on LitBuy Finds.",
    badge: "LitBuy QC",
    h1: "LitBuy QC photos",
    intro:
      "QC (quality control) photos are the safety net of agent buying. LitBuy Finds links to QC references where available, and LitBuy lets you request warehouse photos of your exact item before you ship your haul.",
    sections: [
      {
        heading: "Reference QC vs warehouse QC",
        paragraphs: [
          "Reference QC on a find page shows photos from other buyers or batch examples. They help you compare stitching, materials, and shape before you order — but they are not photos of your specific item.",
          "Warehouse QC is taken after you pay. LitBuy staff photograph your exact product at the warehouse. That is the check that matters before international shipping.",
        ],
        links: [
          { href: "/guides/litbuy-qc-photos", label: "Detailed QC guide" },
          { href: "/best-qc-approved-finds", label: "QC-approved list" },
        ],
      },
      {
        heading: "What to look for in QC photos",
        paragraphs: [
          "Check logo placement, sole shape, zipper quality, and color accuracy under normal lighting. For jackets, inspect stitching on cuffs and hem. For bags, verify hardware engraving and lining.",
          "If something looks off, you can often exchange or refund before shipping — but only if you review QC in time. Do not approve items you are unsure about.",
        ],
        links: [
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC" },
          { href: "/litbuy-jackets", label: "Jacket finds" },
        ],
      },
      {
        heading: "Finding QC-linked products",
        paragraphs: [
          "Use the Top QC Finds rail on the homepage or browse QC-approved collection pages. Products with QC references are marked on their listing pages.",
          "Popular sneakers and designer bags tend to have the most community QC threads — search by brand for the best results.",
        ],
        links: [
          { href: "/collections/best-qc-approved-finds", label: "QC collection" },
          { href: "/litbuy-sneakers", label: "Sneaker finds" },
        ],
      },
      {
        heading: "QC workflow on LitBuy",
        paragraphs: [
          "After you pay, LitBuy receives the item at a Chinese warehouse. You can request detailed photos before approving shipment. This is separate from reference QC on find pages, which shows examples from other orders.",
          "Approve QC only when you are satisfied. If stitching, color, or hardware looks wrong, contact support through LitBuy before the parcel leaves the warehouse.",
        ],
        links: [
          { href: "/guides/how-to-check-qc-photos", label: "Check QC photos" },
          { href: "/litbuy-guide", label: "LitBuy guide hub" },
        ],
      },
      {
        heading: "Categories where QC matters most",
        paragraphs: [
          "Sneakers, designer bags, and puffer jackets benefit most from QC because small details affect resale value and wearability. Budget tees and accessories are lower risk but still worth a quick warehouse check.",
          "LitBuy Finds surfaces QC-linked listings in dedicated rails and on this page's product grid so you can build a haul with fewer surprises.",
        ],
        links: [
          { href: "/best-litbuy-sneakers-2026", label: "Best sneakers 2026" },
          { href: "/best-litbuy-jackets-2026", label: "Best jackets 2026" },
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need a LitBuy account for QC?",
        answer:
          "You can view reference QC on LitBuy Finds without an account. Warehouse QC for your orders requires a LitBuy account after you purchase.",
      },
      {
        question: "Are QC photos guaranteed?",
        answer:
          "Reference QC availability varies by product. Warehouse QC is requested per order on LitBuy after the item arrives.",
      },
    ],
    relatedLinks: [
      { href: "/litbuy-finds", label: "LitBuy finds" },
      { href: "/litbuy-spreadsheet", label: "Spreadsheet guide" },
      ...RESOURCE_LINKS,
    ],
    getProducts: withQc,
    productSectionTitle: "QC-approved LitBuy finds",
  },

  "litbuy-finds": {
    slug: "litbuy-finds",
    path: "/litbuy-finds",
    title: "LitBuy Finds Catalog",
    metaDescription:
      "Browse verified sneaker, fashion and streetwear finds. LitBuy is our recommended agent — or choose Kakobuy, OopBuy, ACBuy, MuleBuy and HipoBuy before buying.",
    badge: "LitBuy Finds",
    h1: "LitBuy finds",
    intro:
      "LitBuy Finds is a searchable catalog of products sourced from the LitBuy spreadsheet. Browse clothing, sneakers, bags, accessories, and other finds using product images, prices, categories, QC links, and direct LitBuy purchase links — updated daily from live catalog imports.",
    sections: [
      {
        heading: "What makes LitBuy Finds different",
        paragraphs: [
          "Instead of scrolling a raw LitBuy spreadsheet, you get product pages with images, categories, QC badges, and related picks. Every outbound buy button opens a tested LitBuy listing.",
          "The catalog covers sneakers, outerwear, hoodies, bags, accessories, and more — updated daily as new rows are added to the underlying dataset.",
        ],
        links: [
          { href: "/brands", label: "All brands" },
          { href: "/categories", label: "Categories" },
        ],
      },
      {
        heading: "How to search effectively",
        paragraphs: [
          "Use the homepage search for brands like Nike, Jordan, Moncler, or product types like jackets and bags. Filter the full catalog by category and price once you scroll to Browse All Finds.",
          "Check Popular Today and Top QC Finds for community-weighted picks before diving into the full catalog.",
        ],
        links: [
          { href: "/most-popular-finds-now", label: "Popular today" },
          { href: "/trending", label: "Trending" },
        ],
      },
      {
        heading: "From discovery to delivery",
        paragraphs: [
          "LitBuy Finds helps you discover. LitBuy handles purchase, warehouse storage, QC, and international shipping. Register on LitBuy before your first order to unlock verified links and tracking.",
          "Save products to your wishlist on LitBuy Finds, then open LitBuy when you are ready to build a haul.",
        ],
        links: [
          { href: "/litbuy-guide", label: "LitBuy guide" },
          { href: "/how-to-buy", label: "How to buy" },
        ],
      },
      {
        heading: "LitBuy Finds vs LitBuy spreadsheet",
        paragraphs: [
          "Community LitBuy spreadsheets are often shared as Google Sheets or Excel files with thousands of rows. LitBuy Finds indexes the same product universe into pages you can search, filter, and share individually.",
          "If you are looking for the LitBuy spreadsheet experience without the scroll fatigue, start with our spreadsheet guide and the product grid below.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "Spreadsheet guide" },
          { href: "/collections/litbuy-spreadsheet-alternative", label: "Spreadsheet alternative" },
        ],
      },
      {
        heading: "Marketplaces behind the finds",
        paragraphs: [
          "Most listings originate from Weidian or Taobao sellers. LitBuy acts as the agent so you can pay in familiar currencies and ship to your country. Browse Weidian and Taobao guides for marketplace-specific tips.",
        ],
        links: [
          { href: "/litbuy-weidian", label: "Weidian guide" },
          { href: "/litbuy-taobao", label: "Taobao guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is LitBuy Finds free?",
        answer: "Yes. Browsing is free. You only pay when purchasing through LitBuy.",
      },
      {
        question: "How many products are listed?",
        answer:
          "The public catalog highlights 10,000+ curated finds with daily updates across sneakers, clothing, and accessories.",
      },
    ],
    relatedLinks: [
      { href: "/best-litbuy-finds", label: "Best finds" },
      { href: "/litbuy-products", label: "All products" },
      ...RESOURCE_LINKS,
    ],
    getProducts: () => getEditorsPicks(72),
    productSectionTitle: "Top LitBuy finds right now",
  },

  "litbuy-sneakers": {
    slug: "litbuy-sneakers",
    path: "/litbuy-sneakers",
    title: "Best LitBuy Sneakers 2026",
    metaDescription:
      "Best LitBuy sneakers in 2026 — Nike, Jordan, Adidas, New Balance picks with QC links and verified agent buy buttons.",
    badge: "LitBuy sneakers",
    h1: "LitBuy sneakers",
    intro:
      "Sneakers are the most searched category on LitBuy Finds. This page surfaces current Nike, Jordan, Adidas, and New Balance picks with photos, pricing, and direct LitBuy purchase links.",
    sections: [
      {
        heading: "Top sneaker brands on LitBuy",
        paragraphs: [
          "Nike Dunks and Air Max, Jordan retros and mids, Adidas Campus and Samba silhouettes, and New Balance 550/2002R styles dominate the catalog. Use brand filters to narrow your search.",
          "QC references matter most for sneakers — check batch comparisons before you buy and request warehouse QC after payment.",
        ],
        links: [
          { href: "/brands/nike", label: "Nike" },
          { href: "/brands/jordan", label: "Jordan" },
          { href: "/top-rep-sneakers", label: "Top sneakers list" },
        ],
      },
      {
        heading: "Sizing and batch tips",
        paragraphs: [
          "Always read the LitBuy listing for size charts — EU and US sizing varies by seller. Community QC helps you compare toe box shape and materials between batches.",
          "If you are new, start with well-reviewed sellers and lower-risk colorways before ordering grail pairs.",
        ],
        links: [
          { href: "/litbuy-qc", label: "QC guide" },
          { href: "/guides/best-rep-sneakers", label: "Sneaker guide" },
        ],
      },
      {
        heading: "Best LitBuy sneaker categories",
        paragraphs: [
          "Low-top lifestyle shoes like Dunks and Campus styles are popular entry points. Jordan 1 highs and mids remain perennial searches. Running silhouettes like New Balance 2002R offer a different aesthetic for streetwear fits.",
          "Use the sneakers category and brand filters to narrow results. The grid below updates with catalog sync so you always see current inventory.",
        ],
        links: [
          { href: "/categories/shoes", label: "All shoes" },
          { href: "/best-litbuy-sneakers-2026", label: "Best sneakers 2026" },
          { href: "/top-nike-finds", label: "Top Nike finds" },
        ],
      },
      {
        heading: "Building a sneaker haul",
        paragraphs: [
          "Combine two or three pairs with lighter items to optimize shipping weight. Request QC on every pair before approval — sole glue, stitching, and logo placement are the usual checks.",
          "LitBuy Finds links each sneaker to a verified agent listing so you do not have to hunt for working URLs in spreadsheet comments.",
        ],
      },
    ],
    faqs: [
      {
        question: "What are the best LitBuy sneakers right now?",
        answer:
          "Popular picks rotate daily. Check Popular Today and the product grid below for current Nike and Jordan heat.",
      },
    ],
    relatedLinks: [
      { href: "/best-litbuy-sneakers-2026", label: "Best sneakers 2026" },
      { href: "/litbuy-finds", label: "All finds" },
    ],
    getProducts: TOP_LISTS["top-rep-sneakers"].getProducts,
    productSectionTitle: "Best LitBuy sneakers",
  },

  "litbuy-jackets": {
    slug: "litbuy-jackets",
    path: "/litbuy-jackets",
    title: "Best LitBuy Jackets 2026",
    metaDescription:
      "Best LitBuy jackets and outerwear — Moncler, Arc'teryx, Stone Island, puffers and shells with verified links.",
    badge: "LitBuy jackets",
    h1: "LitBuy jackets",
    intro:
      "Outerwear is a high-consideration buy — QC matters even more here. Browse puffers, shells, and streetwear jackets from Moncler, Canada Goose, Arc'teryx, and more with LitBuy agent links.",
    sections: [
      {
        heading: "Popular jacket brands",
        paragraphs: [
          "Moncler and Canada Goose puffers, Arc'teryx shells, and Stone Island badges are among the most saved jacket finds. Compare photos carefully and budget for shipping — jackets are heavy.",
          "Use the coats and jackets category to filter the full catalog beyond this curated grid.",
        ],
        links: [
          { href: "/categories/coats-and-jackets", label: "Jackets category" },
          { href: "/collections/best-jackets", label: "Jacket collection" },
          { href: "/brands/moncler", label: "Moncler" },
        ],
      },
      {
        heading: "QC for outerwear",
        paragraphs: [
          "Inspect badge stitching, zipper brands, fill distribution, and cuff elasticity in QC photos. Reference QC on find pages helps; warehouse QC confirms your exact jacket.",
        ],
        links: [{ href: "/litbuy-qc", label: "LitBuy QC" }],
      },
      {
        heading: "Shipping jackets internationally",
        paragraphs: [
          "Outerwear is volumetric weight — expect higher freight than tees or accessories. Many buyers time jacket purchases around seasonal sales on LitBuy shipping lines.",
          "Consolidate multiple items in one haul to amortize cost. LitBuy Finds helps you plan the haul before you pay.",
        ],
        links: [
          { href: "/best-litbuy-jackets-2026", label: "Best jackets 2026" },
          { href: "/collections/best-moncler-finds", label: "Moncler collection" },
        ],
      },
      {
        heading: "Jacket styles trending on LitBuy",
        paragraphs: [
          "Puffer jackets and down-filled coats lead winter searches. Lightweight shells from outdoor brands appeal to year-round buyers. Streetwear bombers and varsity jackets round out the catalog.",
          "Browse the coats and jackets category for the full selection beyond this curated grid.",
        ],
        links: [
          { href: "/categories/coats-and-jackets", label: "Jackets category" },
          { href: "/brands/canada-goose", label: "Canada Goose" },
        ],
      },
    ],
    faqs: [
      {
        question: "Are LitBuy jackets worth the shipping cost?",
        answer:
          "Heavy items cost more to ship. Many buyers consolidate jackets with sneakers and tees in one haul to optimize freight.",
      },
    ],
    relatedLinks: [
      { href: "/best-litbuy-jackets-2026", label: "Best jackets 2026" },
      { href: "/litbuy-finds", label: "LitBuy finds" },
    ],
    getProducts: () => filterFeaturedEligible(byCategory("coats-and-jackets")).slice(0, 72),
    productSectionTitle: "Best LitBuy jackets",
  },

  "litbuy-weidian": {
    slug: "litbuy-weidian",
    path: "/litbuy-weidian",
    title: "LitBuy Weidian Finds Guide",
    metaDescription:
      "How to find and buy Weidian products through LitBuy — curated finds, verified links, and marketplace tips.",
    badge: "Weidian",
    h1: "LitBuy Weidian finds",
    intro:
      "Weidian is a major source for streetwear and sneaker finds in the LitBuy ecosystem. LitBuy Finds surfaces Weidian-linked products with searchable pages instead of raw seller URLs.",
    sections: [
      {
        heading: "Buying Weidian through LitBuy",
        paragraphs: [
          "You do not check out on Weidian directly from most countries. LitBuy places the order, receives the parcel at a Chinese warehouse, and ships internationally when you are ready.",
          "Product pages on LitBuy Finds show the source when available. Always confirm the live listing on LitBuy before paying.",
        ],
        links: [
          { href: "/guides/litbuy-weidian-finds", label: "Weidian guide" },
          { href: "/guides/how-to-buy-from-weidian", label: "How to buy Weidian" },
        ],
      },
      {
        heading: "Finding quality Weidian sellers",
        paragraphs: [
          "Use QC references and community feedback before ordering. Popular brands like Nike and Moncler have more QC threads — use them to compare batches.",
        ],
        links: [
          { href: "/litbuy-qc", label: "QC photos" },
          { href: "/trending", label: "Trending finds" },
        ],
      },
    ],
    faqs: [
      {
        question: "Weidian vs Taobao on LitBuy?",
        answer:
          "Both work through the same LitBuy workflow. Choose the listing with the best price, QC, and seller reputation.",
      },
    ],
    relatedLinks: [
      { href: "/litbuy-taobao", label: "Taobao finds" },
      { href: "/litbuy-finds", label: "LitBuy finds" },
    ],
    getProducts: () => getEditorsPicks(48),
    productSectionTitle: "Popular Weidian finds",
  },

  "litbuy-taobao": {
    slug: "litbuy-taobao",
    path: "/litbuy-taobao",
    title: "LitBuy Taobao Finds Guide",
    metaDescription:
      "Discover Taobao fashion and sneaker finds on LitBuy — searchable catalog, QC references, and verified agent links.",
    badge: "Taobao",
    h1: "LitBuy Taobao finds",
    intro:
      "Taobao offers a massive range of fashion finds. LitBuy Finds curates Taobao-linked listings so you can discover products before opening LitBuy to complete your purchase.",
    sections: [
      {
        heading: "How Taobao fits into LitBuy",
        paragraphs: [
          "LitBuy acts as your buying agent for Taobao listings — handling payment, warehouse intake, QC, and shipping abroad.",
          "Browse by category on LitBuy Finds, then follow the agent link to the matching Taobao product page inside LitBuy.",
        ],
        links: [
          { href: "/guides/litbuy-taobao-finds", label: "Taobao guide" },
          { href: "/guides/how-to-buy-from-taobao", label: "How to buy Taobao" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I search Taobao in English on LitBuy Finds?",
        answer:
          "Yes — use English brand names and keywords in the LitBuy Finds search bar.",
      },
    ],
    relatedLinks: [
      { href: "/litbuy-weidian", label: "Weidian finds" },
      { href: "/litbuy-products", label: "All products" },
    ],
    getProducts: () => filterFeaturedEligible(byCategory("shoes", "hoodies-and-pants")).slice(0, 72),
    productSectionTitle: "Taobao-linked finds",
  },

  "litbuy-guide": {
    slug: "litbuy-guide",
    path: "/litbuy-guide",
    title: "LitBuy Guide Hub",
    metaDescription:
      "Complete LitBuy guide — spreadsheets, QC photos, Weidian, Taobao, sneakers, jackets, and how to buy through LitBuy Finds.",
    badge: "LitBuy guide",
    h1: "LitBuy guide",
    intro:
      "New to LitBuy? Start here. This hub links every LitBuy Finds resource — from spreadsheet browsing to QC photos, marketplace guides, and curated product collections.",
    sections: [
      {
        heading: "Start here",
        paragraphs: [
          "If you have never used a shopping agent, read how LitBuy works, then browse the catalog by brand or category. Register on LitBuy before your first purchase to unlock verified links and order tracking.",
        ],
        links: [
          { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
          { href: "/how-to-buy", label: "How to buy" },
          { href: "/litbuy-finds", label: "Browse finds" },
        ],
      },
      {
        heading: "LitBuy resources",
        paragraphs: [
          "Deep dives on spreadsheets, QC, sneakers, jackets, Weidian, and Taobao — each with product picks and FAQs.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "Spreadsheet" },
          { href: "/litbuy-qc", label: "QC photos" },
          { href: "/litbuy-sneakers", label: "Sneakers" },
          { href: "/litbuy-jackets", label: "Jackets" },
          { href: "/litbuy-weidian", label: "Weidian" },
          { href: "/litbuy-taobao", label: "Taobao" },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between LitBuy and LitBuy Finds?",
        answer:
          "LitBuy Finds is discovery. LitBuy is the agent where you pay, QC, and ship.",
      },
    ],
    relatedLinks: [
      { href: "/guides", label: "All guides" },
      { href: "/best-litbuy-finds", label: "Best finds" },
    ],
    getProducts: () => getEditorsPicks(36),
    productSectionTitle: "Recommended finds for new users",
  },

  "best-litbuy-finds": {
    slug: "best-litbuy-finds",
    path: "/best-litbuy-finds",
    title: "Best LitBuy Finds 2026",
    metaDescription:
      "Best LitBuy finds in 2026 — editor picks, QC-approved products, trending sneakers and streetwear with verified links.",
    badge: "Best finds",
    h1: "Best LitBuy finds",
    intro:
      "The strongest picks from the LitBuy Finds catalog — combining photos, QC availability, verified buy links, and community engagement. Updated with daily catalog sync.",
    sections: [
      {
        heading: "How we pick best finds",
        paragraphs: [
          "Products are ranked using engagement signals, premium brand weighting, QC availability, and image quality. Popular Today and editor picks feed into this page.",
        ],
        links: [
          { href: "/most-popular-finds-now", label: "Popular today" },
          { href: "/collections/best-litbuy-finds-2026", label: "2026 collection" },
        ],
      },
    ],
    faqs: [
      {
        question: "How often do best finds change?",
        answer: "The grid rotates daily based on analytics and catalog updates.",
      },
    ],
    relatedLinks: [
      { href: "/litbuy-finds", label: "All LitBuy finds" },
      { href: "/litbuy-sneakers", label: "Sneakers" },
    ],
    getProducts: () => getEditorsPicks(96),
    productSectionTitle: "Best LitBuy finds today",
  },

  "litbuy-products": {
    slug: "litbuy-products",
    path: "/litbuy-products",
    title: "LitBuy Products Catalog",
    metaDescription:
      "Browse all LitBuy products — sneakers, jackets, bags, hoodies and accessories with verified agent links and QC references.",
    badge: "Products",
    h1: "LitBuy products",
    intro:
      "Every product on LitBuy Finds links to a verified LitBuy listing. Browse sneakers, outerwear, streetwear, bags, and accessories — filter by brand, category, and price in the full catalog below.",
    sections: [
      {
        heading: "Product categories",
        paragraphs: [
          "Shoes, coats and jackets, hoodies and pants, accessories, and electronics each have dedicated category pages. Use brand pages for Nike, Jordan, Moncler, and more.",
        ],
        links: [
          { href: "/categories", label: "Categories" },
          { href: "/brands", label: "Brands" },
        ],
      },
    ],
    faqs: [
      {
        question: "Are all products QC approved?",
        answer:
          "Not every listing has QC references, but QC-approved products are marked on their pages.",
      },
    ],
    relatedLinks: [
      { href: "/litbuy-finds", label: "LitBuy finds" },
      { href: "/litbuy-spreadsheet", label: "Spreadsheet guide" },
    ],
    getProducts: () => filterFeaturedEligible(priced(getAllProducts())).slice(0, 96),
    productSectionTitle: "Featured LitBuy products",
  },

  "best-litbuy-sneakers-2026": {
    slug: "best-litbuy-sneakers-2026",
    path: "/best-litbuy-sneakers-2026",
    title: "Best LitBuy Sneakers 2026",
    metaDescription:
      "Best LitBuy sneakers for 2026 — Nike, Jordan, Adidas heat with QC links and verified buy buttons.",
    badge: "2026",
    h1: "Best LitBuy sneakers 2026",
    intro:
      "The top sneaker finds on LitBuy Finds for 2026 — ranked for photos, QC, and community clicks. Share this page or browse before your next haul.",
    sections: [
      {
        heading: "2026 sneaker trends",
        paragraphs: [
          "Jordan retros, Nike Dunks, and Adidas Campus styles continue to lead searches. Check QC references for batch comparisons before you buy.",
        ],
        links: [
          { href: "/litbuy-sneakers", label: "LitBuy sneakers" },
          { href: "/best-jordan-finds-2026", label: "Jordan 2026" },
        ],
      },
    ],
    faqs: [
      {
        question: "Will this list update in 2027?",
        answer: "Yes — product grids refresh daily with catalog sync.",
      },
    ],
    relatedLinks: [{ href: "/top-rep-sneakers", label: "Top sneakers" }],
    getProducts: TOP_LISTS["top-rep-sneakers"].getProducts,
    productSectionTitle: "Best sneakers 2026",
  },

  "best-litbuy-jackets-2026": {
    slug: "best-litbuy-jackets-2026",
    path: "/best-litbuy-jackets-2026",
    title: "Best LitBuy Jackets 2026",
    metaDescription:
      "Best LitBuy jackets for 2026 — Moncler, puffers, shells and streetwear outerwear.",
    badge: "2026",
    h1: "Best LitBuy jackets 2026",
    intro:
      "Outerwear picks for 2026 from the LitBuy Finds catalog — puffers, shells, and designer jackets with verified LitBuy links.",
    sections: [
      {
        heading: "Winter and seasonal picks",
        paragraphs: [
          "Moncler and Canada Goose lead jacket searches. Budget for shipping weight and always QC before you approve warehouse photos.",
        ],
        links: [
          { href: "/litbuy-jackets", label: "LitBuy jackets" },
          { href: "/collections/best-moncler-finds", label: "Moncler finds" },
        ],
      },
    ],
    faqs: [
      {
        question: "What jackets are most popular on LitBuy in 2026?",
        answer:
          "Moncler puffers, Canada Goose parkas, and Arc'teryx shells lead searches. Check the grid below for current picks.",
      },
    ],
    relatedLinks: [{ href: "/categories/coats-and-jackets", label: "Jackets" }],
    getProducts: () => filterFeaturedEligible(byCategory("coats-and-jackets")).slice(0, 72),
    productSectionTitle: "Best jackets 2026",
  },

  "best-litbuy-bags-2026": {
    slug: "best-litbuy-bags-2026",
    path: "/best-litbuy-bags-2026",
    title: "Best LitBuy Bags 2026",
    metaDescription:
      "Best LitBuy bags 2026 — designer handbags, crossbody, and backpacks with verified links.",
    badge: "2026",
    h1: "Best LitBuy bags 2026",
    intro:
      "Designer and streetwear bag finds for 2026 — Louis Vuitton, Gucci, Goyard, and more with LitBuy purchase links.",
    sections: [
      {
        heading: "Bag buying tips",
        paragraphs: [
          "QC hardware, stitching, and leather texture carefully. Bags are high-value items — warehouse QC is essential.",
        ],
        links: [
          { href: "/top-designer-bags", label: "Designer bags" },
          { href: "/collections/best-bags", label: "Bag collection" },
        ],
      },
    ],
    faqs: [
      {
        question: "Which bag brands are best on LitBuy?",
        answer:
          "Louis Vuitton, Gucci, and Goyard styles have the most QC references. Always request warehouse photos before shipping.",
      },
    ],
    relatedLinks: [{ href: "/litbuy-products", label: "All products" }],
    getProducts: TOP_LISTS["top-designer-bags"].getProducts,
    productSectionTitle: "Best bags 2026",
  },

  "best-litbuy-accessories-2026": {
    slug: "best-litbuy-accessories-2026",
    path: "/best-litbuy-accessories-2026",
    title: "Best LitBuy Accessories 2026",
    metaDescription:
      "Best LitBuy accessories 2026 — hats, belts, glasses, and streetwear add-ons.",
    badge: "2026",
    h1: "Best LitBuy accessories 2026",
    intro:
      "Accessories complete a fit — browse hats, belts, glasses, and more from the LitBuy Finds catalog.",
    sections: [
      {
        heading: "Accessory categories",
        paragraphs: [
          "Use the accessories category for bags, hats, and eyewear. Smaller items are great for filling out a haul under weight limits.",
        ],
        links: [{ href: "/categories/accessories", label: "Accessories" }],
      },
    ],
    faqs: [
      {
        question: "Are accessories good for first hauls?",
        answer:
          "Yes — hats, belts, and small items add variety without heavy shipping cost.",
      },
    ],
    relatedLinks: [{ href: "/litbuy-finds", label: "LitBuy finds" }],
    getProducts: () => filterFeaturedEligible(byCategory("accessories")).slice(0, 72),
    productSectionTitle: "Best accessories 2026",
  },

  "best-litbuy-finds-under-50": {
    slug: "best-litbuy-finds-under-50",
    path: "/best-litbuy-finds-under-50",
    title: "Best LitBuy Finds Under $50",
    metaDescription:
      "Best LitBuy finds under $50 — budget sneakers, tees, and accessories for your next haul.",
    badge: "Budget",
    h1: "Best LitBuy finds under $50",
    intro:
      "Low-risk picks under $50 from the LitBuy catalog — ideal for first hauls or filling out shipping weight.",
    sections: [
      {
        heading: "Budget haul strategy",
        paragraphs: [
          "Mix budget tees and accessories with one higher-value sneaker or jacket to optimize shipping. Confirm live LitBuy prices at checkout.",
        ],
        links: [
          { href: "/top-budget-finds", label: "Budget list" },
          { href: "/deals", label: "Deals page" },
        ],
      },
    ],
    faqs: [
      {
        question: "Are prices under $50 accurate?",
        answer:
          "List prices sync from the catalog. Confirm the live LitBuy price at checkout before paying.",
      },
    ],
    relatedLinks: [{ href: "/best-litbuy-finds", label: "Best finds" }],
    getProducts: TOP_LISTS["top-products-under-50"].getProducts,
    productSectionTitle: "Finds under $50",
  },

  "best-litbuy-hoodies": {
    slug: "best-litbuy-hoodies",
    path: "/best-litbuy-hoodies",
    title: "Best LitBuy Hoodies",
    metaDescription:
      "Best LitBuy hoodies — Stussy, Corteiz, Nike tech fleece, Supreme, and streetwear layers with verified links and QC references.",
    badge: "Hoodies",
    h1: "Best LitBuy hoodies",
    intro:
      "The strongest hoodie picks from the LitBuy Finds catalog — graphic streetwear, designer layers, and everyday rotation pieces with verified buy links.",
    sections: [
      {
        heading: "Popular hoodie brands on LitBuy",
        paragraphs: [
          "Stussy, Corteiz, Nike tech fleece, Supreme, and Ami heart-logo knits lead hoodie searches. Filter by brand on each product page or browse brand authority pages for focused lanes.",
          "Hoodies are ideal haul fillers — lighter than puffers but higher engagement than basic tees. Compare print placement and drawstrings in QC before shipping.",
        ],
        links: [
          { href: "/categories/hoodies", label: "Hoodie category" },
          { href: "/brands/stussy", label: "Stussy finds" },
          { href: "/best-hoodies", label: "Best hoodies list" },
        ],
      },
    ],
    faqs: [
      {
        question: "What are the best LitBuy hoodies?",
        answer:
          "Community favorites rotate daily — check Popular Today and this page's grid for current picks with QC references.",
      },
    ],
    relatedLinks: [
      { href: "/best-litbuy-finds", label: "Best finds" },
      { href: "/litbuy-finds", label: "All finds" },
    ],
    getProducts: () =>
      filterFeaturedEligible(
        priced(
          getAllProducts().filter(
            (p) =>
              p.category_slug === "hoodies-and-pants" &&
              /hoodie|sweatshirt|crewneck/i.test(p.product_name)
          )
        )
      ).slice(0, 72),
    productSectionTitle: "Top hoodie finds",
  },

  "best-weidian-finds": {
    slug: "best-weidian-finds",
    path: "/best-weidian-finds",
    title: "Best Weidian Finds on LitBuy",
    metaDescription:
      "Best Weidian finds on LitBuy — curated sneakers, streetwear, and accessories from Weidian sellers with verified agent links.",
    badge: "Weidian",
    h1: "Best Weidian finds",
    intro:
      "Weidian is a major source for streetwear and sneaker finds. LitBuy Finds indexes Weidian-linked products with photos, pricing, and verified LitBuy buy links.",
    sections: [
      {
        heading: "How to buy Weidian finds",
        paragraphs: [
          "Open a product page, click the LitBuy buy link, and confirm size and price on LitBuy. The agent places the Weidian order and stores your parcel for QC and shipping.",
          "Many of the best Weidian finds include QC reference links from previous buyers — compare before you order.",
        ],
        links: [
          { href: "/litbuy-weidian", label: "Weidian guide" },
          { href: "/guides/how-to-buy-from-weidian", label: "How to buy from Weidian" },
        ],
      },
    ],
    faqs: [
      {
        question: "What are Weidian finds?",
        answer:
          "Products listed on Weidian, a Chinese marketplace. LitBuy acts as your buying agent for international checkout and shipping.",
      },
    ],
    relatedLinks: [
      { href: "/litbuy-finds", label: "LitBuy finds" },
      { href: "/best-litbuy-finds", label: "Best finds" },
    ],
    getProducts: () =>
      filterFeaturedEligible(
        priced(getAllProducts().filter((p) => /weidian/i.test(p.affiliate_link)))
      ).slice(0, 72),
    productSectionTitle: "Top Weidian finds",
  },

  "best-litbuy-under-20": {
    slug: "best-litbuy-under-20",
    path: "/best-litbuy-under-20",
    title: "Best LitBuy Finds Under $20",
    metaDescription:
      "Best LitBuy finds under $20 — budget tees, accessories, and low-risk haul fillers with verified links.",
    badge: "Under $20",
    h1: "Best LitBuy finds under $20",
    intro:
      "Lowest-risk picks under $20 from the LitBuy catalog — ideal for first hauls, testing an agent, or filling shipping weight.",
    sections: [
      {
        heading: "Budget buying tips",
        paragraphs: [
          "Under-$20 items are great for testing LitBuy workflow before bigger purchases. Bundle several budget pieces to spread shipping cost.",
        ],
        links: [
          { href: "/best-under-20", label: "Under $20 list" },
          { href: "/deals", label: "Deals" },
        ],
      },
    ],
    faqs: [
      {
        question: "Are under-$20 finds worth shipping?",
        answer:
          "Best as part of a multi-item haul. Solo shipping on a single $15 tee rarely makes financial sense.",
      },
    ],
    relatedLinks: [{ href: "/best-litbuy-finds-under-50", label: "Under $50" }],
    getProducts: TOP_LISTS["top-products-under-20"].getProducts,
    productSectionTitle: "Finds under $20",
  },

  "best-litbuy-under-100": {
    slug: "best-litbuy-under-100",
    path: "/best-litbuy-under-100",
    title: "Best LitBuy Finds Under $100",
    metaDescription:
      "Best LitBuy finds under $100 — sneakers, jackets, bags, and streetwear with verified links and QC references.",
    badge: "Under $100",
    h1: "Best LitBuy finds under $100",
    intro:
      "Mid-range picks under $100 — sneakers, outerwear, and designer accessories with strong QC availability and verified LitBuy links.",
    sections: [
      {
        heading: "Mid-range haul strategy",
        paragraphs: [
          "The under-$100 lane covers most sneakers and many jackets. Compare QC references and confirm live LitBuy prices at checkout.",
        ],
        links: [
          { href: "/best-under-100", label: "Under $100 list" },
          { href: "/best-sneakers", label: "Best sneakers" },
        ],
      },
    ],
    faqs: [],
    relatedLinks: [{ href: "/best-litbuy-finds", label: "Best finds" }],
    getProducts: TOP_LISTS["top-products-under-100"].getProducts,
    productSectionTitle: "Finds under $100",
  },

  "top-qc-finds": {
    slug: "top-qc-finds",
    path: "/top-qc-finds",
    title: "Top QC Finds on LitBuy",
    metaDescription:
      "Top QC finds on LitBuy — products with quality control reference photos for sneakers, jackets, bags, and streetwear.",
    badge: "QC",
    h1: "Top QC finds",
    intro:
      "Products with QC reference links help you compare batches before ordering. These are the strongest QC-documented finds in the catalog.",
    sections: [
      {
        heading: "How to use QC finds",
        paragraphs: [
          "Reference QC on find pages shows photos from previous buyers or batches. After purchase, request warehouse QC on LitBuy for your exact item before shipping.",
        ],
        links: [
          { href: "/litbuy-qc", label: "LitBuy QC guide" },
          { href: "/guides/how-to-check-qc-photos", label: "Check QC photos" },
        ],
      },
    ],
    faqs: [
      {
        question: "What are QC finds?",
        answer:
          "Listings with quality control reference photos attached — useful for comparing materials and construction before you buy.",
      },
    ],
    relatedLinks: [
      { href: "/best-qc-items", label: "Best QC items" },
      { href: "/collections/best-qc-approved-finds", label: "QC collection" },
    ],
    getProducts: () => withQc(96),
    productSectionTitle: "Top QC finds",
  },

  "trending-litbuy-finds": {
    slug: "trending-litbuy-finds",
    path: "/trending-litbuy-finds",
    title: "Trending LitBuy Finds",
    metaDescription:
      "Trending LitBuy finds today — hottest sneakers, jackets, hoodies, and streetwear with verified links, updated daily.",
    badge: "Trending",
    h1: "Trending LitBuy finds",
    intro:
      "What is hot right now across the LitBuy Finds catalog — ranked from trending sheet imports, engagement signals, and daily catalog sync.",
    sections: [
      {
        heading: "How trending works",
        paragraphs: [
          "Trending picks rotate daily based on catalog imports and visitor engagement. Sneakers and outerwear typically lead during seasonal peaks.",
        ],
        links: [
          { href: "/trending", label: "Trending page" },
          { href: "/most-popular-finds-now", label: "Popular today" },
        ],
      },
    ],
    faqs: [
      {
        question: "How often does trending update?",
        answer: "The grid refreshes with daily catalog sync and engagement-weighted rotation.",
      },
    ],
    relatedLinks: [
      { href: "/best-litbuy-finds", label: "Best finds" },
      { href: "/best-finds-this-week", label: "This week" },
    ],
    getProducts: () => filterFeaturedEligible(priced(getTrendingProducts())).slice(0, 96),
    productSectionTitle: "Trending now",
  },

  "best-litbuy-finds-2026": {
    slug: "best-litbuy-finds-2026",
    path: "/best-litbuy-finds-2026",
    title: "Best LitBuy Finds 2026",
    metaDescription:
      "Best LitBuy finds in 2026 — editor picks, QC-approved sneakers, jackets, and streetwear with verified links.",
    badge: "2026",
    h1: "Best LitBuy finds 2026",
    intro:
      "The definitive 2026 collection of top LitBuy finds — combining QC availability, engagement, premium brands, and verified buy links.",
    sections: [
      {
        heading: "2026 editor picks",
        paragraphs: [
          "This page highlights the strongest catalog entries for 2026 — sneakers, outerwear, and designer accessories with the best photos and QC coverage.",
        ],
        links: [
          { href: "/collections/best-litbuy-finds-2026", label: "2026 collection" },
          { href: "/best-litbuy-sneakers-2026", label: "Sneakers 2026" },
        ],
      },
    ],
    faqs: [],
    relatedLinks: [
      { href: "/best-litbuy-finds", label: "Best finds hub" },
      { href: "/litbuy-finds", label: "All finds" },
    ],
    getProducts: () => getEditorsPicks(96),
    productSectionTitle: "Best finds 2026",
  },

  "litbuy-shoes": {
    slug: "litbuy-shoes",
    path: "/litbuy-shoes",
    title: "LitBuy Shoes – Sneakers & Footwear Catalog",
    metaDescription:
      "Browse LitBuy shoes — sneakers, runners, and footwear from the LitBuy Finds catalog with images, prices, QC links, and verified buy buttons.",
    badge: "LitBuy shoes",
    h1: "LitBuy shoes",
    intro:
      "LitBuy shoes covers the full footwear category on LitBuy Finds — sneakers, runners, and casual pairs from Nike, Jordan, Adidas, New Balance, and more. Each listing links to a live LitBuy product page with price and QC references when available.",
    sections: [
      {
        heading: "Shoes vs sneakers on LitBuy Finds",
        paragraphs: [
          "The shoes category includes all footwear in the catalog. For sneaker-focused picks, see the LitBuy sneakers page. Use LitBuy AI to search by color, brand, and budget.",
        ],
        links: [
          { href: "/litbuy-sneakers", label: "LitBuy sneakers" },
          { href: "/categories/shoes", label: "Shoes category" },
          { href: "/ai", label: "LitBuy AI" },
        ],
      },
    ],
    faqs: [
      {
        question: "Are LitBuy shoe prices final?",
        answer: "Confirm live price on LitBuy checkout — catalog prices can lag seller updates.",
      },
    ],
    relatedLinks: [
      { href: "/litbuy-finds", label: "LitBuy Finds" },
      { href: "/litbuy-sneakers", label: "Sneakers" },
    ],
    getProducts: () => byCategory("shoes").slice(0, 96),
    productSectionTitle: "LitBuy shoes",
  },

  "litbuy-hoodies": {
    slug: "litbuy-hoodies",
    path: "/litbuy-hoodies",
    title: "LitBuy Hoodies – Streetwear & Sweats Catalog",
    metaDescription:
      "Browse LitBuy hoodies and sweats from the LitBuy Finds catalog — Nike, Stussy, Essentials, and budget picks with QC links.",
    badge: "LitBuy hoodies",
    h1: "LitBuy hoodies",
    intro:
      "LitBuy hoodies and sweatsets from the LitBuy Finds catalog — browse hoodies, zip-ups, and crewnecks with photos, prices, and LitBuy buy links. Filter by brand on category pages or search with LitBuy AI.",
    sections: [
      {
        heading: "Finding the right hoodie",
        paragraphs: [
          "Check fabric weight in listing notes, compare QC for logo embroidery, and start with lower-cost pieces if you are new to a seller.",
        ],
        links: [
          { href: "/best-litbuy-hoodies", label: "Best hoodies list" },
          { href: "/categories/hoodies-and-pants", label: "Hoodies category" },
        ],
      },
    ],
    faqs: [],
    relatedLinks: [{ href: "/litbuy-finds", label: "LitBuy Finds" }],
    getProducts: () =>
      byKeyword("hoodie", "hoodies", "sweatshirt", "zip-up").slice(0, 96),
    productSectionTitle: "LitBuy hoodies",
  },

  "litbuy-bags": {
    slug: "litbuy-bags",
    path: "/litbuy-bags",
    title: "LitBuy Bags – Designer & Street Bags Catalog",
    metaDescription:
      "Browse LitBuy bags — Louis Vuitton, Gucci, Goyard, and streetwear bags with images, prices, and verified LitBuy links.",
    badge: "LitBuy bags",
    h1: "LitBuy bags",
    intro:
      "LitBuy bags from the LitBuy Finds catalog — crossbody, tote, and designer styles with product images, prices, and LitBuy purchase links. QC references help compare hardware and stitching before you buy.",
    sections: [
      {
        heading: "Popular bag searches",
        paragraphs: [
          "Louis Vuitton, Gucci, and Goyard lead bag searches. Use brand pages for focused browsing and request warehouse QC for hardware and lining.",
        ],
        links: [
          { href: "/best-litbuy-bags-2026", label: "Best bags 2026" },
          { href: "/collections/best-bags", label: "Bag collection" },
        ],
      },
    ],
    faqs: [],
    relatedLinks: [{ href: "/litbuy-finds", label: "LitBuy Finds" }],
    getProducts: () => byKeyword("bag", "tote", "crossbody", "backpack").slice(0, 96),
    productSectionTitle: "LitBuy bags",
  },

  "litbuy-jerseys": {
    slug: "litbuy-jerseys",
    path: "/litbuy-jerseys",
    title: "LitBuy Jerseys – Football & Soccer Kits",
    metaDescription:
      "Browse LitBuy football and soccer jerseys from the catalog — club kits, national shirts, and budget jerseys with LitBuy buy links.",
    badge: "LitBuy jerseys",
    h1: "LitBuy jerseys",
    intro:
      "LitBuy jerseys and football kits from the LitBuy Finds catalog — club shirts, national team styles, and budget soccer jerseys with images, prices, and LitBuy links. Check sizing charts on LitBuy before ordering.",
    sections: [
      {
        heading: "Jersey buying tips",
        paragraphs: [
          "Compare collar stitching, badge quality, and name/number printing in QC photos. Jerseys often run slim — read size charts on the LitBuy listing.",
        ],
        links: [
          { href: "/categories/tshirts-and-shorts", label: "Tees category" },
          { href: "/ai", label: "Search jerseys with LitBuy AI" },
        ],
      },
    ],
    faqs: [],
    relatedLinks: [{ href: "/litbuy-finds", label: "LitBuy Finds" }],
    getProducts: () => byKeyword("jersey", "football").slice(0, 96),
    productSectionTitle: "LitBuy jerseys",
  },

  "litbuy-accessories": {
    slug: "litbuy-accessories",
    path: "/litbuy-accessories",
    title: "LitBuy Accessories – Hats, Belts, Watches & More",
    metaDescription:
      "Browse LitBuy accessories — hats, belts, watches, socks, and small goods from the LitBuy Finds catalog.",
    badge: "LitBuy accessories",
    h1: "LitBuy accessories",
    intro:
      "LitBuy accessories from the LitBuy Finds catalog — hats, belts, watches, socks, and add-on pieces that complete a haul. Lower risk than jackets or bags but still worth a quick warehouse QC check.",
    sections: [
      {
        heading: "Accessory categories",
        paragraphs: [
          "Browse the accessories category for the full grid or use this curated page for popular picks with photos and LitBuy links.",
        ],
        links: [
          { href: "/best-litbuy-accessories-2026", label: "Best accessories 2026" },
          { href: "/categories/accessories", label: "Accessories category" },
        ],
      },
    ],
    faqs: [],
    relatedLinks: [{ href: "/litbuy-finds", label: "LitBuy Finds" }],
    getProducts: () => byCategory("accessories").slice(0, 96),
    productSectionTitle: "LitBuy accessories",
  },

  "latest-litbuy-finds": {
    slug: "latest-litbuy-finds",
    path: "/latest-litbuy-finds",
    title: "Latest LitBuy Finds – Newest Catalog Additions",
    metaDescription:
      "Latest LitBuy finds added to the catalog — newest sneakers, jackets, and streetwear with verified LitBuy links, updated daily.",
    badge: "Latest",
    h1: "Latest LitBuy finds",
    intro:
      "The newest rows synced from LitBuy spreadsheet imports — latest LitBuy finds with images, prices, and buy links. Check here after each catalog sync for fresh drops.",
    sections: [
      {
        heading: "How latest finds are selected",
        paragraphs: [
          "Products tagged in the latest-finds import lane surface here first, then roll into category and brand pages. Prices and images reflect the most recent sync.",
        ],
        links: [
          { href: "/latest", label: "Latest page" },
          { href: "/recently-added", label: "Recently added" },
        ],
      },
    ],
    faqs: [
      {
        question: "How often do latest finds update?",
        answer: "The catalog syncs daily. New items appear after each import cycle.",
      },
    ],
    relatedLinks: [
      { href: "/trending-litbuy-finds", label: "Trending" },
      { href: "/best-litbuy-finds", label: "Best finds" },
    ],
    getProducts: latestFinds,
    productSectionTitle: "Latest additions",
  },

  "litbuy-finds-under-20": {
    slug: "litbuy-finds-under-20",
    path: "/litbuy-finds-under-20",
    title: "LitBuy Finds Under $20 – Budget Picks",
    metaDescription:
      "LitBuy finds under $20 — budget sneakers, tees, and accessories with verified LitBuy links from the live catalog.",
    badge: "Under $20",
    h1: "LitBuy finds under $20",
    intro:
      "Budget LitBuy finds at or below $20 in catalog data — low-risk test pieces, basics, and accessories. Confirm live LitBuy checkout price before paying; shipping is separate.",
    sections: [
      {
        heading: "Best uses for sub-$20 finds",
        paragraphs: [
          "Great for first haul tests, sock/tee fillers, and trying a new seller. Do not expect premium materials at this tier.",
        ],
        links: [
          { href: "/best-litbuy-under-20", label: "Best under $20 list" },
          { href: "/deals", label: "Deals page" },
        ],
      },
    ],
    faqs: [],
    relatedLinks: [{ href: "/litbuy-finds-under-30", label: "Under $30" }],
    getProducts: () => byMaxPrice(20),
    productSectionTitle: "Under $20",
  },

  "litbuy-finds-under-30": {
    slug: "litbuy-finds-under-30",
    path: "/litbuy-finds-under-30",
    title: "LitBuy Finds Under $30 – Budget Collection",
    metaDescription:
      "LitBuy finds under $30 — hoodies, tees, sneakers, and accessories with verified LitBuy buy links.",
    badge: "Under $30",
    h1: "LitBuy finds under $30",
    intro:
      "LitBuy finds at or below $30 in catalog data — the sweet spot for hoodies, basic sneakers, and haul fillers. Shipping not included; confirm live LitBuy totals at checkout.",
    sections: [
      {
        heading: "Shopping under $30",
        paragraphs: [
          "This band covers most budget hoodies and tees in the catalog. Pair one mid-tier main piece with several sub-$30 fillers for a balanced haul.",
        ],
        links: [
          { href: "/collections/best-under-30", label: "Under $30 collection" },
          { href: "/deals", label: "Deals" },
        ],
      },
    ],
    faqs: [],
    relatedLinks: [{ href: "/litbuy-finds-under-50", label: "Under $50" }],
    getProducts: () => byMaxPrice(30),
    productSectionTitle: "Under $30",
  },

  "litbuy-finds-under-50": {
    slug: "litbuy-finds-under-50",
    path: "/litbuy-finds-under-50",
    title: "LitBuy Finds Under $50 – Mid-Budget Picks",
    metaDescription:
      "LitBuy finds under $50 — sneakers, jackets, and streetwear with QC links and LitBuy buy buttons.",
    badge: "Under $50",
    h1: "LitBuy finds under $50",
    intro:
      "LitBuy finds at or below $50 in catalog data — mid-budget sneakers, outerwear starters, and popular streetwear. Always confirm live LitBuy price and request QC before shipping.",
    sections: [
      {
        heading: "What $50 usually covers",
        paragraphs: [
          "Many popular sneakers and light jackets sit in this band. Heavier designer outerwear often costs more — use LitBuy AI to search within your budget.",
        ],
        links: [
          { href: "/best-litbuy-finds-under-50", label: "Best under $50" },
          { href: "/ai", label: "LitBuy AI budget search" },
        ],
      },
    ],
    faqs: [],
    relatedLinks: [{ href: "/litbuy-finds-under-30", label: "Under $30" }],
    getProducts: () => byMaxPrice(50),
    productSectionTitle: "Under $50",
  },
};

export const SEO_LANDING_SLUGS = Object.keys(SEO_LANDING_PAGES);

export function getSeoLandingPage(slug: string): SeoLandingConfig | undefined {
  return SEO_LANDING_PAGES[slug];
}
