import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("boonbuy-review")!;

export default function Page() {
  return <AuthorityPageView slug="boonbuy-review" />;
}
