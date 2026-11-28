import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("litbuy-links")!;

export default function Page() {
  return <AuthorityPageView slug="litbuy-links" />;
}
