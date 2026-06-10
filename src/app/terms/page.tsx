import { getStaticPageMetadata, StaticPageView } from "@/lib/create-static-page";

export const metadata = getStaticPageMetadata("terms")!;

export default function TermsPage() {
  return <StaticPageView slug="terms" />;
}
