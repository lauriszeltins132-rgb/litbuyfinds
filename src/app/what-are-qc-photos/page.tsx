import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("what-are-qc-photos")!;

export default function Page() {
  return <AuthorityPageView slug="what-are-qc-photos" />;
}
