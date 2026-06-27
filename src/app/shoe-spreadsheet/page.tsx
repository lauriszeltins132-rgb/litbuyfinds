import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("shoe-spreadsheet");

export { generateMetadata };
export default Page;
