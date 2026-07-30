import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const page = createSeoLandingConfigPage("trending-this-week");

export const { generateMetadata, revalidate } = page;
export default page.Page;
