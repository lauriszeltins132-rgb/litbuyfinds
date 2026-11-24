"use client";

import { useEffect, useState } from "react";

type Summary = {
  totals: {
    pageViews: number;
    productViews: number;
    registerImpressions: number;
    registerClicks: number;
    buyClicks: number;
    qcClicks: number;
    discordClicks: number;
    telegramClicks: number;
  };
  topProducts: { id: string; name: string; brand: string; clicks: number }[];
  topBrands: { name: string; clicks: number }[];
  registerCtr: number;
  buyCtr: number;
  topSignupPlacements?: {
    location: string;
    impressions: number;
    clicks: number;
    ctr: number;
  }[];
  updatedAt: string;
  salesFunnel?: {
    spreadsheetPageViews: number;
    spreadsheetProductClicks: number;
    spreadsheetBuyClicks: number;
    productPageViews: number;
    productBuyClicks: number;
    signupClicks: number;
    invitePageViews: number;
    productInteractionRate: number;
    spreadsheetBuyCtr: number;
    productPageBuyRate: number;
    signupClickRate: number;
    topBuyProducts: {
      id: string;
      name: string;
      buyClicks: number;
      productClicks: number;
      buyCtr: number;
    }[];
  };
};

export default function StatsDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/analytics/summary", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed");
        const data = (await response.json()) as Summary;
        if (active) setSummary(data);
      } catch {
        if (active) setError(true);
      }
    }

    load();
    const timer = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  if (error) {
    return (
      <p className="text-sm text-muted">
        Could not load analytics summary. Events still flow to Vercel Analytics.
      </p>
    );
  }

  if (!summary) {
    return <p className="text-sm text-muted">Loading conversion stats…</p>;
  }

  const cards = [
    { label: "Register CTR", value: `${summary.registerCtr}%` },
    { label: "Buy CTR", value: `${summary.buyCtr}%` },
    { label: "Register clicks", value: summary.totals.registerClicks },
    { label: "Buy clicks", value: summary.totals.buyClicks },
    { label: "QC clicks", value: summary.totals.qcClicks },
    { label: "Discord clicks", value: summary.totals.discordClicks },
    { label: "Telegram clicks", value: summary.totals.telegramClicks },
    { label: "Page views", value: summary.totals.pageViews },
  ];

  const funnel = summary.salesFunnel;

  return (
    <div className="space-y-8">
      {funnel ? (
        <section className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-lg font-black">Last 7 days</h2>
          <p className="mt-1 text-sm text-muted">
            Outbound purchase intent. These clicks are not completed LitBuy orders.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Spreadsheet visitors", funnel.spreadsheetPageViews],
              ["Spreadsheet product clicks", funnel.spreadsheetProductClicks],
              ["Spreadsheet Buy clicks", funnel.spreadsheetBuyClicks],
              ["Product-page Buy clicks", funnel.productBuyClicks],
              ["LitBuy signup clicks", funnel.signupClicks],
              ["Product interaction rate", `${funnel.productInteractionRate}%`],
              ["Spreadsheet outbound Buy CTR", `${funnel.spreadsheetBuyCtr}%`],
              ["Product-page Buy rate", `${funnel.productPageBuyRate}%`],
              ["Invite/signup click rate", `${funnel.signupClickRate}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border/80 bg-background/60 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-black text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <h3 className="mt-6 text-base font-black">Top 10 products by LitBuy Buy clicks</h3>
          <ul className="mt-3 space-y-2">
            {funnel.topBuyProducts.length === 0 ? (
              <li className="text-sm text-muted">No LitBuy buy clicks in the last 7 days.</li>
            ) : (
              funnel.topBuyProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex flex-wrap items-center justify-between gap-3 text-sm"
                >
                  <span className="font-medium text-foreground">{product.name}</span>
                  <span className="text-muted">
                    {product.buyClicks} buy clicks · {product.productClicks} product clicks ·{" "}
                    {product.productClicks > 0 ? `${product.buyCtr}% buy CTR` : "buy CTR —"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      ) : null}
      <p className="text-xs text-muted">
        Last updated {new Date(summary.updatedAt).toLocaleString()} · Refreshes
        every 30s · Also visible in Vercel Analytics → Events
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-surface/40 p-5"
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-black text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface/40 p-6 lg:col-span-2">
          <h2 className="text-lg font-black">Signup placement performance</h2>
          <p className="mt-1 text-sm text-muted">
            Register impressions and clicks by placement location
          </p>
          <ul className="mt-4 space-y-3">
            {(summary.topSignupPlacements ?? []).length === 0 ? (
              <li className="text-sm text-muted">No signup events yet.</li>
            ) : (
              summary.topSignupPlacements!.map((row) => (
                <li
                  key={row.location}
                  className="flex flex-wrap items-center justify-between gap-3 text-sm"
                >
                  <span className="font-medium text-foreground">{row.location}</span>
                  <span className="text-muted">
                    {row.impressions} views · {row.clicks} clicks · {row.ctr}% CTR
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-lg font-black">Most clicked products</h2>
          <p className="mt-1 text-sm text-muted">Buy + QC clicks combined</p>
          <ul className="mt-4 space-y-3">
            {summary.topProducts.length === 0 ? (
              <li className="text-sm text-muted">No product clicks yet.</li>
            ) : (
              summary.topProducts.map((product, index) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-muted">{index + 1}.</span>
                  <span className="flex-1 truncate font-medium text-foreground">
                    {product.name}
                  </span>
                  <span className="shrink-0 text-muted">{product.brand}</span>
                  <span className="shrink-0 font-bold text-accent">
                    {product.clicks}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-lg font-black">Most clicked brands</h2>
          <p className="mt-1 text-sm text-muted">From buy and QC events</p>
          <ul className="mt-4 space-y-3">
            {summary.topBrands.length === 0 ? (
              <li className="text-sm text-muted">No brand clicks yet.</li>
            ) : (
              summary.topBrands.map((brand, index) => (
                <li
                  key={brand.name}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-muted">{index + 1}.</span>
                  <span className="flex-1 font-medium text-foreground">
                    {brand.name}
                  </span>
                  <span className="font-bold text-accent">{brand.clicks}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
