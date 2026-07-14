import { createDiscordAgentLandingPage } from "@/lib/discord-agent-landing-page";

const { generateMetadata, Page } = createDiscordAgentLandingPage("discord-hipobuy");

export { generateMetadata };
export default Page;
