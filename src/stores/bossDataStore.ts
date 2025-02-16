import { create } from 'zustand';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";
import { BOSSDATA_TYPE } from "@/lib/data/presets";
import { useGroupStore } from './groupStore';

interface BossDataState {
  bossData: BOSSDATA_TYPE[];
  isLoading: boolean;
  error: string | null;
  setBossData: (data: BOSSDATA_TYPE[]) => void;
  refreshBossData: () => Promise<void>;
}

export const useBossDataStore = create<BossDataState>((set) => ({
  bossData: [],
  isLoading: true,
  error: null,
  setBossData: (data) => set({ bossData: data }),
  refreshBossData: async () => {
    try {
      console.log("fetching boss data");
      
      const group = useGroupStore.getState().group;
      if (!group?.id) {
        set({ error: "No group found", bossData: [] });
        return;
      }

      const supabase = createClientComponentClient<Database>();
      const { data, error } = await supabase
        .from("boss_data")
        .select("*")
        .eq("group_id", group.id);

      if (error) throw error;

      if (data) {
        set({ bossData: data.map((item) => item.data) });
        console.log("Boss data fetched");
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "An error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
})); 