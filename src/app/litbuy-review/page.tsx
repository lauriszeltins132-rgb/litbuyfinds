import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("litbuy-review")!;

export default function Page() {
  return <AuthorityPageView slug="litbuy-review" />;
}
