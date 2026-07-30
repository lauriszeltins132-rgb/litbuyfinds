import ContentFreshness from "@/components/ContentFreshness";

type DataFreshnessProps = {
  variant?: "inline" | "block";
  label?: string;
};

/** @deprecated Use ContentFreshness with variant="catalog-sync" */
export default function DataFreshness({
  variant = "inline",
}: DataFreshnessProps) {
  return (
    <ContentFreshness
      variant="catalog-sync"
      display={variant === "block" ? "block" : "inline"}
    />
  );
}
