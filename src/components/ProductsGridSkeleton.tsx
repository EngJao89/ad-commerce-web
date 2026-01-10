import type { ProductsGridSkeletonProps } from "@/@types/products";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

export default function ProductsGridSkeleton({ count = 8 }: Readonly<ProductsGridSkeletonProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}
