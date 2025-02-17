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
  updateBossData: (bossData: BossData) => Promise<void>;
  addBossData: (bossData: BossData) => Promise<void>;
  deleteBossData: (id: string) => Promise<void>;
}

export const useBossDataStore = create<BossDataState>((set) => {
  const supabase = createClientComponentClient<Database>();

  const refreshBossData = async () => {
    try {
      console.log("fetching boss data");
      
      const group = useGroupStore.getState().group;
      if (!group?.id) {
        set({ error: "No group found", bossData: [] });
        return;
      }

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
  };

  const updateBossData = async (bossData: BossData) => {
    try {
      const group = useGroupStore.getState().group;
      
      if (!group?.id) {
        throw new Error("No group found");
      }

      const { error: updateError } = await supabase
        .from("boss_data")
        .update({
          boss_name: bossData.boss_name,
          data: bossData.data,
          sortOrder: bossData.sortOrder
        })
        .eq("group_id", group.id)
        .eq("id", bossData.id);

      if (updateError) throw updateError;

    } catch (error) {
      throw error;
    }
  };

  const addBossData = async (bossData: BossData) => {
    const { error } = await supabase
      .from('boss_data')
      .insert([bossData])
      .select();

    if (error) throw error;

  };

  const deleteBossData = async (id: string) => {
    const group = useGroupStore.getState().group;
    if (!group?.id) throw new Error("No group found");

    const { error } = await supabase
      .from('boss_data')
      .delete()
      .eq('id', id)
      .eq('group_id', group.id);

    if (error) throw error;
  };

  return {
    bossData: [],
    isLoading: true,
    error: null,
    refreshBossData,
    updateBossData,
    setBossData: (data: BossData[]) => set({ bossData: data }),
    addBossDataRealtime: (bossData: BossData) => 
      set((state) => ({ bossData: [...state.bossData, bossData] })),
    removeBossDataRealtime: (id: string) => 
      set((state) => ({ bossData: state.bossData.filter((b) => b.id !== id) })),
    updateBossDataRealtime: (bossData: BossData) =>
      set((state) => ({
        bossData: state.bossData.map((b) => (b.id === bossData.id ? bossData : b))
      })),
    addBossData,
    deleteBossData,
  };
}); 