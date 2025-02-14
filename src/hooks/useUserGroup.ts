import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";
import { Group } from "@/types/group";

export function useUserGroup() {
  const [group, setGroup] = useState<Group>();
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
      
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberGroups, error } = await supabase
        .from("group_members")
        .select("groups(*)")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (memberGroups) {
        setGroup(memberGroups.groups as unknown as Group);
      }
    } catch (err) {
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