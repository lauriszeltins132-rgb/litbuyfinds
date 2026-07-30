import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("latest-finds");

export { generateMetadata };
export default Page;
