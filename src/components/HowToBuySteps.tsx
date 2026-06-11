import RegisterLink from "@/components/RegisterLink";

const STEPS = [
  {
    title: "Create or log in to LitBuy",
    body: "You need a free LitBuy agent account before opening product links.",
  },
  {
    title: "Open the product link",
    body: "Tap Buy on LitBuy Finds to open this exact listing and confirm size and price.",
  },
  {
    title: "Check QC photos",
    body: "Review QC references here, then request warehouse photos of your item.",
  },
  {
    title: "Add it to your haul",
    body: "Store items in your warehouse, combine shipments, and ship when ready.",
  },
] as const;

export default function HowToBuySteps() {
  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface/35 p-5 sm:p-6">
      <h2 className="text-lg font-black">How to buy this item</h2>
      <ol className="mt-5 space-y-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-sm font-black text-accent">
              {index + 1}
            </span>
            <div>
              <p className="font-bold text-foreground">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <RegisterLink
        location="product_signup_block"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-black text-background transition hover:bg-accent-hover"
      >
        Create Free LitBuy Account
      </RegisterLink>
    </section>
  );
}
