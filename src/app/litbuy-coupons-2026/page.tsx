import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("litbuy-coupons-2026")!;

export default function Page() {
  return <AuthorityPageView slug="litbuy-coupons-2026" />;
}
