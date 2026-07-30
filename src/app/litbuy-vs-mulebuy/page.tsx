import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const page = createSeoLandingConfigPage("litbuy-vs-mulebuy");

export const { generateMetadata, revalidate } = page;
export default page.Page;
