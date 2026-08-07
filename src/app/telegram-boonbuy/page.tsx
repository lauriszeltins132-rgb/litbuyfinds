import { createTelegramAgentLandingPage } from "@/lib/telegram-agent-landing-page";

const { generateMetadata, Page } = createTelegramAgentLandingPage("telegram-boonbuy");

export { generateMetadata };
export default Page;
