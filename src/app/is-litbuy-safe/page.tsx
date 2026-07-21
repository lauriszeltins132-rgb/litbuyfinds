import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("is-litbuy-safe")!;

export default function Page() {
  return <AuthorityPageView slug="is-litbuy-safe" />;
}
