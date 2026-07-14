import { createTelegramAgentLandingPage } from "@/lib/telegram-agent-landing-page";

const { generateMetadata, Page } = createTelegramAgentLandingPage("telegram-mulebuy");

export { generateMetadata };
export default Page;
