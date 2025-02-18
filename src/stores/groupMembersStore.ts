import { MAX_MEMBERS_COUNT } from "@/lib/constants";
import { useGroupStore } from "@/stores/groupStore";
import { Database, User } from "@/types/database.types";
import { ToastOptions } from "@/types/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";




interface GroupMembersState {
  members: User[];
  loading: boolean;
  fetchGroupMembers: () => Promise<void>;
  updateUserStatus: (userId: string, newStatus: "accepted" | "pending", toast: (options: ToastOptions) => void) => Promise<void>;
  removeUserFromGroup: (userId: string, toast: (options: ToastOptions) => void) => Promise<void>;
  addUserToGroup: (joinGroupName: string, toast: (options: ToastOptions) => void) => Promise<void>;
  leaveGroup: (group: Database["public"]["Tables"]["groups"]["Row"],  password: string, setPassword: (password: string) => void, setIsLoading: (isLoading: boolean) => void, isAdmin: boolean, toast: (options: { variant: string; title: string; description: string }) => void) => Promise<void>;
  addUserRealtime: (member : User) => void;
  removeUserRealtime: (timerId: string) => void;
  updateUserRealtime: (member : User) => void;
}

export const useGroupMembersStore = create<GroupMembersState>((set) => {
  const supabase = createClientComponentClient<Database>();

  const fetchGroupMembers = async () => {
    try {
        console.log("fetching group members");
        const group = useGroupStore.getState().group;

      if (!group?.id) {
        set({loading:false}) 
        console.error("Group Members Store : No group found");
        return
     };

      const { data: users, error: membersError } = await supabase
        .from("users")
        .select(
         `*`
        )
        .eq("group_id", group.id);

      if (membersError) throw membersError;


      set({ members: users, loading: false });
      console.log("Group members fetched");

    } catch (error) {
      console.error("Error fetching group members:", error);
      set({ loading: false });
    }
  };

  const updateUserStatus = async (userId: string, newStatus: "accepted" | "pending", toast: (options: ToastOptions) => void) => {
    try {
        const group = useGroupStore.getState().group;
        if (!group?.id) {   
            console.error("Group Members Store : No group found");
            return
        }

      const { error } = await supabase
        .from("users")
        .update({ status: newStatus })
        .eq("id", userId)
        .eq("group_id", group?.id);

      if (error) throw error;

      toast({
        variant: "success",
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

  const removeUserFromGroup = async (userId: string, toast: (options: ToastOptions) => void) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          group_id: null,
          status: "pending",
        })
        .eq("id", userId);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Success",
        description: `User join request has been denied.`,
      });
      set((state) => ({ members: state.members.filter((t) => t.id !== userId) }));
    } catch (error) {
      console.error("Error removing user from group:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove user from group",
      });
      throw error;
    }
  };

  const addUserToGroup = async (joinGroupName: string,  toast: (options: ToastOptions) => void) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("No user found");
        return;
      }

      const { data: group } = await supabase.from("groups").select("id").eq("name", joinGroupName).single();

      if (!group) {
        toast({
          variant: "destructive",
          title: "Failed to join group",
          description: "Group Name not found",
        });
        return;
      }

      const { data: existingUser } = await supabase
        .from("users")
        .select("group_id")
        .eq("id", user.id)
        .single();

      if (existingUser?.group_id) {
        toast({
          variant: "destructive",
          title: "Failed to join group",
          description: "You're already a member of a group",
        });
        return;
      }

      const { count: userCount } = await supabase
        .from("users")
        .select("id", { count: "exact" })
        .eq("group_id", group.id);
      
      if (userCount !== null && userCount >= MAX_MEMBERS_COUNT) {
        toast({
          variant: "destructive",
          title: "Failed to join group",
          description: `Maximum members count reached (${MAX_MEMBERS_COUNT})`,
        });
        return;
      }

      const { error: userUpdateError } = await supabase
        .from("users")
        .update({
          group_id: group.id,
          status: "pending",
        })
        .eq("id", user.id);

      if (userUpdateError) throw userUpdateError;

      toast({
        variant: "success",
        title: "Success",
        description: "Joined group successfully",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  const leaveGroup = async (group: Database["public"]["Tables"]["groups"]["Row"], password: string, setPassword: (password: string) => void, setIsLoading: (isLoading: boolean) => void, isAdmin: boolean, toast: (options: ToastOptions) => void) => {
    setIsLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        toast({
          title: "Failed",
          description: "Failed to verify user",
          variant: "destructive",
        });
        return;
      }

      const verifyPassword = async () => {
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: user?.email || "",
            password: password,
          });

          if (error) {
            throw new Error("Password is Incorrect.");
          }
          setPassword("");
          return true;
        } catch (error) {
          console.error(error);
          toast({
            title: "Failed",
            description: "Password is Incorrect.",
            variant: "destructive",
          });
          return false;
        }
      };

      // If admin, verify password first
      if (isAdmin) {
        const isPasswordValid = await verifyPassword();
        if (!isPasswordValid) {
          setIsLoading(false);
          return;
        }

        // Get all users in the group
        const { data: groupUsers } = await supabase.from("users").select("id").eq("group_id", group.id);

        if (groupUsers) {
          // Delete boss timers for all users in the group
          const userIds = groupUsers.map((user) => user.id);
          const { error: deleteTimersError } = await supabase.from("boss_timers").delete().in("user_id", userIds);

          if (deleteTimersError) throw deleteTimersError;

          // Remove all users from the group first
          const { error: updateUsersError } = await supabase
            .from("users")
            .update({ group_id: null })
            .eq("group_id", group.id);

          if (updateUsersError) throw updateUsersError;
        }

        // Then delete the group itself
        const { error: deleteError } = await supabase.from("groups").delete().eq("id", group.id);

        if (deleteError) throw deleteError
      } else {
        // If user is not admin, just update their group_id to null
        await removeUserFromGroup(user.id, toast);
      }



      // Then update UI state
      setPassword(""); // Clear password

      toast({
        variant: "success",
        title: group ? "Group deleted" : "Group left",
        description: group ? "You have deleted the group and all its data" : "You have left the group",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    members: [],
    loading: true,
    fetchGroupMembers,
    updateUserStatus,
    removeUserFromGroup,
    addUserToGroup,
    leaveGroup,
    addUserRealtime: (member: User) => set((state) => ({ members: [...state.members, member] })),
      removeUserRealtime: (userId: string) => set((state) => ({ members: state.members.filter((t) => t.id !== userId) })),
      updateUserRealtime: (member: User) =>
        set((state) => ({
          members: state.members.map((t) => (t.id === member.id ? { ...t, ...member } : t)),
        })),
  };
});