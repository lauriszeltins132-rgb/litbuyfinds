import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("kakobuy-review")!;

export default function Page() {
  return <AuthorityPageView slug="kakobuy-review" />;
}
