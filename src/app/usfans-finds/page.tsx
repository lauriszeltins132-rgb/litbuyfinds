import { createAgentLandingPage } from "@/lib/agent-landing-page";

const { generateMetadata, Page } = createAgentLandingPage("usfans-finds");

export { generateMetadata };
export default Page;
