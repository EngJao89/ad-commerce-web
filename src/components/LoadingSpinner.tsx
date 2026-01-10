import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
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
