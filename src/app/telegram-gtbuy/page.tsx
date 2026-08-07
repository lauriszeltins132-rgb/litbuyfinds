import { createTelegramAgentLandingPage } from "@/lib/telegram-agent-landing-page";

const { generateMetadata, Page } = createTelegramAgentLandingPage("telegram-gtbuy");

export { generateMetadata };
export default Page;
