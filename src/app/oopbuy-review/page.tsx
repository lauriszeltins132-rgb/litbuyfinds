import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("oopbuy-review")!;

export default function Page() {
  return <AuthorityPageView slug="oopbuy-review" />;
}
