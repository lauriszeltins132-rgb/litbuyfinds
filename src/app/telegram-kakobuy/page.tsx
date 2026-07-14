import { createTelegramAgentLandingPage } from "@/lib/telegram-agent-landing-page";

const { generateMetadata, Page } = createTelegramAgentLandingPage("telegram-kakobuy");

export { generateMetadata };
export default Page;
