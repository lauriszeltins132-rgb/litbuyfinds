import {
  SOCIAL_LINKS,
  TELEGRAM_CHANNEL_NAME,
  TELEGRAM_COLLAB_CONTACT,
  TELEGRAM_COLLAB_URL,
  TELEGRAM_HANDLE,
  TELEGRAM_MEMBER_LABEL,
} from "./constants";
import { TELEGRAM_SUPPORTED_AGENTS } from "./telegram-seo-pages";

export const ADVERTISE_PAGE_PATH = "/advertise";

export const ADVERTISE_PAGE_TITLE =
  "Advertise with RN Finds | Telegram Promotion";

export const ADVERTISE_META_DESCRIPTION =
  "Promote your products, agent service, or seller store to 40,000+ RN Finds Telegram members. Contact @smukasolas for collaboration and sponsored post opportunities.";

export const ADVERTISE_KEYWORDS = [
  "advertise on Telegram",
  "Telegram promotion",
  "RN Finds advertising",
  "sponsored Telegram post",
  "shopping agent promotion",
  "seller promotion",
  "sneaker finds promotion",
  "fashion finds promotion",
];

export const ADVERTISE_STATS = [
  {
    value: TELEGRAM_MEMBER_LABEL,
    label: "Telegram members",
    detail: "Active shopping & finds audience",
  },
  {
    value: "Daily",
    label: "Finds community",
    detail: "Sneakers, fashion, QC & spreadsheets",
  },
  {
    value: "Multi-agent",
    label: "Buyer audience",
    detail: TELEGRAM_SUPPORTED_AGENTS.join(" · "),
  },
  {
    value: "Flexible",
    label: "Sponsored posts",
    detail: "Contact for pricing & placement",
  },
] as const;

export const ADVERTISE_OPTIONS = [
  {
    title: "Sponsored Telegram post",
    body: "A dedicated post in the RN Finds channel highlighting your product, store, or offer — ideal for launches, restocks, or time-sensitive campaigns.",
  },
  {
    title: "Product promotion",
    body: "Promote individual sneaker finds, fashion pieces, or spreadsheet rows to buyers already browsing Weidian, Taobao, and agent links daily.",
  },
  {
    title: "Agent promotion",
    body: "Shopping agent promotion for platforms like LitBuy, MuleBuy, OopBuy, ACBuy, or Kakobuy — reach buyers comparing agents and shipping lines.",
  },
  {
    title: "Seller spotlight",
    body: "Seller promotion for trusted Weidian or Taobao stores — position your shop in front of a QC-conscious community that values reputation.",
  },
  {
    title: "Long-term posting partnership",
    body: "Ongoing posting privileges or recurring sponsored Telegram placements for sellers and agents with consistent inventory.",
  },
] as const;

export const ADVERTISE_FAQS = [
  {
    question: "How can I advertise on RN Finds?",
    answer: `Contact ${TELEGRAM_COLLAB_CONTACT} on Telegram for collaboration options and pricing.`,
  },
  {
    question: "What promotions are available?",
    answer:
      "Sponsored posts, product promotions, agent promotions, seller spotlights, and long-term posting partnerships.",
  },
  {
    question: "Is RN Finds only for LitBuy?",
    answer: `No. ${TELEGRAM_CHANNEL_NAME} supports ${TELEGRAM_SUPPORTED_AGENTS.join(", ")}.`,
  },
  {
    question: "Do you list public prices?",
    answer:
      "No. Pricing depends on the promotion type, duration, and placement. Contact for pricing.",
  },
] as const;

export const ADVERTISE_SECTIONS = [
  {
    heading: "Who RN Finds reaches",
    paragraphs: [
      `${TELEGRAM_CHANNEL_NAME} (${TELEGRAM_HANDLE}) is a ${TELEGRAM_MEMBER_LABEL} Telegram community focused on shopping finds — sneakers, streetwear, QC photos, spreadsheet products, and agent checkout links.`,
      "Members are international buyers who use Chinese marketplaces with shopping agents. Many discover products through Telegram before opening agent pages — which makes RN Finds advertising useful for sellers, agents, and brands targeting that audience.",
    ],
  },
  {
    heading: "A product-focused community, not a generic ad channel",
    paragraphs: [
      "RN Finds posts daily finds, QC references, and spreadsheet-style rows that members actually use. Promotions fit best when they match that format — real products, clear agent links, and honest QC context.",
      "LitBuy Finds (this website) stays focused on searchable product pages. Telegram is the live community layer where sponsored Telegram posts and collaborations appear.",
    ],
    links: [
      { href: "/telegram", label: "About RN Finds Telegram" },
      { href: "/rn-finds", label: "RN Finds community" },
    ],
  },
  {
    heading: "Supported agents & seller types",
    paragraphs: [
      `The audience uses multiple agents — ${TELEGRAM_SUPPORTED_AGENTS.join(", ")}. Agent promotion and seller promotion work best when your links match how members already buy.`,
      "Whether you are a Weidian seller, Taobao store, shopping agent, or spreadsheet curator, RN Finds advertising can put your offer in front of buyers who care about sneaker finds promotion and fashion finds promotion.",
    ],
  },
  {
    heading: "How to start a collaboration",
    paragraphs: [
      `Message ${TELEGRAM_COLLAB_CONTACT} on Telegram with your brand or store name, what you want to promote, and your preferred timeline. We do not publish fixed rate cards — every RN Finds advertising package depends on placement and duration.`,
      "Typical requests include one-off sponsored Telegram posts, product promotion for a new batch, or a longer posting partnership. We reply with options and pricing after reviewing your request.",
    ],
    links: [
      { href: TELEGRAM_COLLAB_URL, label: `Contact ${TELEGRAM_COLLAB_CONTACT}` },
      { href: SOCIAL_LINKS.telegram, label: `View ${TELEGRAM_CHANNEL_NAME}` },
    ],
  },
] as const;
