import { createSeoListPage } from "@/lib/seo-list-page";

const { generateMetadata, Page } = createSeoListPage("top-products-under-50");

export { generateMetadata };
export default Page;
