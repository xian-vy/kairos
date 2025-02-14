import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";
import type { Group } from "@/types/database.types";

export function useUserGroup() {
  const [group, setGroup] = useState<Group | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchUserGroup();
  }, []);

  const fetchUserGroup = async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      setGroup(undefined);
      
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // First get the user's group_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("group_id")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;

      if (userData?.group_id) {
        // Then fetch the group details
        const { data: groupData, error: groupError } = await supabase
          .from("groups")
          .select("*")
          .eq("id", userData.group_id)
          .single();

        if (groupError) throw groupError;

        if (groupData) {
          setGroup(groupData);
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
    group,
    isLoading,
    error,
    refetch: fetchUserGroup,
  };
} 