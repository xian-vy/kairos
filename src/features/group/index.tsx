"use client";
import { Card, CardContent } from "@/components/ui/card";
import { LeaveGroupDialog } from "./leave-group-dialog";
import { useGroupStore } from "@/stores/groupStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useBossDataStore } from "@/stores/bossDataStore";
import { useGroupMembersStore } from "@/stores/groupMembersStore";
import { useBossTimersStore } from "@/stores/bossTimersStore";
export function GroupSelection() {
  const { group, isLoading: groupLoading,  userData , fetchUserGroup} = useGroupStore();
  const { refreshBossData} = useBossDataStore();
  const { fetchGroupMembers, loading : membersLoading } = useGroupMembersStore();
  const { fetchTimers } = useBossTimersStore();
  useEffect(() => {
    fetchUserGroup().then(() => {
      refreshBossData();
      fetchGroupMembers();
      fetchTimers();
  });
  }, []);

  if (groupLoading || membersLoading) {
    return (
      <Card className=" bg-[#0D0F23]/30 backdrop-blur-sm border-none ">
        <CardContent className="flex justify-between items-center min-h-[100px] gap-5 pt-10 border-b border-[#1F2137]">
          <Skeleton className="h-7 w-[220px] rounded-md" />
          <Skeleton className="h-7 w-[150px] rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 relative">
      {group && userData?.status !== "pending" && (
        <div className="flex justify-between items-center w-full px-0 sm:px-4 py-4 3xl:py-8 border-b border-gray-800">
          <h2 className="text-sm sm:text-base md:text-lg 3xl:text-xl   font-bold text-center text-[#E2E4FF] font-space-grotesk">
           Hi {" "} 
           <span className="text-sm sm:text-base md:text-lg 3xl:text-xl text-blue-500">
            {userData?.username}</span>,
             welcome to  {" "} 
             <span className="text-sm sm:text-base md:text-lg 3xl:text-xl text-blue-500">
             {group.name}</span> !
          </h2>

          <LeaveGroupDialog group={group} />
        </div>
      )}
    </div>
  );
}
