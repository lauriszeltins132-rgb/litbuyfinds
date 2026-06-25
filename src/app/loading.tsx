import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function HomeLoading() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="panel-shell mx-auto max-w-7xl rounded-[32px] border border-border-strong bg-panel p-5 sm:p-7">
        <ProductGridSkeleton count={12} />
      </div>
    </section>
  );
}
