import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";
import type { Group, User } from "@/types/database.types";

export function useUserGroup() {
  const [group, setGroup] = useState<Group | undefined>();
  const [userData, setUserData] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchUserGroup();
  },);

  const fetchUserGroup = async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      setGroup(undefined);
      setUserData(undefined);
      
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // First get the user's details
      const { data: currentUserData, error: userError } = await supabase
        .from("users")
        .select("*")  // Select all user fields instead of just group_id
        .eq("id", user.id)
        .single();

      if (userError) throw userError;

      if (currentUserData) {
        setUserData(currentUserData);
        
        if (currentUserData.group_id) {
          // Then fetch the group details
          const { data: groupData, error: groupError } = await supabase
            .from("groups")
            .select("*")
            .eq("id", currentUserData.group_id)
            .single();

          if (groupError) throw groupError;

          if (groupData) {
            setGroup(groupData);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching user group:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user group'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    group: group as Group,
    userData,
    isLoading,
    error,
    refetch: fetchUserGroup,
  };
} 