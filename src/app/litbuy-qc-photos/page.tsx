import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("litbuy-qc-photos")!;

export default function Page() {
  return <AuthorityPageView slug="litbuy-qc-photos" />;
}
