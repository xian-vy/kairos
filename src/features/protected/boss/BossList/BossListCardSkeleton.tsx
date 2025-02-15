import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BossListCardSkeleton() {
  return (
    <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {/* Boss name and kill count */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 bg-[#1F2937] rounded-full" /> {/* Skull icon */}
            <Skeleton className="h-4 w-[100px] bg-[#1F2937]" /> {/* Boss name */}
          </div>

          {/* Badge and edit button */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-[40px] bg-[#1F2937] rounded-full" /> {/* Hours badge */}
            <Skeleton className="h-6 w-6 bg-[#1F2937]" /> {/* Edit button */}
          </div>
        </div>

        {/* Description */}
        <Skeleton className="h-4 w-[200px] bg-[#1F2937] mt-2" />
      </CardHeader>

      <CardContent>
        {/* Location list */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 bg-[#1F2937]" /> {/* Location icon */}
              <Skeleton className="h-3.5 w-[140px] bg-[#1F2937]" /> {/* Location text */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
