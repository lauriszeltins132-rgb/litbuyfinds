import { createTelegramSeoPage } from "@/lib/telegram-seo-page";

const { generateMetadata, Page } = createTelegramSeoPage("agent-finds-telegram");

export { generateMetadata };
export default Page;
