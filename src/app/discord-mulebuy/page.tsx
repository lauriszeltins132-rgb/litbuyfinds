import { createDiscordAgentLandingPage } from "@/lib/discord-agent-landing-page";

const { generateMetadata, Page } = createDiscordAgentLandingPage("discord-mulebuy");

export { generateMetadata };
export default Page;
