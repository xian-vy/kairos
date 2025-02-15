"use client";

import { useGroupMembers } from "@/hooks/useGroupMembers";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useUserGroup } from "@/hooks/useUserGroup";
import { UserListCard } from "./UserListCard";
import { UserListSkeleton } from "./UserListCardSkeleton";

const UsersList = () => {
  const { members, loading, updateUserStatus, removeUserFromGroup } = useGroupMembers();
  const { currentUser } = useCurrentUser();
  const { group } = useUserGroup();
  const isAdmin = currentUser?.id === group?.created_by;

  const handleCancelRequest = async (userId: string) => {
    await removeUserFromGroup(userId);
  };

  const pendingMembers = members.filter((member) => member.users.status === "pending");
  const acceptedMembers = members.filter((member) => member.users.status === "accepted");

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
              key={member.user_id}
              member={member}
              isAdmin={isAdmin}
              currentUserId={currentUser?.id}
              onUpdateStatus={updateUserStatus}
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
              key={member.user_id}
              member={member}
              isAdmin={isAdmin}
              currentUserId={currentUser?.id}
              onUpdateStatus={updateUserStatus}
              onCancelRequest={handleCancelRequest}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UsersList;
