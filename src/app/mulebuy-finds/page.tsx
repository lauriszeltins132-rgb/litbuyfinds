import { createAgentLandingPage } from "@/lib/agent-landing-page";

const { generateMetadata, Page } = createAgentLandingPage("mulebuy-finds");

export { generateMetadata };
export default Page;
