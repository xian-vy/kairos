"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BossList } from "./boss/BossList";
import { BossTimerList } from "./boss/BossTimer";
import { FaSkull } from "react-icons/fa";
import { Timer, Users } from "lucide-react";
import UsersList from "./users";
import { CreateGroupDialog } from "./group/create-group-dialog";
import { JoinGroupDialog } from "./group/join-group-dialog";
import { LeaveGroupDialog } from "./group/leave-group-dialog";
import { Group } from "@/types/group";
import { User } from "@/types/database.types";
import useCurrentUser from "@/hooks/useCurrentUser";

type BossPageProps = {
  group: Group;
  userData: User | undefined;
  refetch: () => Promise<void>;
};

export function BossPage({ group, refetch, userData }: BossPageProps) {
  const { currentUser } = useCurrentUser();
  const isAdmin = group?.created_by === currentUser?.id;

  return (
    <div className="w-full relative">
      <Tabs defaultValue="bosses" className="w-full">
        <TabsList className="flex justify-center mt-2 xl:mt-5">
          <TabsTrigger value="bosses" className="flex items-center gap-2" disabled={!group}>
            <FaSkull className="h-4 w-4 fill-red-800" /> Boss List
          </TabsTrigger>
          <TabsTrigger value="timers" className="flex items-center gap-2" disabled={!group}>
            <Timer className="h-4 w-4" /> Active Timers
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="users" className="flex items-center gap-2" disabled={!group}>
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="timers" className="mt-4 relative">
          <BossTimerList />
          {!group && <div className="absolute inset-0" />}
        </TabsContent>
        <TabsContent value="bosses" className="mt-4 relative">
          <BossList />
          {!group && <div className="absolute inset-0" />}
        </TabsContent>
        {isAdmin && (
          <TabsContent value="users" className="mt-4 relative">
            <UsersList />
            {!group && <div className="absolute inset-0" />}
          </TabsContent>
        )}
      </Tabs>
      {group ? (
        <>
          {userData?.status === "pending" && (
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#0a0c1b] backdrop-blur-sm to-transparent z-20 ">
              <div className="flex flex-col h-full items-center justify-start mt-[50%] lg:mt-[15%] lg:justify-start gap-3  p-4 font-space-grotesk">
                <h1 className="text-white text-base md:text-2xl font-bold pointer-events-auto max-w-[500px] text-center">
                  Your request to join group{" "}
                  <span className="underline underline-offset-4 text-base md:text-2xl text-blue-500 font-bold">
                    {group.name}
                  </span>{" "}
                  is pending approval
                </h1>
                <LeaveGroupDialog onLeaveGroup={refetch} group={group} />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#0a0c1b] backdrop-blur-sm to-transparent z-20 ">
          <div className="flex flex-col h-full items-center justify-start mt-[50%] lg:mt-[15%] lg:justify-start  p-4 font-space-grotesk">
            <h1 className="text-white text-base md:text-2xl font-bold pointer-events-auto">You are not in a group!</h1>
            <p className="text-white text-xs pointer-events-auto">Please create or join a group to continue</p>
            <div className="flex gap-4 mt-4 pointer-events-auto">
              <CreateGroupDialog onGroupCreated={refetch} variant="welcome" />
              <JoinGroupDialog onGroupJoined={refetch} variant="welcome" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
