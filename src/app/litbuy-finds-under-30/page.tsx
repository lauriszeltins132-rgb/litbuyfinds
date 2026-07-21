import { createSeoLandingPage } from "@/lib/seo-landing-page";

const { generateMetadata, Page } = createSeoLandingPage("litbuy-finds-under-30");

export { generateMetadata };
export default Page;
