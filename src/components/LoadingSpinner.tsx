import { cn } from "@/lib/utils";
import type { LoadingSpinnerProps } from "@/@types/loagind";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingSpinner({ size = "md", className }: Readonly<LoadingSpinnerProps>) {
  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Spinner className={cn(sizeClasses[size], "text-zinc-400")} />
    </div>
  );
}
