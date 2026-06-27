import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("acbuy-spreadsheet");

export { generateMetadata };
export default Page;
