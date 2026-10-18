import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("best-litbuy-spreadsheet")!;

export default function Page() {
  return <AuthorityPageView slug="best-litbuy-spreadsheet" />;
}
