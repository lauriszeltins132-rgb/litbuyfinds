import { createAgentLandingPage } from "@/lib/agent-landing-page";

const { generateMetadata, Page } = createAgentLandingPage("boonbuy-finds");

export { generateMetadata };
export default Page;
