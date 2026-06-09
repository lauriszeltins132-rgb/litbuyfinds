import Link from "next/link";
import {
  CONTACT_EMAIL,
  LITBUY_OFFER_HEADLINE,
  LITBUY_SIGNUP_URL,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories, getAllProducts } from "@/lib/products";
import CommunityLinks from "./CommunityLinks";

export default function Footer() {
  const categories = getCategories().filter((c) => c.group === "category");
  const brands = getBrandsFromProducts(getAllProducts()).slice(0, 8);

  return (
    <footer className="mt-auto border-t border-border bg-surface/50 px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
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
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/latest" className="text-foreground/80 hover:text-accent">
                  Latest Finds
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-foreground/80 hover:text-accent">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-foreground/80 hover:text-accent">
                  Best Under $30
                </Link>
              </li>
              <li>
                <Link href={LITBUY_SIGNUP_URL} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-accent">
                  {LITBUY_OFFER_HEADLINE}
                </Link>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground/80 hover:text-accent">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted">
          <p>
            Disclaimer: LitBuy Finds is an independent discovery catalog. Product
            images and links are sourced from public spreadsheets and affiliate
            programs. We do not sell products directly. Always verify QC photos and
            seller details before purchasing.
          </p>
          <p className="mt-3">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
