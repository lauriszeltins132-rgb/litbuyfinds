import type { Metadata } from "next";
import StatsDashboard from "@/components/StatsDashboard";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Conversion Stats",
    description: "Internal conversion tracking summary for LitBuy Finds.",
    path: "/stats",
  }),
  robots: { index: false, follow: false },
};

export default function StatsPage() {
  return (
    <div className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Internal
        </p>
        <h1 className="mt-2 text-3xl font-black">Conversion dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Lightweight tracking for register, buy, QC, Discord, and Telegram
          clicks. Events are sent to Vercel Analytics and aggregated here.
        </p>
        <div className="mt-8">
          <StatsDashboard />
        </div>
      </div>
    </div>
  );
}
