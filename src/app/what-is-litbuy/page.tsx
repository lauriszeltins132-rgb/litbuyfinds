import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("what-is-litbuy")!;

export default function Page() {
  return <AuthorityPageView slug="what-is-litbuy" />;
}
