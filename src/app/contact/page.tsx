import { getStaticPageMetadata, StaticPageView } from "@/lib/create-static-page";

export const metadata = getStaticPageMetadata("contact")!;

export default function ContactPage() {
  return <StaticPageView slug="contact" />;
}
