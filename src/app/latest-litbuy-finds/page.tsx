import { createSeoLandingPage } from "@/lib/seo-landing-page";

const { generateMetadata, Page } = createSeoLandingPage("latest-litbuy-finds");

export { generateMetadata };
export default Page;
