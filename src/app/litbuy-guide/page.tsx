import { createSeoLandingPage } from "@/lib/seo-landing-page";

const { generateMetadata, Page } = createSeoLandingPage("litbuy-guide");

export { generateMetadata };
export default Page;
