import { createAgentLandingPage } from "@/lib/agent-landing-page";

const { generateMetadata, Page } = createAgentLandingPage("hipobuy-finds");

export { generateMetadata };
export default Page;
