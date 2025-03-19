import { cn } from "@/lib/utils";

function CnSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { CnSkeleton };
