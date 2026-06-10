import { getStaticPageMetadata, StaticPageView } from "@/lib/create-static-page";

export const metadata = getStaticPageMetadata("privacy-policy")!;

export default function PrivacyPolicyPage() {
  return <StaticPageView slug="privacy-policy" />;
}
