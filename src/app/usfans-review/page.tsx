import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("usfans-review")!;

export default function Page() {
  return <AuthorityPageView slug="usfans-review" />;
}
