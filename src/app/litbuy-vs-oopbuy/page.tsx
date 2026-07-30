import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const page = createSeoLandingConfigPage("litbuy-vs-oopbuy");

export const { generateMetadata, revalidate } = page;
export default page.Page;
