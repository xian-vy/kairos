import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { useUserGroup } from "@/hooks/useUserGroup";

export interface GroupMember {
  user_id: string;
  users: {
    email: string;
    display_name: string | null;
    status: Database["public"]["Tables"]["users"]["Row"]["status"];
  };
}

export function useGroupMembers() {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();
  const { group } = useUserGroup();

  const fetchGroupMembers = async () => {
    try {
      if (!group?.id) return;

      const { data: users, error: membersError } = await supabase
        .from("users")
        .select(
          `
          id,
          username,
          email,
          status
        `
        )
        .eq("group_id", group.id);

      if (membersError) throw membersError;

      const transformedMembers = users.map((user) => ({
        user_id: user.id,
        users: {
          email: user.email,
          display_name: user.username,
          status: user.status,
        },
      }));

      setMembers(transformedMembers);
    } catch (error) {
      console.error("Error fetching group members:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load group members",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: "accepted" | "pending") => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ status: newStatus })
        .eq("id", userId)
        .eq("group_id", group?.id);

      if (error) throw error;

      setMembers(
        members.map((member) =>
          member.user_id === userId ? { ...member, users: { ...member.users, status: newStatus } } : member
        )
      );

      toast({
        title: "Success",
        description: `User status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user status",
      });
    }
  };

  useEffect(() => {
    fetchGroupMembers();
  }, [group?.id]);

  return {
    members,
    loading,
    updateUserStatus,
  };
}
