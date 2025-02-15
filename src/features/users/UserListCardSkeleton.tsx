import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserListCardSkeleton() {
  return (
    <Card className="w-full bg-transparent">
      <CardContent className="p-4 bg-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserListSkeleton() {
  return (
    <div className="space-y-6 px-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#E2E4FF]">Current Members</h2>
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <UserListCardSkeleton key={index} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#E2E4FF]">Pending Members</h2>
        <div className="space-y-2">
          {Array.from({ length: 1 }).map((_, index) => (
            <UserListCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
} 