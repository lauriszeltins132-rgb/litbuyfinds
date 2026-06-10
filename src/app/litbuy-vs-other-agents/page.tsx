import { getStaticPageMetadata, StaticPageView } from "@/lib/create-static-page";

export const metadata = getStaticPageMetadata("litbuy-vs-other-agents")!;

export default function LitbuyVsOtherAgentsPage() {
  return <StaticPageView slug="litbuy-vs-other-agents" />;
}
