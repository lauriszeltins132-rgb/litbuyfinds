import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("litbuy-vs-kakobuy");

export { generateMetadata };
export default Page;
