import { getStaticPageMetadata, StaticPageView } from "@/lib/create-static-page";

export const metadata = getStaticPageMetadata("best-budget-finds")!;

export default function BestBudgetFindsPage() {
  return <StaticPageView slug="best-budget-finds" />;
}
