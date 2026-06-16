import { createSeoLandingPage } from "@/lib/seo-landing-page";

const { generateMetadata, Page } = createSeoLandingPage("litbuy-products");

export { generateMetadata };
export default Page;
