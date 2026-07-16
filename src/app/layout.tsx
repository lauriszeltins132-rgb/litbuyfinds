import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Plus_Jakarta_Sans } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import FooterSignupStrip from "@/components/conversion/FooterSignupStrip";
import DeferredClientChrome from "@/components/DeferredClientChrome";
import DeferredSpeedInsights from "@/components/DeferredSpeedInsights";
import MobileDock from "@/components/MobileDock";
import PreferencesBar from "@/components/PreferencesBar";
import AnimatedBackground from "@/components/AnimatedBackground";
import AnalyticsBoot from "@/components/AnalyticsBoot";
import JsonLd from "@/components/JsonLd";
import { ConversionProvider } from "@/context/ConversionContext";
import { AgentModalProvider } from "@/context/AgentModalContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { CouponProvider } from "@/context/CouponContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import {
  HOMEPAGE_TITLE,
  PROMO_BANNER_ALT,
  PROMO_OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_DESCRIPTION,
  SITE_OG_TITLE,
} from "@/lib/constants";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
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
    "weidian finds",
    "taobao finds",
    "qc approved finds",
    "litbuy spreadsheet",
    "sneaker finds",
    "fashion finds",
  ],
  metadataBase: new URL("https://litbuyfinds.io"),
  openGraph: {
    title: SITE_OG_TITLE,
    description: SITE_OG_DESCRIPTION,
    url: "https://litbuyfinds.io",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: PROMO_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: PROMO_BANNER_ALT,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_OG_TITLE,
    description: SITE_OG_DESCRIPTION,
    images: [PROMO_OG_IMAGE_URL],
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
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/icon-source.svg",
        color: "#C8761A",
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
                <ConversionProvider>
                  <AgentModalProvider>
                  <AnimatedBackground />
                  <JsonLd />
                  <AnalyticsBoot />
                  <PreferencesBar />
                  <SiteHeader />
                  <main className="site-main flex-1">{children}</main>
                  <FooterSignupStrip />
                  <Footer />
                  <DeferredClientChrome />
                  <MobileDock />
                  <Analytics />
                  <DeferredSpeedInsights />
                  </AgentModalProvider>
                </ConversionProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CouponProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
