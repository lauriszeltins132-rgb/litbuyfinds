import { AuthorityPageView, getAuthorityPageMetadata } from "@/lib/create-authority-page";

export const metadata = getAuthorityPageMetadata("how-to-buy-reps")!;

export default function Page() {
  return <AuthorityPageView slug="how-to-buy-reps" />;
}
