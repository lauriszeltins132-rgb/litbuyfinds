import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const page = createSeoLandingConfigPage("streetwear-spreadsheet");

export const { generateMetadata, revalidate } = page;
export default page.Page;
