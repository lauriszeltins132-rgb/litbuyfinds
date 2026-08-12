import AiHeroEntry from "@/components/ai/AiHeroEntry";
import DiscoveryQuickLinks from "@/components/DiscoveryQuickLinks";
import TrustStrip from "@/components/TrustStrip";

export default function HomepageDiscoveryTools() {
  return (
    <section className="border-b border-border/40 px-4 py-5 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[700px]">
        <AiHeroEntry />
      </div>
      <DiscoveryQuickLinks />
      <div className="mx-auto mt-5 max-w-7xl sm:mt-6">
        <TrustStrip compact />
      </div>
    </section>
  );
}
