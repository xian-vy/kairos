import { create } from 'zustand';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { BossData, Database } from "@/types/database.types";
import { useGroupStore } from './groupStore';

interface BossDataState {
  bossData: BossData[];
  isLoading: boolean;
  error: string | null;
  setBossData: (data: BossData[]) => void;
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
      const { data:bossData, error } = await supabase
        .from("boss_data")
        .select("*")
        .eq("group_id", group.id);

      if (error) throw error;

      if (bossData) {
        set({ bossData});
        console.log("Boss data fetched");
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "An error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
})); 