import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";
import { BOSSDATA_TYPE } from "@/lib/data/presets";
import { useEffect, useState, useCallback } from "react";
import { useUserGroup } from "./useUserGroup";

export function useGroupBossData() {
  const [bossData, setBossData] = useState<BOSSDATA_TYPE[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {group} = useUserGroup();
  const supabase = createClientComponentClient<Database>();

  const refreshBossData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!group?.id) {
        setError("No group found");
        setBossData([]);
        return;
      }

      const { data, error } = await supabase.from("boss_data").select("*").eq("group_id", group.id);

      if (error) throw error;

      if (data) {
        setBossData(data.map((item) => item.data));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [supabase,group]);

  useEffect(() => {
    refreshBossData();
  }, [refreshBossData]);

  return { bossData, isLoading, error, refreshBossData };
}
