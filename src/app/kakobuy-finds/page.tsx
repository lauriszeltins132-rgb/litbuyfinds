import { createAgentLandingPage } from "@/lib/agent-landing-page";

const { generateMetadata, Page } = createAgentLandingPage("kakobuy-finds");

export { generateMetadata };
export default Page;
