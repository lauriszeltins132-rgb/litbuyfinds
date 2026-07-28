import Link from "next/link";
import SmartLink from "@/components/SmartLink";
import { LITBUY_SIGNUP_URL, PUBLIC_CATALOG_COUNT } from "@/lib/constants";

const PARAGRAPHS = [
  `LitBuy Finds is the largest searchable catalog of LitBuy spreadsheet products on the web. Instead of scrolling endless rows in a shared Google Sheet, you get ${PUBLIC_CATALOG_COUNT} indexed finds with photos, prices, QC references, and one-click agent links. Whether you are hunting sneaker finds, fashion finds, or rep finds for your next haul, everything is organized by brand, category, and collection.`,
  "Spreadsheets were the original way the community shared Weidian and Taobao links — and they still work for power users. The problem is discovery: a sheet does not tell you which Nike Dunk batch has the best photos, which Moncler jacket has QC history, or what dropped today. LitBuy Finds solves that by turning raw spreadsheet data into proper landing pages you can search, filter, and share.",
  "Search is the fastest path in. Type a brand like Jordan or Moncler, a category like hoodies or bags, or even a specific silhouette. The homepage search bar and catalog filters work together so you can narrow from thousands of listings to a shortlist worth opening. Each product page shows the listing image, USD price when available, marketplace source, and buttons for LitBuy, OopBuy, Kakobuy, MuleBuy, and ACBuy.",
  "QC photos are the reason many buyers use agents in the first place. After you order, the warehouse photographs your item so you can approve it or request an exchange before international shipping. LitBuy Finds highlights listings with QC references — links to real warehouse photos from past orders — so you know what a batch looked like for other buyers. That does not replace your own QC set, but it helps you avoid obvious misses.",
  "Most finds on LitBuy Finds come from Weidian and Taobao sellers. Weidian is popular for sneakers, streetwear, and independent brands; Taobao covers a wider mix of fashion and accessories. LitBuy Finds does not host the shops — it indexes affiliate and community spreadsheet links and routes you through your chosen agent with the correct product URL encoded.",
  "LitBuy is the recommended agent on this site because of shipping discounts, a polished app, and reliable QC workflows — but you are not locked in. OopBuy, Kakobuy, MuleBuy, and ACBuy are fully supported on every product page. Switch agents in the header before you click Buy; the link rebuilds automatically for the same listing.",
  "Daily updates matter because spreadsheet catalogs move quickly. Sellers change prices, batches sell out, and new QC threads appear on Reddit and Discord. LitBuy Finds syncs with community sheets and engagement signals so Trending Today, Latest Finds, and collection pages reflect what people are actually clicking — not a static snapshot from months ago.",
  "Categories make browsing intuitive when you do not have a specific brand in mind. Sneakers and shoes cover Dunks, Jordans, New Balance, and more. Hoodies and jackets include Stussy, Corteiz, Moncler, and Arc'teryx-style outerwear. Bags and accessories round out hauls with crossbody, belt, and jewelry picks. Electronics and niche categories are indexed too when they appear in source sheets.",
  "Verified links protect you from broken or hijacked URLs — a common spreadsheet problem when rows get copied without checking. Every buy button on LitBuy Finds is generated from the stored marketplace link, not an opaque redirect chain. Registering a free LitBuy account also unlocks shipping coupons and order tracking, which is why we surface a 30% off shipping offer without aggressive popups.",
  "Collections are curated shortcuts for sharing. Pages like Best Nike LitBuy Finds, Best Jordan LitBuy Finds, Best QC Approved Finds, and Trending This Week are designed for Discord pins, TikTok bios, and haul posts. Each collection has its own intro, product grid, and internal links to related brands so search engines and humans can navigate deeper.",
  "If you are new to agent buying, start with our beginner guide — then browse Trending or Editor's Picks on the homepage. Experienced buyers can jump straight to brand hubs (Nike, Jordan, Moncler, Chrome Hearts, Stussy, Dior, Balenciaga, Louis Vuitton) or category pages for sneakers, hoodies, jackets, and bags. The goal is simple: less time hunting spreadsheets, more time picking finds you will actually ship.",
] as const;

export default function HomepageSeoContent() {
  const preview = PARAGRAPHS.slice(0, 2).join(" ");

  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <details className="group rounded-2xl border border-border bg-surface/25 p-6 sm:p-8">
          <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <h2 className="text-xl font-black sm:text-2xl">
              The Largest LitBuy Finds Database
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted group-open:hidden">
              {preview}
            </p>
            <span className="mt-4 inline-block text-sm font-bold text-accent group-open:hidden">
              Read the full guide
            </span>
          </summary>

          <div className="mt-6 space-y-4 border-t border-border pt-6">
            {PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}

            <div className="flex flex-wrap gap-2 pt-2">
              <SmartLink
                href={LITBUY_SIGNUP_URL}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
              >
                LitBuy coupons
              </SmartLink>
              <Link
                href="/guides/litbuy-finds"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
              >
                LitBuy finds guide
              </Link>
              <Link
                href="/guides/litbuy-spreadsheet"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
              >
                Spreadsheet guide
              </Link>
              <Link
                href="/collections"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
              >
                All collections
              </Link>
              <Link
                href="/brands"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
              >
                Brand directory
              </Link>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
