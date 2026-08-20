import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("litbuy-free-shipping-coupons")!;

export default function Page() {
  return <AuthorityPageView slug="litbuy-free-shipping-coupons" />;
}
