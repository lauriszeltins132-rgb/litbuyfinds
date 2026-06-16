import { createBestOfPage } from "@/lib/best-of-page";

const { generateMetadata, Page } = createBestOfPage("best-finds-this-month");

export { generateMetadata };
export default Page;
