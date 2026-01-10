import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <CardHeader className="p-0 relative">
        <Skeleton className="w-full h-64" />
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 pt-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-16 mt-2" />
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-2">
        <Skeleton className="h-8 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
}
