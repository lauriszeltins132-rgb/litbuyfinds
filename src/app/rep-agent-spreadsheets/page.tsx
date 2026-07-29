import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("rep-agent-spreadsheets");

export { generateMetadata };
export default Page;
