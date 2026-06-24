import { createTelegramSeoPage } from "@/lib/telegram-seo-page";

const { generateMetadata, Page } = createTelegramSeoPage("telegram");

export { generateMetadata };
export default Page;
