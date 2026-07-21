import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("how-to-use-litbuy")!;

export default function Page() {
  return <AuthorityPageView slug="how-to-use-litbuy" />;
}
