"use client";

import { useGroupMembers } from "@/hooks/useGroupMembers";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useUserGroup } from "@/hooks/useUserGroup";
import { UserListCard } from "./UserListCard";

const UsersList = () => {
  const { members, loading, updateUserStatus } = useGroupMembers();
  const { currentUser } = useCurrentUser();
  const { group } = useUserGroup();
  const isAdmin = currentUser?.id === group?.created_by;

  if (loading) {
    return <div className="flex justify-center p-4">Loading users...</div>;
  }

  const pendingMembers = members.filter((member) => member.users.status === "pending");
  const acceptedMembers = members.filter((member) => member.users.status === "accepted");

  return (
    <div className="space-y-6 px-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#E2E4FF]">Accepted Members</h2>
        {acceptedMembers.length === 0 ? (
          <p className="text-center text-[#B4B7E5] py-4">No accepted members</p>
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
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UsersList;
