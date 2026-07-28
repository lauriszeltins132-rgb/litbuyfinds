import { buildGuide } from "./build";
import { LITBUY_SIGNUP_URL } from "../constants";
import { CORE_LINKS } from "./shared";
import type { GuidePage } from "./types";

export const COMPARISON_GUIDES: Record<string, GuidePage> = {
  "how-to-find-good-reps": buildGuide("how-to-find-good-reps", "beginner", {
    title: "How to Find Good Reps on LitBuy",
    metaDescription:
      "How to find good reps on LitBuy — QC photos, seller research, batch comparisons, and using LitBuy Finds to discover quality finds.",
    badge: "Buying guide",
    h1: "How to find good reps",
    intro:
      "Good reps start with research — QC references, community feedback, and realistic expectations on price. LitBuy Finds helps you discover listings; LitBuy handles purchase and warehouse QC.",
    cardDescription: "QC, batches, and discovery tips for better rep buys.",
    sections: [
      {
        heading: "Start with QC references",
        paragraphs: [
          "Products with QC links on LitBuy Finds show photos from previous buyers. Compare stitching, materials, and shape before you order.",
          "After purchase, request warehouse QC on LitBuy for your exact item before international shipping.",
        ],
        links: [
          { href: "/litbuy-qc", label: "LitBuy QC guide" },
          { href: "/best-qc-items", label: "Top QC finds" },
        ],
      },
      {
        heading: "Use brand and category filters",
        paragraphs: [
          "Search by brand on LitBuy Finds to narrow Nike, Jordan, or Moncler lanes. Check Popular Today and Top QC Finds for community-weighted picks.",
        ],
        links: [
          { href: "/best-finds", label: "Best finds" },
          { href: "/guides/how-to-check-qc-photos", label: "Check QC photos" },
        ],
      },
      {
        heading: "Price and batch realism",
        paragraphs: [
          "Extremely low prices often mean lower-tier batches. Compare multiple listings and read QC threads before grail purchases.",
        ],
        links: [{ href: "/best-under-50", label: "Budget finds" }],
      },
    ],
    faqs: [
      {
        question: "What makes a rep good?",
        answer:
          "Accurate materials, clean stitching, and shape that matches retail references — verified through QC photos.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "litbuy-vs-allchinabuy": buildGuide("litbuy-vs-allchinabuy", "beginner", {
    title: "LitBuy vs AllChinaBuy",
    metaDescription:
      "LitBuy vs AllChinaBuy compared — fees, QC workflow, shipping, and using LitBuy Finds for product discovery.",
    badge: "Agent comparison",
    h1: "LitBuy vs AllChinaBuy",
    intro:
      "Both LitBuy and AllChinaBuy are shopping agents for Chinese marketplaces. LitBuy Finds links primarily to LitBuy listings — compare fees and features on each platform before your first haul.",
    cardDescription: "Agent comparison for overseas buyers.",
    sections: [
      {
        heading: "Discovery vs checkout",
        paragraphs: [
          "LitBuy Finds is a discovery catalog with verified LitBuy agent links. AllChinaBuy has its own browse tools — compare which workflow you prefer.",
        ],
        links: [{ href: "/litbuy-guide", label: "LitBuy guide" }],
      },
      {
        heading: "QC and shipping",
        paragraphs: [
          "Both agents offer warehouse QC and international lines. Compare current shipping promotions and QC photo policies at checkout.",
        ],
        links: [
          { href: "/guides/how-shipping-works-with-agents", label: "Shipping guide" },
          { href: LITBUY_SIGNUP_URL, label: "LitBuy coupons" },
        ],
      },
    ],
    faqs: [],
    relatedLinks: [{ href: "/litbuy-vs-other-agents", label: "More agent comparisons" }],
  }),

  "litbuy-vs-sugargoo": buildGuide("litbuy-vs-sugargoo", "beginner", {
    title: "LitBuy vs Sugargoo",
    metaDescription:
      "LitBuy vs Sugargoo — shopping agent comparison for Weidian and Taobao finds, QC, and shipping.",
    badge: "Agent comparison",
    h1: "LitBuy vs Sugargoo",
    intro:
      "LitBuy and Sugargoo both buy from Chinese sellers for international customers. LitBuy Finds curates discoverable listings with LitBuy buy links.",
    cardDescription: "Compare LitBuy and Sugargoo for your next haul.",
    sections: [
      {
        heading: "Which agent to use",
        paragraphs: [
          "Many buyers choose based on shipping lines, fees, and UI preference. LitBuy Finds helps you discover products before opening LitBuy to purchase.",
        ],
        links: [{ href: "/how-to-buy", label: "How to buy" }],
      },
    ],
    faqs: [],
    relatedLinks: [{ href: "/litbuy-vs-other-agents", label: "Agent hub" }],
  }),

  "litbuy-vs-pandabuy-alternatives": buildGuide("litbuy-vs-pandabuy-alternatives", "beginner", {
    title: "LitBuy vs Pandabuy Alternatives",
    metaDescription:
      "LitBuy and Pandabuy alternatives compared — agent features, QC, shipping, and finding products on LitBuy Finds.",
    badge: "Agent comparison",
    h1: "LitBuy vs Pandabuy alternatives",
    intro:
      "Pandabuy paused operations — many buyers switched to LitBuy and other agents. LitBuy Finds surfaces curated listings with verified LitBuy links.",
    cardDescription: "Agent alternatives after Pandabuy.",
    sections: [
      {
        heading: "Migrating your workflow",
        paragraphs: [
          "Paste seller URLs into LitBuy when ordering. Use LitBuy Finds to discover new products instead of spreadsheet rows.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "Spreadsheet guide" },
          { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
        ],
      },
    ],
    faqs: [],
    relatedLinks: [{ href: "/litbuy-vs-other-agents", label: "LitBuy vs other agents" }],
  }),
};
