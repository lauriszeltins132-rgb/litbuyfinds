import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const page = createSeoLandingConfigPage("jacket-finds");

export const { generateMetadata, revalidate } = page;
export default page.Page;
