import Link from "next/link";
import { PackageX } from "lucide-react";
import type { EmptyStateProps } from "@/@types/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmptyState({
  title = "No products found",
  message = "We couldn't find any products matching your criteria. Try adjusting your filters.",
  actionLabel = "View all products",
  actionHref,
}: Readonly<EmptyStateProps>) {
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <PackageX className="h-16 w-16 text-zinc-500" />
          </div>
          <CardTitle className="text-xl text-white text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-400 text-center">{message}</p>
          {actionHref && (
            <div className="flex justify-center">
              <Button asChild variant="default" className="w-full sm:w-auto">
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
