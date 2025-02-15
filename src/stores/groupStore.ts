import { create } from 'zustand';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";
import type { Group, User } from "@/types/database.types";

interface GroupState {
  group: Group | undefined;
  userData: User | undefined;
  isLoading: boolean;
  error: Error | undefined;
  fetchUserGroup: () => Promise<void>;
}

export const useGroupStore = create<GroupState>((set) => ({
  group: undefined,
  userData: undefined,
  isLoading: true,
  error: undefined,
  fetchUserGroup: async () => {
    try {
      set({ isLoading: true, error: undefined, group: undefined, userData: undefined });
      
      const supabase = createClientComponentClient<Database>();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: currentUserData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;

      if (currentUserData) {
        set({ userData: currentUserData });
        
        if (currentUserData.group_id) {
          const { data: groupData, error: groupError } = await supabase
            .from("groups")
            .select("*")
            .eq("id", currentUserData.group_id)
            .single();

          if (groupError) throw groupError;

          if (groupData) {
            set({ group: groupData });
          }
        }
      }
    } catch (err) {
      console.error('Error fetching user group:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to fetch user group') });
    } finally {
      set({ isLoading: false });
    }
  }
})); 