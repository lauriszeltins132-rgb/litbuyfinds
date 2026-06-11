import { getStaticPageMetadata, StaticPageView } from "@/lib/create-static-page";
import SchemaScript from "@/components/SchemaScript";
import { STATIC_PAGES } from "@/lib/static-pages";
import { buildAboutPageSchema } from "@/lib/schema";

export const metadata = getStaticPageMetadata("about")!;

export default function AboutPage() {
  const page = STATIC_PAGES.about;

  return (
    <>
      <SchemaScript
        data={buildAboutPageSchema({
          description: page.metaDescription,
          path: page.path,
        })}
      />
      <StaticPageView slug="about" />
    </>
  );
}
