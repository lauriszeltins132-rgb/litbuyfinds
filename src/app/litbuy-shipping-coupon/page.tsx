import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("litbuy-shipping-coupon")!;

export default function Page() {
  return <AuthorityPageView slug="litbuy-shipping-coupon" />;
}
