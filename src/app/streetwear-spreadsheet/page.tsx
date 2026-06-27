import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("streetwear-spreadsheet");

export { generateMetadata };
export default Page;
