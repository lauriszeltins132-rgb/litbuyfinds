import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("jordan-spreadsheet");

export { generateMetadata };
export default Page;
