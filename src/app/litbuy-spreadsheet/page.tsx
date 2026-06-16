import { createSeoLandingPage } from "@/lib/seo-landing-page";

const { generateMetadata, Page } = createSeoLandingPage("litbuy-spreadsheet");

export { generateMetadata };
export default Page;
