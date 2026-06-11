import { createSeoListPage } from "@/lib/seo-list-page";

const { generateMetadata, Page } = createSeoListPage("top-products-under-100");

export { generateMetadata };
export default Page;
