import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("is-litbuy-legit")!;

export default function Page() {
  return <AuthorityPageView slug="is-litbuy-legit" />;
}
