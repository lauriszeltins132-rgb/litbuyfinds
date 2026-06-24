import { createTelegramSeoPage } from "@/lib/telegram-seo-page";

const { generateMetadata, Page } = createTelegramSeoPage("litbuy-telegram");

export { generateMetadata };
export default Page;
