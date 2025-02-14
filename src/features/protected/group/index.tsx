"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useUserGroup } from "@/hooks/useUserGroup";
import { LeaveGroupDialog } from "./leave-group-dialog";


export function GroupSelection() {
    const { group, isLoading: groupLoading, refetch , userData } = useUserGroup();

  if (groupLoading ) {
    return (
      <Card className="bg-black/20 border-none">
        <CardContent className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 relative">
      {group && userData?.status !== 'pending' && (
        <div className="flex justify-between items-center w-full px-4 py-4 3xl:py-8">
    
            <h2 className="text-2xl font-bold text-center text-[#E2E4FF] font-space-grotesk">
              Welcome to {group.name}!
            </h2>
          
          <LeaveGroupDialog onLeaveGroup={refetch} group={group} />
        </div>
      )}
    </div>
  );
}
