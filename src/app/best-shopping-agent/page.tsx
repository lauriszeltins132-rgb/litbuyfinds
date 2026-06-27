import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("best-shopping-agent");

export { generateMetadata };
export default Page;
