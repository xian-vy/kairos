"use client";
import { Card, CardContent } from "@/components/ui/card";
import { LeaveGroupDialog } from "./leave-group-dialog";
import { useGroupStore } from "@/stores/groupStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useBossDataStore } from "@/stores/bossDataStore";
import { useGroupMembersStore } from "@/stores/groupMembersStore";
import { useBossTimersStore } from "@/stores/bossTimersStore";
import useRealtimeMembers from "@/hooks/useRealtimeMembers";
import { useAdBlockDetector } from "@/hooks/useAdBlockDetector";
import { AdBlockerDialog } from "@/components/add-blocker-dialog";
export function GroupSelection() {
  const { group, isLoading: groupLoading,  userData , fetchUserGroup} = useGroupStore();
  const { refreshBossData} = useBossDataStore();
  const { fetchGroupMembers, loading : membersLoading } = useGroupMembersStore();
  const { fetchTimers } = useBossTimersStore();
  const isAdBlockEnabled = useAdBlockDetector()

  useRealtimeMembers();
  useEffect(() => {
    fetchUserGroup().then(() => {
      refreshBossData();
      fetchGroupMembers();
      fetchTimers();
  });
  }, []);

  if (groupLoading || membersLoading) {
    return (
      <Card className=" bg-[#0D0F23]/30 backdrop-blur-sm border-none">
        <CardContent className="flex justify-center items-center h-[80px] lg:h-[130px]">
          <Skeleton className="h-10 w-[100px] rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 relative">
      <AdBlockerDialog isOpen={isAdBlockEnabled} />

      {group && userData?.status !== "pending" && (
        <div className="flex flex-col items-center w-full px-0 sm:px-4 py-4 3xl:py-8">
          <h2 className="text-base md:text-lg font-bold text-center text-[#E2E4FF] font-space-grotesk">
             <span className="text-base md:text-lg  text-blue-500 ">
             {group.name}</span> 
          </h2>
          <LeaveGroupDialog group={group} />
        </div>
      )}
    </div>
  );
}
