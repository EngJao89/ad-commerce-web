import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <Skeleton className="w-full h-[500px] lg:h-[600px] rounded-lg" />

        {/* Content Skeleton */}
        <div className="flex flex-col gap-6">
          <div>
            <Skeleton className="h-6 w-24 rounded-full mb-4" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <Separator className="bg-zinc-700" />

          <div>
            <Skeleton className="h-7 w-16 mb-2" />
            <Skeleton className="h-12 w-32" />
          </div>

          <Separator className="bg-zinc-700" />

          <div>
            <Skeleton className="h-6 w-24 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>

          <Separator className="bg-zinc-700" />

          <div className="flex flex-col gap-4">
            <Skeleton className="h-5 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
