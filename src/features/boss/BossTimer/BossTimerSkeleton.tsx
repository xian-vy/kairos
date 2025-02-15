import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BossTimerSkeleton() {
  return (
    <Card className="w-full bg-transparent">
      <CardContent className="p-4 bg-transparent">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BossTimerListSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 justify-end">
        <Skeleton className="h-7 w-[50px]" />
        <Skeleton className="h-7 w-[50px]" />
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <BossTimerSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
