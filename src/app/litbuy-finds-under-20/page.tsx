import { createSeoLandingPage } from "@/lib/seo-landing-page";

const { generateMetadata, Page } = createSeoLandingPage("litbuy-finds-under-20");

export { generateMetadata };
export default Page;
