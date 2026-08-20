import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("litbuy-coupon-codes")!;

export default function Page() {
  return <AuthorityPageView slug="litbuy-coupon-codes" />;
}
