"use client";

import Link from "next/link";
import {
  CONTACT_EMAIL,
  LITBUY_OFFER_HEADLINE,
  SITE_NAME,
} from "@/lib/constants";
import RegisterLink from "./RegisterLink";
import CommunityLinks from "./CommunityLinks";
import TrustStrip from "./TrustStrip";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories, getAllProducts } from "@/lib/products";

const GUIDE_LINKS = [
  { href: "/guides", label: "All guides" },
  { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
  { href: "/guides/how-to-order", label: "How to order" },
  { href: "/how-to-buy", label: "How to buy" },
  { href: "/recently-added", label: "Recently added" },
  { href: "/best-rep-sneakers", label: "Best rep sneakers" },
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
    <footer className="relative mt-auto border-t border-border bg-[#0a0a0c] px-4 py-16 sm:px-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl">
        <TrustStrip compact />
        <div className="mt-8 overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-[#121214] to-[#0d1210] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Community
              </p>
              <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
                Join buyers on Discord & Telegram
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                QC checks, shipping advice, and daily finds from real buyers.
                The fastest way to get help before you ship your haul.
              </p>
            </div>
            <CommunityLinks
              variant="cta"
              location="footer_cta"
              showTelegramHandle
            />
          </div>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-xl font-black text-foreground">{SITE_NAME}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Curated LitBuy discovery — verified links, QC references, and
              fresh catalog updates across fashion, sneakers, and accessories.
            </p>
            <p className="mt-4 text-xs text-muted">
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-accent">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Categories
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={category.href} className="text-foreground/75 transition hover:text-accent">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Top brands
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="text-foreground/75 transition hover:text-accent"
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
            <ul className="mt-4 space-y-2.5 text-sm">
              {GUIDE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground/75 transition hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              {TRUST_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground/75 transition hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/trending" className="text-foreground/75 transition hover:text-accent">
                  Trending finds
                </Link>
              </li>
              <li>
                <RegisterLink
                  location="footer"
                  className="font-bold text-accent hover:underline"
                >
                  {LITBUY_OFFER_HEADLINE}
                </RegisterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/80 pt-8 text-xs leading-relaxed text-muted sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl">
            LitBuy Finds is an independent discovery catalog. We do not sell
            products directly. Images and links are sourced from public
            spreadsheets and affiliate programs. Always verify QC and seller
            details before purchasing.
          </p>
          <p className="shrink-0 text-foreground/50">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
