import LitBuySeoHubLinks from "@/components/LitBuySeoHubLinks";

export default function HomepageSeoHubFooter() {
  return (
    <section className="litbuy-seo-hub-footer px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-3xl border border-accent/20 bg-gradient-to-br from-[#0c0d10] via-[#12140f] to-[#0a0b0e] p-6 sm:p-8">
        <h2 className="text-xl font-black text-[#f2f1ed] sm:text-2xl">
          LitBuy Finds — Telegram, Discord, Coupons & Spreadsheet
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#c8c6be] sm:text-base">
          LitBuy Finds is your searchable home for LitBuy spreadsheet items with QC
          photos, verified agent links, and daily updates. Join LitBuy Telegram for
          drop alerts, LitBuy Discord for community QC threads, claim LitBuy Coupons
          for shipping savings, and use the LitBuy Spreadsheet hub to browse 3,000+
          verified finds without scrolling endless rows.
        </p>
        <LitBuySeoHubLinks title="All LitBuy SEO landing pages" />
      </div>
    </section>
  );
}
