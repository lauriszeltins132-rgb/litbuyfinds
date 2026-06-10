import Link from "next/link";
import {
  CONTACT_EMAIL,
  LITBUY_OFFER_HEADLINE,
  LITBUY_SIGNUP_URL,
  SITE_NAME,
  SOCIAL_LINKS,
  TELEGRAM_HANDLE,
} from "@/lib/constants";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories, getAllProducts } from "@/lib/products";
import CommunityLinks from "./CommunityLinks";

const GUIDE_LINKS = [
  { href: "/how-to-buy", label: "How to buy" },
  { href: "/new-user-guide", label: "New user guide" },
  { href: "/best-rep-sneakers", label: "Best rep sneakers" },
  { href: "/best-budget-finds", label: "Best budget finds" },
  { href: "/litbuy-vs-other-agents", label: "LitBuy vs agents" },
];

const TRUST_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  const categories = getCategories().filter((c) => c.group === "category");
  const brands = getBrandsFromProducts(getAllProducts()).slice(0, 8);

  return (
    <footer className="mt-auto border-t border-border bg-surface/50 px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-2xl border border-accent/15 bg-gradient-to-br from-accent/8 via-surface/60 to-surface/40 p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                Join the community
              </p>
              <p className="mt-2 text-lg font-black text-foreground">
                QC tips, drops, and buyer chat daily
              </p>
              <p className="mt-2 max-w-md text-sm text-muted">
                Get help from real buyers on Discord and Telegram before you
                ship your haul.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={SOCIAL_LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#5865F2] px-6 py-3 text-sm font-black text-white hover:opacity-90"
              >
                Discord
              </a>
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-black text-foreground hover:border-accent/40"
              >
                Telegram {TELEGRAM_HANDLE}
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-lg font-black text-foreground">{SITE_NAME}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A curated discovery platform for LitBuy finds — verified links,
              real QC references, and daily product drops.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <CommunityLinks variant="footer" />
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted hover:border-accent/40 hover:text-accent"
              >
                TikTok
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted hover:border-accent/40 hover:text-accent"
              >
                Instagram
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Categories
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={category.href} className="text-foreground/80 hover:text-accent">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Brands
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="text-foreground/80 hover:text-accent"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/brands" className="font-bold text-accent hover:underline">
                  All brands →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Guides & trust
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {GUIDE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground/80 hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              {TRUST_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground/80 hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/trending" className="text-foreground/80 hover:text-accent">
                  Trending finds
                </Link>
              </li>
              <li>
                <Link href={LITBUY_SIGNUP_URL} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-accent">
                  {LITBUY_OFFER_HEADLINE}
                </Link>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground/80 hover:text-accent">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl">
            Disclaimer: LitBuy Finds is an independent discovery catalog. Product
            images and links are sourced from public spreadsheets and affiliate
            programs. We do not sell products directly. Always verify QC photos and
            seller details before purchasing.
          </p>
          <p className="shrink-0">© {new Date().getFullYear()} {SITE_NAME}</p>
        </div>
      </div>
    </footer>
  );
}
