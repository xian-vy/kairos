import { useGroupStore } from "@/stores/groupStore";
import { BossTimer } from "@/types/database.types";
import { ToastOptions } from "@/types/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

interface BossTimersState {
  timers: BossTimer[];
  isLoading: boolean;
  fetchTimers: () => void;
  createOrUpdateTimer: (timerData: BossTimer,toast: (options: ToastOptions) => void, editMode:boolean ) => Promise<void>;
  deleteTimer: (timerId: string,toast: (options: ToastOptions) => void) => Promise<void>;
  addTimerRealtime: (timer: BossTimer) => void;
  removeTimerRealtime: (timerId: string) => void;
  updateTimerRealtime: (timer: BossTimer) => void;
}

export const useBossTimersStore = create<BossTimersState>((set) => {
  const supabase = createClientComponentClient();

  const fetchTimers = async () => {
    const { group } = useGroupStore.getState();

    if (!group?.id) {
      return;
    }

    try {
      const { data: timerData, error } = await supabase
        .from("boss_timers")
        .select(
          `
          *,
          users:user_id (
            id,
            username,
            email,
            group_id
          )
        `
        )
        .eq("users.group_id", group.id)
        .eq("users.status", "accepted");

      if (error) {
        console.error("Error fetching timers:", error);
        return;
      }

      //remove users from the timer data 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const transformedTimers = timerData.map(({ users: _users, ...rest }) => rest);

      
      set({ timers: transformedTimers });
    } finally {
      set({ isLoading: false });
    }
  };



  const createOrUpdateTimer = async (timerData: BossTimer,toast: (options: ToastOptions) => void, editMode:boolean) => {
    set({ isLoading: true });

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("User not authenticated");

      timerData.user_id = user.id;
      let error;
      
      if (editMode) {
        ({ error } = await supabase
          .from('boss_timers')
          .update(timerData)
          .eq('id', timerData.id));
      } else {
        const { error: insertError } = await supabase
          .from('boss_timers')
          .insert([timerData])
          .single();
      
        if (insertError) {
          error = insertError;
        } 
      }
      
      if (error) throw error;
      
      toast({
        variant: "success",
        title: editMode ? "Timer updated" : "Timer created",
        description: editMode ? "The timer has been updated successfully" : "The timer has been created successfully",
      });
           
      set({ isLoading: false });
      
    } catch (error: Error | unknown) {
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        fullError: error
      });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      set({ isLoading: false });

    } finally {
      set({ isLoading: false });
    }
  };

  const deleteTimer = async (timerId: string,toast: (options: ToastOptions) => void) => {
    try {
      const { error } = await supabase.from("boss_timers").delete().eq("id", timerId);

      if (error) {
        toast({
          title: "Error deleting timer",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
            variant: "success",
          title: "Timer deleted",
          description: "The timer has been deleted successfully",
        });
      }

    } catch (error: Error | unknown) {
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        fullError: error
      });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    timers: [],
    isLoading: true,
    fetchTimers,
    createOrUpdateTimer,
    deleteTimer,
    addTimerRealtime: (timer: BossTimer) => set((state) => ({ timers: [...state.timers, timer] })),
    removeTimerRealtime: (timerId: string) => set((state) => ({ timers: state.timers.filter((t) => t.id !== timerId) })),
    updateTimerRealtime: (timer: BossTimer) =>
      set((state) => ({
        timers: state.timers.map((t) => (t.id === timer.id ? { ...t, ...timer } : t)),
      })),
  };
});