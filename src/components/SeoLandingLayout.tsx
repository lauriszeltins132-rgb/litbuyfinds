import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import SchemaScript from "@/components/SchemaScript";
import type { SeoLandingConfig } from "@/lib/seo-landing-pages";
import { buildCollectionPageSchema, buildFaqSchema } from "@/lib/schema";

type SeoLandingLayoutProps = {
  config: SeoLandingConfig;
};

export default function SeoLandingLayout({ config }: SeoLandingLayoutProps) {
  const products = config.getProducts();
  const faqs = config.faqs.length > 0 ? config.faqs : undefined;

  return (
    <>
      <SchemaScript
        data={buildCollectionPageSchema({
          name: config.h1,
          description: config.metaDescription,
          path: config.path,
          numberOfItems: products.length,
        })}
      />
      {faqs ? <SchemaScript data={buildFaqSchema(faqs)} /> : null}

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: config.h1 },
        ]}
        currentPath={config.path}
      />

      <article className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {config.badge}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {config.h1}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">{config.intro}</p>

          <div className="mt-10 space-y-10">
            {config.sections.map((section) => {
              const Heading = section.level === 3 ? "h3" : "h2";
              return (
                <section key={section.heading}>
                  <Heading
                    className={
                      section.level === 3
                        ? "text-lg font-bold text-foreground"
                        : "text-xl font-black text-foreground"
                    }
                  >
                    {section.heading}
                  </Heading>
                  <div className="mt-3 space-y-3 text-base leading-relaxed text-muted">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.links && section.links.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}
          </div>

          {faqs ? (
            <section className="mt-12 rounded-2xl border border-border bg-surface/40 p-6">
              <h2 className="text-xl font-black">Frequently asked questions</h2>
              <dl className="mt-5 space-y-5">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="font-bold text-foreground">{faq.question}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {config.relatedLinks.length > 0 ? (
            <section className="mt-10 border-t border-border pt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
                Keep exploring
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {config.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </article>

      {products.length > 0 ? (
        <section className="px-4 pb-12 pt-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-black">{config.productSectionTitle}</h2>
            <p className="mt-1 text-sm text-muted">
              {products.length.toLocaleString()} curated picks with verified LitBuy links.
            </p>
            <div className="mt-6">
              <ProductGrid products={products} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
