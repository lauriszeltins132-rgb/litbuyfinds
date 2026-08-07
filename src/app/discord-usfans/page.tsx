import { createDiscordAgentLandingPage } from "@/lib/discord-agent-landing-page";

const { generateMetadata, Page } = createDiscordAgentLandingPage("discord-usfans");

export { generateMetadata };
export default Page;
