"use client";
import { Card, CardContent } from "@/components/ui/card";
import { LeaveGroupDialog } from "./leave-group-dialog";
import { useGroupStore } from "@/stores/groupStore";

export function GroupSelection() {
  const { group, isLoading: groupLoading,  userData , fetchUserGroup} = useGroupStore();
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
        <div className="flex justify-between items-center w-full px-0 sm:px-4 py-4 3xl:py-8 border-b border-gray-800">
          <h2 className="text-sm sm:text-base md:text-lg 3xl:text-xl   font-bold text-center text-[#E2E4FF] font-space-grotesk">
           Hi {" "} 
           <span className="text-sm sm:text-base md:text-lg 3xl:text-xl text-blue-500">
            {userData?.username}</span>,
             welcome to  {" "} 
             <span className="text-sm sm:text-base md:text-lg 3xl:text-xl text-blue-500">
             {group.name}</span> !
          </h2>

          <LeaveGroupDialog onLeaveGroup={fetchUserGroup} group={group} />
        </div>
      )}
    </div>
  );
}
