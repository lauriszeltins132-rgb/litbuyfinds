import { createTelegramAgentLandingPage } from "@/lib/telegram-agent-landing-page";

const { generateMetadata, Page } = createTelegramAgentLandingPage("telegram-litbuy");

export { generateMetadata };
export default Page;
