import ProductsGridSkeleton from "@/components/ProductsGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-6 w-64" />
      </div>
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-5 w-32 ml-auto" />
        </div>
      </div>
      <ProductsGridSkeleton count={8} />
    </div>
  );
}
