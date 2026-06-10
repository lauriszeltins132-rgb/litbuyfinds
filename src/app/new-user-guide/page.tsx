import { getStaticPageMetadata, StaticPageView } from "@/lib/create-static-page";

export const metadata = getStaticPageMetadata("new-user-guide")!;

export default function NewUserGuidePage() {
  return <StaticPageView slug="new-user-guide" />;
}
