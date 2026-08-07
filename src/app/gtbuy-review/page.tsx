import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("gtbuy-review")!;

export default function Page() {
  return <AuthorityPageView slug="gtbuy-review" />;
}
