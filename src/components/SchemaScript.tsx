import { serializeJsonLd } from "@/lib/security/safe-json-ld";

type SchemaScriptProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export default function SchemaScript({ data }: SchemaScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
