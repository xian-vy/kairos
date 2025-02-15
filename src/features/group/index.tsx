"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LeaveGroupDialog } from "./leave-group-dialog";
import { User } from "@/types/database.types";
import { Group } from "@/types/group";

type GroupSelectionProps = {
  group: Group;
  userData: User | undefined;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export function GroupSelection({ group, isLoading: groupLoading, refetch, userData }: GroupSelectionProps) {
  if (groupLoading) {
    return (
      <Card className="bg-black/20 border-none">
        <CardContent className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 relative">
      {group && userData?.status !== "pending" && (
        <div className="flex justify-between items-center w-full px-4 py-4 3xl:py-8 border-b border-gray-800">
          <h2 className="text-base md:text-lg 3xl:text-xl   font-bold text-center text-[#E2E4FF] font-space-grotesk">
            Welcome to {group.name}!
          </h2>

          <LeaveGroupDialog onLeaveGroup={refetch} group={group} />
        </div>
      )}
    </div>
  );
}
