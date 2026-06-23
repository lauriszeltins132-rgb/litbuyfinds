import { createAgentLandingPage } from "@/lib/agent-landing-page";

const { generateMetadata, Page } = createAgentLandingPage("acbuy-finds");

export { generateMetadata };
export default Page;
