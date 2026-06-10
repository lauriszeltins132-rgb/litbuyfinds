export type StaticPageSection = {
  heading: string;
  level?: 2 | 3;
  paragraphs: string[];
  links?: { href: string; label: string }[];
};

export type StaticPage = {
  path: string;
  title: string;
  metaDescription: string;
  badge: string;
  h1: string;
  intro: string;
  sections: StaticPageSection[];
  faqs?: { question: string; answer: string }[];
  relatedLinks?: { href: string; label: string }[];
};

const GUIDE_LINKS = [
  { href: "/how-to-buy", label: "How to buy" },
  { href: "/new-user-guide", label: "New user guide" },
  { href: "/best-rep-sneakers", label: "Best rep sneakers" },
  { href: "/best-budget-finds", label: "Best budget finds" },
  { href: "/litbuy-vs-other-agents", label: "LitBuy vs other agents" },
  { href: "/trending", label: "Trending finds" },
  { href: "/categories/shoes", label: "Shoe finds" },
];

const TRUST_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
];

export const STATIC_PAGES: Record<string, StaticPage> = {
  about: {
    path: "/about",
    title: "About LitBuy Finds",
    metaDescription:
      "LitBuy Finds is a curated discovery catalog for fashion, sneakers, and accessories — verified LitBuy links, QC references, and daily drops.",
    badge: "About us",
    h1: "About LitBuy Finds",
    intro:
      "LitBuy Finds helps shoppers discover products from the LitBuy ecosystem without digging through massive spreadsheets. We organize finds by category, brand, and collection so you can compare options quickly and buy through verified agent links.",
    sections: [
      {
        heading: "What we do",
        paragraphs: [
          "We index products from public LitBuy spreadsheets and turn them into a searchable catalog. Every listing links out to LitBuy for checkout — we do not sell products directly.",
          "Our goal is simple: make discovery faster. Whether you are looking for trending sneakers, budget streetwear, or a specific brand, you should be able to find it in a few clicks.",
        ],
      },
      {
        heading: "How the catalog works",
        paragraphs: [
          "Products are grouped into categories that match the source spreadsheets — shoes, hoodies and pants, coats, accessories, and more. We also surface editorial collections like Daily Drop, Hidden Gems, and Editor's Picks.",
          "When QC photos are available in the source data, we link to them so you can review quality before buying.",
        ],
        links: [
          { href: "/categories", label: "Browse categories" },
          { href: "/brands", label: "Browse brands" },
          { href: "/daily-drop", label: "Daily drop" },
        ],
      },
      {
        heading: "Affiliate disclosure",
        paragraphs: [
          "Some outbound links are affiliate links. If you register or purchase through them, we may earn a commission at no extra cost to you. This supports the site and keeps the catalog free to use.",
        ],
        links: TRUST_LINKS.filter((l) => l.href !== "/about"),
      },
    ],
    relatedLinks: [...GUIDE_LINKS.slice(0, 4), { href: "/contact", label: "Contact" }],
  },

  contact: {
    path: "/contact",
    title: "Contact LitBuy Finds",
    metaDescription:
      "Get in touch with LitBuy Finds — questions about the catalog, listings, or partnerships. Email and community links.",
    badge: "Contact",
    h1: "Contact us",
    intro:
      "Have a question about a listing, spotted incorrect data, or want to collaborate? Reach out through email or our community channels. We read every message.",
    sections: [
      {
        heading: "Email",
        paragraphs: [
          "For general inquiries, corrections, or partnership ideas, email hello@litbuyfinds.io. Include the product URL if your message is about a specific listing.",
        ],
      },
      {
        heading: "Community",
        paragraphs: [
          "For faster help from other buyers, join our Discord or Telegram. Members share QC tips, recent pickups, and agent advice daily.",
        ],
        links: [
          { href: "https://discord.gg/G3Ryc2JE3Q", label: "Discord" },
          { href: "https://t.me/RNFinds", label: "Telegram" },
        ],
      },
      {
        heading: "Buying support",
        paragraphs: [
          "LitBuy Finds is a discovery site, not a store. For order issues, shipping, or agent account help, contact LitBuy directly or ask in the community channels above.",
        ],
        links: [
          { href: "/how-to-buy", label: "How to buy guide" },
          { href: "/new-user-guide", label: "New user guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can you remove a product from the catalog?",
        answer:
          "If a listing is outdated or violates guidelines, email us with the product page URL and we will review it.",
      },
      {
        question: "Do you sell products?",
        answer:
          "No. We link to LitBuy and other agent platforms. All purchases happen on those sites.",
      },
    ],
    relatedLinks: TRUST_LINKS.filter((l) => l.href !== "/contact"),
  },

  "privacy-policy": {
    path: "/privacy-policy",
    title: "Privacy Policy",
    metaDescription:
      "Privacy policy for LitBuy Finds — what data we collect, how we use analytics, and your choices as a visitor.",
    badge: "Legal",
    h1: "Privacy policy",
    intro:
      "This policy explains what information LitBuy Finds collects when you visit the site and how we use it. Last updated June 2026.",
    sections: [
      {
        heading: "Information we collect",
        paragraphs: [
          "We use privacy-focused analytics (Vercel Analytics) to understand traffic patterns — pages visited, referrers, and general device type. We do not sell personal data.",
          "If you email us, we receive your email address and message content solely to respond to you.",
          "Wishlist items are stored in your browser's local storage. We do not receive that data on our servers.",
        ],
      },
      {
        heading: "Cookies and local storage",
        paragraphs: [
          "The site may use cookies or local storage for preferences (currency display) and saved wishlist items. You can clear these through your browser settings.",
        ],
      },
      {
        heading: "Third-party links",
        paragraphs: [
          "Outbound links to LitBuy, Discord, Telegram, and product sellers are third-party sites with their own privacy policies. We are not responsible for their practices.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: ["Privacy questions: hello@litbuyfinds.io"],
      },
    ],
    relatedLinks: TRUST_LINKS.filter((l) => l.href !== "/privacy-policy"),
  },

  terms: {
    path: "/terms",
    title: "Terms of Use",
    metaDescription:
      "Terms of use for LitBuy Finds — catalog disclaimer, affiliate links, and acceptable use.",
    badge: "Legal",
    h1: "Terms of use",
    intro:
      "By using LitBuy Finds, you agree to these terms. Please read them before relying on any listing for purchase decisions.",
    sections: [
      {
        heading: "Catalog disclaimer",
        paragraphs: [
          "LitBuy Finds is an independent discovery catalog. Product names, images, and prices come from third-party spreadsheets and may change without notice. Always verify details on LitBuy before purchasing.",
        ],
      },
      {
        heading: "No warranties",
        paragraphs: [
          "We provide the site as-is. We do not guarantee accuracy, availability, or quality of any product. Buying replica or inspired items may carry legal and quality risks in your region — that is your responsibility.",
        ],
      },
      {
        heading: "Affiliate links",
        paragraphs: [
          "Some links are affiliate links. Commissions help maintain the site and do not increase your price.",
        ],
      },
      {
        heading: "Acceptable use",
        paragraphs: [
          "Do not scrape the site in ways that harm performance, attempt unauthorized access, or misuse content for spam or misleading purposes.",
        ],
      },
    ],
    relatedLinks: TRUST_LINKS.filter((l) => l.href !== "/terms"),
  },

  "how-to-buy": {
    path: "/how-to-buy",
    title: "How to Buy on LitBuy",
    metaDescription:
      "Step-by-step guide to buying finds through LitBuy — register, add to cart, QC checks, shipping, and customs tips for new users.",
    badge: "Buying guide",
    h1: "How to buy through LitBuy",
    intro:
      "Found something on LitBuy Finds? Here is the usual flow from discovery to delivery. Exact steps can vary by seller and shipping line, but this covers what most new buyers need.",
    sections: [
      {
        heading: "1. Register on LitBuy",
        paragraphs: [
          "Create a LitBuy account using a referral link if you want shipping discounts for new users. Registration is free and takes a few minutes.",
        ],
        links: [
          {
            href: "https://litbuy.com/register?inviteCode=SMKS",
            label: "Register on LitBuy",
          },
        ],
      },
      {
        heading: "2. Open the product link",
        paragraphs: [
          "On any find page, click Buy on LitBuy. That sends you to the agent listing with the correct item loaded. Double-check size, color, and price before adding to cart.",
        ],
      },
      {
        heading: "3. Check QC when available",
        paragraphs: [
          "If we show a QC badge, use the QC link to see warehouse photos. Compare stitching, logos, and shape to what you expect. Skip or exchange if something looks off.",
        ],
      },
      {
        heading: "4. Ship to warehouse, then ship home",
        paragraphs: [
          "Items sit in your LitBuy warehouse until you submit a parcel. Combine multiple items to save on international shipping. Pick a shipping line that balances speed and cost for your country.",
        ],
      },
      {
        heading: "5. Declare and receive",
        paragraphs: [
          "Follow customs rules in your country. Keep tracking handy and be patient — international parcels can take one to three weeks depending on the line.",
        ],
      },
    ],
    faqs: [
      {
        question: "How long does shipping take?",
        answer:
          "It depends on the line you choose and your country. Budget lines are slower; express costs more but arrives faster.",
      },
      {
        question: "What if the item is wrong?",
        answer:
          "Contact LitBuy support with photos. Policies vary by seller — QC before shipping home saves headaches.",
      },
    ],
    relatedLinks: GUIDE_LINKS,
  },

  "new-user-guide": {
    path: "/new-user-guide",
    title: "LitBuy New User Guide",
    metaDescription:
      "New to LitBuy and rep buying? Start here — account setup, first order tips, QC basics, and where to find the best finds.",
    badge: "Getting started",
    h1: "New user guide",
    intro:
      "If this is your first time using an agent, the learning curve is real but manageable. This guide points you to the right first steps without overwhelming you.",
    sections: [
      {
        heading: "Start with a low-risk first order",
        paragraphs: [
          "Pick one affordable item from our Best Under $30 collection. You learn the full flow — payment, warehouse, QC, shipping — without risking a large budget.",
        ],
        links: [
          { href: "/deals", label: "Deals under $30" },
          { href: "/best-budget-finds", label: "Best budget finds" },
        ],
      },
      {
        heading: "Learn QC basics",
        paragraphs: [
          "QC means quality check photos taken at the warehouse. Compare them to retail photos and community reviews. Small flaws might be acceptable; major flaws are not.",
        ],
        links: [{ href: "/how-to-buy", label: "Full buying guide" }],
      },
      {
        heading: "Use categories and brands",
        paragraphs: [
          "Shoes have different sizing quirks than hoodies or jackets. Browse by category when you know what you want, or by brand when you are loyal to a label.",
        ],
        links: [
          { href: "/categories/shoes", label: "Shoes" },
          { href: "/brands/nike", label: "Nike finds" },
        ],
      },
      {
        heading: "Join the community",
        paragraphs: [
          "Discord and Telegram are where buyers share recent QCs, batch advice, and shipping line recommendations for specific countries.",
        ],
        links: [
          { href: "https://discord.gg/G3Ryc2JE3Q", label: "Discord" },
          { href: "https://t.me/RNFinds", label: "Telegram" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is LitBuy Finds the same as LitBuy?",
        answer:
          "No. LitBuy Finds is a discovery catalog. LitBuy is the buying agent where you checkout and ship.",
      },
    ],
    relatedLinks: GUIDE_LINKS,
  },

  "best-rep-sneakers": {
    path: "/best-rep-sneakers",
    title: "Best Rep Sneakers on LitBuy",
    metaDescription:
      "Popular sneaker finds on LitBuy — Nike Dunks, Jordan 1s, New Balance, and trending runners with verified buy links and QC.",
    badge: "Sneaker guide",
    h1: "Best rep sneakers right now",
    intro:
      "Sneakers are the most searched category on the site. These are the labels and styles buyers come back to most — with links to live inventory on LitBuy Finds.",
    sections: [
      {
        heading: "Most searched brands",
        paragraphs: [
          "Nike, Jordan, Adidas, New Balance, and Asics dominate requests. Each brand page filters the catalog to that label so you are not scrolling unrelated items.",
        ],
        links: [
          { href: "/brands/nike", label: "Nike" },
          { href: "/brands/jordan", label: "Jordan" },
          { href: "/brands/adidas", label: "Adidas" },
          { href: "/brands/new-balance", label: "New Balance" },
          { href: "/brands/asics", label: "Asics" },
        ],
      },
      {
        heading: "Where to browse",
        paragraphs: [
          "The shoes category has the full sneaker inventory. Trending highlights what is hot this week; Daily Drop surfaces one featured pick every day.",
        ],
        links: [
          { href: "/categories/shoes", label: "All shoes" },
          { href: "/trending", label: "Trending" },
          { href: "/daily-drop", label: "Daily drop" },
        ],
      },
      {
        heading: "Buying tips for sneakers",
        level: 3,
        paragraphs: [
          "Check size charts per batch — EU and US conversions are not always consistent. Always request QC for pairs over $50. Compare midsole shape and toe box to reference photos.",
        ],
      },
    ],
    relatedLinks: GUIDE_LINKS,
  },

  "best-budget-finds": {
    path: "/best-budget-finds",
    title: "Best Budget Finds Under $30",
    metaDescription:
      "Best budget finds on LitBuy under $30 — tees, accessories, and entry-level pickups with verified links.",
    badge: "Budget picks",
    h1: "Best budget finds",
    intro:
      "You do not need to spend a lot for a solid first haul. These collections surface affordable finds that are popular with new buyers and veteran budget hunters alike.",
    sections: [
      {
        heading: "Deals under $30",
        paragraphs: [
          "Our deals page filters the catalog to items at or below $30, sorted with photos first so you can scan quickly.",
        ],
        links: [{ href: "/deals", label: "Shop deals under $30" }],
      },
      {
        heading: "Hidden gems",
        paragraphs: [
          "Hidden gems are strong products that fly under the radar — fewer clicks, but often great value when you want something different from the hype list.",
        ],
        links: [{ href: "/hidden-gems", label: "Hidden gems" }],
      },
      {
        heading: "Good categories for budget buys",
        paragraphs: [
          "T-shirts, accessories, and basic hoodies often land under $30. Electronics and premium outerwear usually do not — set expectations accordingly.",
        ],
        links: [
          { href: "/categories/tshirts", label: "T-shirts" },
          { href: "/categories/accessories", label: "Accessories" },
          { href: "/categories/hoodies", label: "Hoodies" },
        ],
      },
    ],
    relatedLinks: GUIDE_LINKS,
  },

  "litbuy-vs-other-agents": {
    path: "/litbuy-vs-other-agents",
    title: "LitBuy vs Other Agents",
    metaDescription:
      "How LitBuy compares to other buying agents — fees, shipping, QC workflow, and why buyers use LitBuy Finds for discovery.",
    badge: "Agent comparison",
    h1: "LitBuy vs other agents",
    intro:
      "Several agents can buy from the same Chinese marketplaces. LitBuy is the agent this catalog is built around, but an honest comparison helps you choose what fits your country and budget.",
    sections: [
      {
        heading: "Why we focus on LitBuy",
        paragraphs: [
          "Our spreadsheet sources and affiliate links are optimized for LitBuy. Every product page is tested to open the correct listing. That consistency is hard to replicate across multiple agents.",
        ],
      },
      {
        heading: "What to compare",
        paragraphs: [
          "Look at shipping rates to your country, exchange fees, QC photo quality, support response time, and whether your preferred sellers are supported. The cheapest agent on paper is not always the best after fees.",
        ],
      },
      {
        heading: "New user shipping discount",
        paragraphs: [
          "LitBuy often runs promotions for new accounts — including shipping discounts when you register through a referral. Check the current offer on our homepage banner.",
        ],
        links: [
          {
            href: "https://litbuy.com/register?inviteCode=SMKS",
            label: "Register on LitBuy",
          },
          { href: "/new-user-guide", label: "New user guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I use a different agent for the same item?",
        answer:
          "Sometimes, if you have the original marketplace link. Our Buy buttons are wired for LitBuy specifically.",
      },
      {
        question: "Is LitBuy Finds affiliated with LitBuy?",
        answer:
          "We are an independent discovery site with affiliate relationships. We are not owned by LitBuy.",
      },
    ],
    relatedLinks: GUIDE_LINKS,
  },
};

export const STATIC_PAGE_PATHS = Object.keys(STATIC_PAGES);

export function getStaticPage(slug: string): StaticPage | undefined {
  return STATIC_PAGES[slug];
}
