import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("how-to-save-on-shipping")!;

export default function Page() {
  return <AuthorityPageView slug="how-to-save-on-shipping" />;
}
