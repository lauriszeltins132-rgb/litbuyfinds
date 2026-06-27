import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("nike-spreadsheet");

export { generateMetadata };
export default Page;
