import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("kakobuy-spreadsheet");

export { generateMetadata };
export default Page;
