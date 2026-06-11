import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Plus_Jakarta_Sans } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import CouponModal from "@/components/CouponModal";
import MobileQuickNav from "@/components/MobileQuickNav";
import MobileStickySignup from "@/components/MobileStickySignup";
import PreferencesBar from "@/components/PreferencesBar";
import AnimatedBackground from "@/components/AnimatedBackground";
import AnalyticsBoot from "@/components/AnalyticsBoot";
import JsonLd from "@/components/JsonLd";
import MobileSearchBar from "@/components/MobileSearchBar";
import { WishlistProvider } from "@/context/WishlistContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { CouponProvider } from "@/context/CouponContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import {
  HOMEPAGE_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_DESCRIPTION,
} from "@/lib/constants";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: HOMEPAGE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "litbuy finds",
    "litbuy spreadsheet",
    "sneaker finds",
    "fashion finds",
    "weidian finds",
    "product discovery",
  ],
  metadataBase: new URL("https://litbuyfinds.io"),
  openGraph: {
    title: HOMEPAGE_TITLE,
    description: SITE_OG_DESCRIPTION,
    url: "https://litbuyfinds.io",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOMEPAGE_TITLE,
    description: SITE_OG_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  verification: {
    google: "Wmr77o-ae2-2UeCPHTZoscpe_i956ztnehHMhh7jG2g",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/icon-source.svg",
        color: "#D4FF3C",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <PreferencesProvider>
          <CouponProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <AnimatedBackground />
                <JsonLd />
                <AnalyticsBoot />
                <PreferencesBar />
                <SiteHeader />
                <main className="flex-1 pb-20 sm:pb-0">{children}</main>
                <Footer />
                <CouponModal />
                <MobileSearchBar />
                <MobileStickySignup />
                <MobileQuickNav />
                <Analytics />
                <SpeedInsights />
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CouponProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
