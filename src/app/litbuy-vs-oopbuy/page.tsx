import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("litbuy-vs-oopbuy");

export { generateMetadata };
export default Page;
