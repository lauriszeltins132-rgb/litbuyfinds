import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import SmartLink from "@/components/SmartLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import SchemaScript from "@/components/SchemaScript";
import { AI_PROMPT_CHIPS } from "@/lib/ai/prompt-chips";
import { buildFaqSchema, buildWebPageSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

const AiChat = dynamic(() => import("@/components/ai/AiChat"), {
  loading: () => (
    <p className="text-sm text-muted" role="status">
      Loading LitBuy AI…
    </p>
  ),
});

export const metadata: Metadata = buildPageMetadata({
  title: "LitBuy AI Product Finder – Search LitBuy Finds",
  description:
    "Describe what you’re looking for and use LitBuy AI to search products, compare finds, build outfits, and discover items within your budget.",
  path: "/ai",
});

const faqs = [
  {
    question: "What is LitBuy AI?",
    answer:
      "LitBuy AI is a catalogue-grounded shopping assistant for litbuyfinds.io. It only recommends real products from our finds database.",
  },
  {
    question: "Does LitBuy AI invent products?",
    answer:
      "No. Every product card comes from the live catalogue search tools. If nothing matches, it says so and offers nearest alternatives.",
  },
  {
    question: "Are prices final?",
    answer:
      "No. Prices on find pages can change at LitBuy checkout. Always confirm the live total before paying.",
  },
  {
    question: "Can it build a haul under a budget?",
    answer:
      "Yes. Ask for an outfit or haul with a budget — totals are calculated from catalogue prices and exclude shipping unless stated.",
  },
];

type AiPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AiPage({ searchParams }: AiPageProps) {
  const params = await searchParams;
  const initialPrompt = params.q?.slice(0, 1200);

  const schema = [
    buildWebPageSchema({
      name: "LitBuy AI Product Finder",
      description:
        "Natural-language product discovery over the LitBuy Finds catalogue.",
      path: "/ai",
    }),
    buildFaqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "LitBuy AI",
      applicationCategory: "ShoppingApplication",
      operatingSystem: "Web",
      url: "https://litbuyfinds.io/ai",
      description:
        "AI product finder for LitBuy Finds — search, compare, and build hauls from real catalogue products.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ];

  return (
    <>
      <SchemaScript data={schema} />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "LitBuy AI" }]}
        currentPath="/ai"
      />

      <div className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            LitBuy AI
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Ask LitBuy AI
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Describe what you’re looking for — color, brand, budget, season, or a
            full haul. LitBuy AI matches you with real products from the LitBuy
            Finds catalogue. It will not invent listings, prices, or stock.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {AI_PROMPT_CHIPS.slice(0, 6).map((chip) => (
              <Link
                key={chip.label}
                href={`/ai?q=${encodeURIComponent(chip.prompt)}`}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
              >
                {chip.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-surface/40 p-4 sm:p-5">
            <AiChat entryPoint="ai-page" initialPrompt={initialPrompt} />
          </div>

          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">How it works</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
              <li>You describe a find, outfit, or budget in plain language.</li>
              <li>LitBuy AI searches the live catalogue with price and category filters.</li>
              <li>You get product cards with links to find pages and LitBuy checkout.</li>
            </ol>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-black text-foreground">Explore more</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {[
                { href: "/", label: "Homepage" },
                { href: "/litbuy-spreadsheet", label: "Spreadsheet" },
                { href: "/trending", label: "Trending" },
                { href: "/categories", label: "Categories" },
                { href: "/guides", label: "Guides" },
                { href: "/telegram-litbuy", label: "Telegram" },
                { href: "/litbuy-coupons", label: "LitBuy coupons" },
                { href: "/best-shoes", label: "Best shoes" },
              ].map((link) => (
                <li key={link.href}>
                  <SmartLink
                    href={link.href}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent hover:text-accent"
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-black text-foreground">FAQ</h2>
            <dl className="mt-4 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-border p-4">
                  <dt className="font-bold text-foreground">{faq.question}</dt>
                  <dd className="mt-2 text-sm text-muted">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
