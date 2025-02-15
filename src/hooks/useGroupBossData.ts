import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";
import { BOSSDATA_TYPE } from "@/lib/data/presets";
import { useEffect, useState, useCallback } from "react";

export function useGroupBossData() {
  const [bossData, setBossData] = useState<BOSSDATA_TYPE[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient<Database>();

  const refreshBossData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: userGroup } = await supabase.from("users").select("group_id").eq("id", userData.user.id).single();

      if (!userGroup?.group_id) {
        setError("No group found");
        return;
      }

      const { data, error } = await supabase.from("boss_data").select("*").eq("group_id", userGroup.group_id);

      if (error) throw error;

      if (data) {
        setBossData(data.map((item) => item.data));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    refreshBossData();
  }, [refreshBossData]);

  return { bossData, isLoading, error, refreshBossData };
}
