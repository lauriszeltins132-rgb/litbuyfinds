import { getStaticPageMetadata, StaticPageView } from "@/lib/create-static-page";

export const metadata = getStaticPageMetadata("about")!;

export default function AboutPage() {
  return <StaticPageView slug="about" />;
}
