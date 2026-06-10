import { getStaticPageMetadata, StaticPageView } from "@/lib/create-static-page";

export const metadata = getStaticPageMetadata("best-rep-sneakers")!;

export default function BestRepSneakersPage() {
  return <StaticPageView slug="best-rep-sneakers" />;
}
