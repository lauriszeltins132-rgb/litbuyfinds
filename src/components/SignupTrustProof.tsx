import { SOCIAL_LINKS } from "@/lib/constants";
import { getCatalogStats } from "@/lib/products";

export default function SignupTrustProof() {
  const stats = getCatalogStats();

  const items = [
    `${stats.total.toLocaleString()}+ product finds`,
    "Daily catalog updates",
    `${stats.withQc.toLocaleString()} QC references`,
    "Active Discord community",
    "Active Telegram community",
  ];

  return (
    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
          {item}
        </li>
      ))}
      <li className="sr-only">
        Discord: {SOCIAL_LINKS.discord} · Telegram: {SOCIAL_LINKS.telegram}
      </li>
    </ul>
  );
}
