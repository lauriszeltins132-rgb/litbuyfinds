import SchemaScript from "@/components/SchemaScript";
import { buildFaqSchema } from "@/lib/schema";
import {
  HOMEPAGE_AKA_LINE,
  HOMEPAGE_ENTITY_FAQS,
} from "@/lib/brand-entity";

export default function HomepageFaq() {
  return (
    <>
      <SchemaScript data={buildFaqSchema([...HOMEPAGE_ENTITY_FAQS])} />
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-black">LitBuy Finds FAQ</h2>
          <p className="mt-1 text-sm text-muted">
            What LitBuy Finds is, how ordering works, QC photos, agents, and where to find the best picks.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted/70">
            {HOMEPAGE_AKA_LINE}
          </p>
          <dl className="mt-8 space-y-6">
            {HOMEPAGE_ENTITY_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-border bg-surface/30 p-5"
              >
                <dt className="font-bold text-foreground">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
