import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("litbuy-spreadsheet-2026")!;

export default function Page() {
  return <AuthorityPageView slug="litbuy-spreadsheet-2026" />;
}
