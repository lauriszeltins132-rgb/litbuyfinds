import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("litbuy-discord")!;

export default function LitbuyDiscordPage() {
  return <AuthorityPageView slug="litbuy-discord" />;
}
