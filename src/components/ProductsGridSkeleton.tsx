import ProductCardSkeleton from "@/components/ProductCardSkeleton";

interface ProductsGridSkeletonProps {
  count?: number;
}

export default function ProductsGridSkeleton({ count = 8 }: ProductsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
