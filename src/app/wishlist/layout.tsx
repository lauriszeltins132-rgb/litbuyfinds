import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Wishlist",
    description: "Your saved LitBuy finds — stored locally in your browser.",
    path: "/wishlist",
  }),
  robots: { index: false, follow: false },
};

export default function WishlistLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
