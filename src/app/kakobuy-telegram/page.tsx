import { createTelegramSeoPage } from "@/lib/telegram-seo-page";

const { generateMetadata, Page } = createTelegramSeoPage("kakobuy-telegram");

export { generateMetadata };
export default Page;
