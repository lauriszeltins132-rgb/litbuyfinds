import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const page = createSeoLandingConfigPage("rep-agent-spreadsheets");

export const { generateMetadata, revalidate } = page;
export default page.Page;
