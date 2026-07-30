import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const page = createSeoLandingConfigPage("jordan-spreadsheet");

export const { generateMetadata, revalidate } = page;
export default page.Page;
