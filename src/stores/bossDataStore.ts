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
  addBossDataRealtime: (bossData: BossData) => void;
  removeBossDataRealtime: (Id: string) => void;
  updateBossDataRealtime: (bossData: BossData) => void;
}

export const useBossDataStore = create<BossDataState>((set) => ({
  bossData: [],
  isLoading: true,
  error: null,
  setBossData: (data) => set({ bossData: data }),
  addBossDataRealtime: (bossData) => set((state) => ({ bossData: [...state.bossData, bossData] })),
  removeBossDataRealtime: (id) => set((state) => ({ bossData: state.bossData.filter((bossData) => bossData.id !== id) })),
  updateBossDataRealtime: (bossData) => set((state) => ({ bossData: state.bossData.map((b) => b.id === bossData.id ? bossData : b) })),
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