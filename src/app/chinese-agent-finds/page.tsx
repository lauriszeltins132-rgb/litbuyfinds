import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("chinese-agent-finds");

export { generateMetadata };
export default Page;
