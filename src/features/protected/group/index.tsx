"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserGroup } from "@/hooks/useUserGroup";
import { CreateGroupDialog } from "./create-group-dialog";
import { JoinGroupDialog } from "./join-group-dialog";
import { LeaveGroupDialog } from "./leave-group-dialog";
export function GroupSelection() {
  const { group, isLoading, refetch } = useUserGroup();

  if (isLoading) {
    return (
      <Card className="bg-black/20 border-none">
        <CardContent className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {group === undefined ? (
        <Card className="bg-black/20 border-none">
          <CardHeader>
            <CardTitle className="text-xl text-center text-[#E2E4FF]">Welcome to Kairos!</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <CreateGroupDialog onGroupCreated={refetch} variant="welcome" />
            <JoinGroupDialog onGroupJoined={refetch} variant="welcome" />
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-between items-center w-full px-4 py-4 3xl:py-8">
          <h2 className="text-2xl font-bold text-center text-[#E2E4FF] font-space-grotesk">Welcome to {group.name}!</h2>
          <LeaveGroupDialog onLeaveGroup={refetch} group={group} />
        </div>
      )}
    </div>
  );
}
