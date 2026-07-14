import { createDiscordAgentLandingPage } from "@/lib/discord-agent-landing-page";

const { generateMetadata, Page } = createDiscordAgentLandingPage("discord-kakobuy");

export { generateMetadata };
export default Page;
