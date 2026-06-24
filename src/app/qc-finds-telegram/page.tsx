import { createTelegramSeoPage } from "@/lib/telegram-seo-page";

const { generateMetadata, Page } = createTelegramSeoPage("qc-finds-telegram");

export { generateMetadata };
export default Page;
