import { getStaticPageMetadata, StaticPageView } from "@/lib/create-static-page";

export const metadata = getStaticPageMetadata("how-to-buy")!;

export default function HowToBuyPage() {
  return <StaticPageView slug="how-to-buy" />;
}
