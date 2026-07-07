import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("agent-spreadsheet");

export { generateMetadata };
export default Page;
