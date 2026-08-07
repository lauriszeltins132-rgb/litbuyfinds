import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("hipobuy-spreadsheet");

export { generateMetadata };
export default Page;
