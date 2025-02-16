"use client";
import { useToast } from "@/hooks/use-toast";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useGroupMembersStore } from "@/stores/groupMembersStore";
import { useGroupStore } from "@/stores/groupStore";
import { UserListCard } from "./UserListCard";
import { UserListSkeleton } from "./UserListCardSkeleton";

const UsersList = () => {
  const { members,removeUserFromGroup, loading, updateUserStatus } = useGroupMembersStore();
  const { currentUser } = useCurrentUser();
  const { group } = useGroupStore();
  const isAdmin = currentUser?.id === group?.created_by;
  const {toast }= useToast();

  const handleCancelRequest = async (userId: string) => {
    await removeUserFromGroup(userId, (options) => toast({ ...options, variant: options.variant as "default" | "destructive" }));
  };

  const updateStatus = async (userId: string, status: "accepted" | "pending") => {
    await updateUserStatus(userId, status, (options) => toast({ ...options, variant: options.variant as "default" | "destructive" }));
  }

  const pendingMembers = members.filter((member) => member.status === "pending");
  const acceptedMembers = members.filter((member) => member.status === "accepted");

  if (loading ||  acceptedMembers.length ===0 ) {
    return <UserListSkeleton />;
  }
  return (
    <div className="space-y-6 px-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#E2E4FF]">Current Members</h2>
        {acceptedMembers.length === 0 ? (
          <p className="text-center text-[#B4B7E5] py-4">No current members</p>
        ) : (
          acceptedMembers.map((member) => (
            <UserListCard
              key={member.id}
              member={member}
              isAdmin={isAdmin}
              currentUserId={currentUser?.id}
              onUpdateStatus={updateStatus}
            />
          ))
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#E2E4FF]">Pending Members</h2>
        {pendingMembers.length === 0 ? (
          <p className="text-center text-[#B4B7E5] py-4">No pending members</p>
        ) : (
          pendingMembers.map((member) => (
            <UserListCard
              key={member.id}
              member={member}
              isAdmin={isAdmin}
              currentUserId={currentUser?.id}
              onUpdateStatus={updateStatus}
              onCancelRequest={handleCancelRequest}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UsersList;
