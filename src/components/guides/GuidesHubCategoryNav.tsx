import Link from "next/link";
import { GUIDE_HUB_SECTIONS } from "@/lib/guides/hub-sections";

export default function GuidesHubCategoryNav() {
  return (
    <nav
      aria-label="Guide categories"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {GUIDE_HUB_SECTIONS.map((section) => (
        <Link
          key={section.id}
          href={`#${section.anchor}`}
          className="panel-shell rounded-2xl border border-border bg-surface/30 p-5 transition hover:border-accent/30 hover:bg-surface/50"
        >
          <h2 className="text-base font-black text-foreground">{section.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {section.description}
          </p>
          <span className="mt-3 inline-block text-xs font-bold text-accent">
            Browse section →
          </span>
        </Link>
      ))}
    </nav>
  );
}
