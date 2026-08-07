import { createDiscordAgentLandingPage } from "@/lib/discord-agent-landing-page";

const { generateMetadata, Page } = createDiscordAgentLandingPage("discord-boonbuy");

export { generateMetadata };
export default Page;
