import Link from "next/link";

const QUICK_LINKS = [
  { href: "/categories", label: "Browse categories" },
  { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
  { href: "/latest-finds", label: "Latest finds" },
  { href: "/rep-finds", label: "Rep finds" },
  { href: "/best-litbuy-finds", label: "Best LitBuy finds" },
  { href: "/litbuy-qc", label: "QC finds database" },
  { href: "/finds", label: "Finds database" },
] as const;

export default function DiscoveryQuickLinks() {
  return (
    <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2 sm:mt-5">
      {QUICK_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full border border-border/80 bg-surface/40 px-3 py-1.5 text-[11px] font-bold text-muted transition hover:border-accent/35 hover:text-accent sm:text-xs"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
