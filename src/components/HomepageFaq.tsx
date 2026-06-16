import SchemaScript from "@/components/SchemaScript";
import { buildFaqSchema } from "@/lib/schema";

const HOMEPAGE_FAQS = [
  {
    question: "What is LitBuy?",
    answer:
      "LitBuy is a shopping agent that buys from Chinese marketplaces like Weidian and Taobao on your behalf. LitBuy Finds is the discovery catalog — browse products here, then open verified LitBuy links to purchase, QC, and ship internationally.",
  },
  {
    question: "How do I use LitBuy?",
    answer:
      "Search LitBuy Finds by brand or category, open a product page, and click the LitBuy buy button. Register on LitBuy before your first order to unlock verified links, warehouse QC, and shipping discounts.",
  },
  {
    question: "What are QC photos?",
    answer:
      "QC (quality control) photos show the actual item at the warehouse before it ships. LitBuy Finds links to reference QC where available; LitBuy lets you request photos of your exact order after purchase.",
  },
  {
    question: "What are the best LitBuy finds?",
    answer:
      "Popular Today, Top QC Finds, and our best LitBuy finds page highlight community favorites. Sneakers, jackets, and designer bags with QC references tend to rank highest.",
  },
  {
    question: "How do I buy from Weidian using LitBuy?",
    answer:
      "Find a Weidian-linked product on LitBuy Finds, open the LitBuy buy link, confirm size and price on LitBuy, then pay through the agent. LitBuy places the Weidian order and stores the parcel for QC and shipping.",
  },
] as const;

export default function HomepageFaq() {
  return (
    <>
      <SchemaScript data={buildFaqSchema([...HOMEPAGE_FAQS])} />
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-black">LitBuy Finds FAQ</h2>
          <p className="mt-1 text-sm text-muted">
            Quick answers about LitBuy, QC approved products, and buying from Weidian and
            Taobao.
          </p>
          <dl className="mt-8 space-y-6">
            {HOMEPAGE_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-border bg-surface/30 p-5"
              >
                <dt className="font-bold text-foreground">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
