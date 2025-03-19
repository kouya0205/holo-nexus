import { Skeleton } from "@mui/material";
import { CnSkeleton } from "./ui/skeleton";

import { Card } from "./ui/card";
import Image from "next/image";

export function SkeletonCard({ type }: { type: "scroll" | "pageNation" | "card" }) {
  switch (type) {
    case "scroll":
      return (
        <div className="flex flex-col space-y-3 rounded-lg">
          <Skeleton variant="rectangular" width={238} height={119} />
          <div>
            <Skeleton />
            <div className="flex gap-2 items-center">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex flex-col flex-1">
                <Skeleton width="40%" />
                <Skeleton width="60%" />
              </div>
            </div>
          </div>
        </div>
      );
    case "pageNation":
      return (
        <Card>
          <figure className="shrink-0">
            <div className="overflow-hidden">
              <Skeleton variant="rectangular" width={300} height={150} />
            </div>
            <figcaption className="p-2 text-xs text-muted-foreground">
              <div className="h-full min-h-10">
                <Skeleton />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex flex-col flex-1">
                  <Skeleton width="40%" />
                  <Skeleton width="60%" />
                </div>
              </div>
            </figcaption>
          </figure>
        </Card>
      );
    case "card":
      return (
        <figure className="shrink-0 w-full">
          <CnSkeleton className="aspect-[0.71/1] w-full rounded-lg object-cover shadow-lg ease-in-out" />
        </figure>
      );
    default:
      return null;
  }
}
