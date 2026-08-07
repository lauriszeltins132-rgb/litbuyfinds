import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("hipobuy-review")!;

export default function Page() {
  return <AuthorityPageView slug="hipobuy-review" />;
}
