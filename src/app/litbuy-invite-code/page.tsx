import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("litbuy-invite-code")!;

export default function Page() {
  return <AuthorityPageView slug="litbuy-invite-code" />;
}
