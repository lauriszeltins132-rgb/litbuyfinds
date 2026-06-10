import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Plus_Jakarta_Sans } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import CouponModal from "@/components/CouponModal";
import FloatingCouponButton from "@/components/FloatingCouponButton";
import PreferencesBar from "@/components/PreferencesBar";
import AnimatedBackground from "@/components/AnimatedBackground";
import JsonLd from "@/components/JsonLd";
import MobileSearchBar from "@/components/MobileSearchBar";
import { WishlistProvider } from "@/context/WishlistContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { CouponProvider } from "@/context/CouponContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Premium LitBuy Product Discovery`,
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
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "https://litbuyfinds.io",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  verification: {
    google: "Wmr77o-ae2-2UeCPHTZoscpe_i956ztnehHMhh7jG2g",
  },
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
                <PromoBanner />
                <PreferencesBar />
                <SiteHeader />
                <main className="flex-1 pb-20 sm:pb-0">{children}</main>
                <Footer />
                <CouponModal />
                <FloatingCouponButton />
                <MobileSearchBar />
                <Analytics />
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CouponProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
