import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("mulebuy-spreadsheet");

export { generateMetadata };
export default Page;
