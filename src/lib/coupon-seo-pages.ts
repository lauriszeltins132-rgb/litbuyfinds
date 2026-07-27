import { SEO_AGENTS, couponSlugFor, type SeoAgent } from "./seo-agents";

export type CouponVariant = "standard" | "best" | "y2026";

export type CouponSeoSection = {
  heading: string;
  level?: 2 | 3;
  paragraphs: string[];
  links?: { href: string; label: string }[];
};

export type CouponSeoPageConfig = {
  slug: string;
  path: string;
  variant: CouponVariant;
  agentId: SeoAgent["id"];
  agentName: string;
  agentSlug: string;
  signupUrl: string;
  title: string;
  metaDescription: string;
  imageAlt: string;
  badge: string;
  h1: string;
  intro: string;
  keywords: string[];
  sections: CouponSeoSection[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
};

const VARIANT_INTROS: Record<CouponVariant, (agent: SeoAgent) => string> = {
  standard: (agent) =>
    `Looking for a working ${agent.name} coupon or promo code? This page tracks verified ${agent.name} discount codes for 2026 so you can save on your next haul without hunting through forum posts.`,
  best: (agent) =>
    `We track the best ${agent.name} coupons available right now — verified promo codes and discount offers for 2026, checked regularly so you are not pasting in expired codes.`,
  y2026: (agent) =>
    `Updated for 2026: verified ${agent.name} coupons and promo codes in one place. Claim an offer below before you check out on ${agent.name}.`,
};

const VARIANT_BADGE: Record<CouponVariant, string> = {
  standard: "Verified coupons",
  best: "Best coupons",
  y2026: "2026 coupons",
};

function buildTitle(agent: SeoAgent, variant: CouponVariant): string {
  const base = `${agent.name} Coupons 2026 – Verified Promo & Discount Codes`;
  return variant === "best" ? `Best ${base}` : base;
}

function buildCouponPage(agent: SeoAgent, variant: CouponVariant): CouponSeoPageConfig {
  const slug = couponSlugFor(agent.slug, variant);
  const path = `/${slug}`;
  const otherAgents = SEO_AGENTS.filter((candidate) => candidate.id !== agent.id);

  return {
    slug,
    path,
    variant,
    agentId: agent.id,
    agentName: agent.name,
    agentSlug: agent.slug,
    signupUrl: agent.signupUrl,
    title: buildTitle(agent, variant),
    metaDescription: `Get the latest verified ${agent.name} coupons, promo codes, and discounts for 2026. Click below to claim instantly.`,
    imageAlt: `${agent.name} coupons and promo codes 2026 — verified discount codes`,
    badge: VARIANT_BADGE[variant],
    h1: `${agent.name} Coupons & Promo Codes`,
    intro: VARIANT_INTROS[variant](agent),
    keywords: [
      `${agent.slug} coupon`,
      `${agent.slug} coupons`,
      `${agent.slug} promo code`,
      `${agent.slug} discount code`,
      `${agent.slug} coupons 2026`,
      `best ${agent.slug} coupon`,
    ],
    sections: [
      {
        heading: `How to claim a ${agent.name} coupon`,
        paragraphs: [
          `Tap the claim button on this page to open ${agent.name} with any available signup or promo offer applied. Offers can change without notice, so always confirm the discount on the checkout page before you pay.`,
          `We do not publish made-up percentage discounts — the exact offer you see is whatever ${agent.name} is currently running for new or existing accounts.`,
        ],
        links: [
          { href: agent.findsPath, label: `Browse ${agent.name} finds` },
          { href: agent.spreadsheetPath, label: `${agent.name} spreadsheet` },
        ],
      },
      {
        heading: "Why coupon codes are not always guaranteed",
        paragraphs: [
          `Shopping agent promotions change frequently based on season, shipping line, and account status. A ${agent.name} coupon that worked last month may be replaced or expired today.`,
          `This page is updated when offers change — bookmark it instead of an old forum thread or expired code list.`,
        ],
      },
      {
        heading: `Pair coupons with QC-approved ${agent.name} finds`,
        paragraphs: [
          `A discount is only worth it on a good listing. Browse the ${agent.name} finds catalog on LitBuy Finds for QC-referenced products before you claim your coupon and check out.`,
        ],
        links: [
          { href: agent.findsPath, label: `${agent.name} finds catalog` },
          { href: "/guides/how-to-check-qc-photos", label: "QC photo guide" },
        ],
      },
      {
        heading: "Coupons for other agents",
        paragraphs: [
          `If you shop across multiple platforms, check coupon pages for other supported agents below — plus each agent's Discord community for community-shared promo codes.`,
        ],
        links: [
          { href: agent.discordPath, label: `${agent.name} Discord` },
          ...otherAgents.map((other) => ({
            href: `/${other.slug}-coupons`,
            label: `${other.name} coupons`,
          })),
        ],
      },
    ],
    faqs: [
      {
        question: `Is there an active ${agent.name} coupon right now?`,
        answer: `Claim offers change regularly. Tap the button above to open ${agent.name} and see the current signup or promo offer applied at checkout.`,
      },
      {
        question: `Do I need an account to use a ${agent.name} coupon?`,
        answer: `Most ${agent.name} promo codes apply automatically when you sign up or check out through the link on this page — no separate code entry required.`,
      },
      {
        question: "How often is this page updated?",
        answer:
          "We review agent coupon pages regularly and remove offers that stop working. If a claim link stops applying a discount, the offer has likely expired on the agent's side.",
      },
      {
        question: `Can I combine ${agent.name} coupons with other agents?`,
        answer:
          "Coupons are agent-specific. If you shop across multiple platforms, check each agent's dedicated coupon page for their current offer.",
      },
    ],
    relatedLinks: [
      { href: "/", label: "LitBuy Finds home" },
      { href: agent.findsPath, label: `${agent.name} finds` },
      { href: agent.spreadsheetPath, label: `${agent.name} spreadsheet` },
      { href: agent.discordPath, label: `${agent.name} Discord` },
      ...otherAgents.map((other) => ({
        href: `/${other.slug}-coupons`,
        label: `${other.name} coupons`,
      })),
    ],
  };
}

const VARIANTS: CouponVariant[] = ["standard", "best", "y2026"];

export const COUPON_SEO_PAGES: Record<string, CouponSeoPageConfig> = Object.fromEntries(
  SEO_AGENTS.flatMap((agent) =>
    VARIANTS.map((variant) => {
      const page = buildCouponPage(agent, variant);
      return [page.slug, page] as const;
    })
  )
);

export const COUPON_SEO_SLUGS = Object.keys(COUPON_SEO_PAGES);

export function getCouponSeoPage(slug: string): CouponSeoPageConfig | undefined {
  return COUPON_SEO_PAGES[slug];
}
