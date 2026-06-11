import { LITBUY_SIGNUP_URL } from "@/lib/constants";
import RegisterLink from "@/components/RegisterLink";

const STEPS = [
  {
    title: "Create LitBuy account",
    body: "Register free — you need an agent account before opening product links.",
  },
  {
    title: "Open product link",
    body: "Use the Buy button to open this listing on LitBuy and confirm size and price.",
  },
  {
    title: "Review QC",
    body: "Check QC references here, then request warehouse photos of your exact item.",
  },
  {
    title: "Add to haul",
    body: "Save items in your warehouse, combine shipments, and ship when ready.",
  },
] as const;

export default function HowToBuySteps() {
  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface/35 p-5 sm:p-6">
      <h2 className="text-lg font-black">How to buy this product</h2>
      <ol className="mt-5 space-y-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-sm font-black text-accent">
              {index + 1}
            </span>
            <div>
              <p className="font-bold text-foreground">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
              {index === 0 ? (
                <RegisterLink
                  location="product_how_to_buy"
                  className="mt-2 inline-flex text-sm font-bold text-accent hover:underline"
                >
                  Create free account →
                </RegisterLink>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-muted">
        Checkout happens on{" "}
        <a
          href={LITBUY_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="font-bold text-accent hover:underline"
        >
          LitBuy
        </a>
        , not on LitBuy Finds.
      </p>
    </section>
  );
}
