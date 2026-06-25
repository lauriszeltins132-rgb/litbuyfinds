import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function ProductLoading() {
  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="skeleton h-4 w-48 rounded-full" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="skeleton aspect-square w-full rounded-3xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded-xl" />
            <div className="skeleton h-6 w-1/3 rounded-lg" />
            <div className="skeleton h-24 w-full rounded-2xl" />
            <div className="skeleton h-12 w-full rounded-full" />
          </div>
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
