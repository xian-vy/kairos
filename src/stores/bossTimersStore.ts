import { useGroupStore } from "@/stores/groupStore";
import { BossTimer } from "@/types/database.types";
import { ToastOptions } from "@/types/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

interface BossTimersState {
  timers: BossTimer[];
  isLoading: boolean;
  fetchTimers: () => void;
  subscribeToTimers: () => void;
  createOrUpdateTimer: (timerData: BossTimer,toast: (options: ToastOptions) => void, editMode:boolean ) => Promise<void>;
  deleteTimer: (timerId: string,toast: (options: ToastOptions) => void) => Promise<void>;
}

export const useBossTimersStore = create<BossTimersState>((set, get) => {
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

      const transformedTimers = timerData.map((timer) => ({
        ...timer,
        users: Array.isArray(timer.users) ? timer.users[0] : timer.users,
      }));
      set({ timers: transformedTimers });
    } finally {
      set({ isLoading: false });
    }
  };

  const subscribeToTimers = () => {
    const subscription = supabase
      .channel("boss_timers")
      .on("postgres_changes", { event: "*", schema: "public", table: "boss_timers" }, async (payload) => {
        const { group } = useGroupStore.getState();

        if (!group?.id) return;

        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const { data: timer, error } = await supabase
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
            .eq("id", payload.new.id)
            .eq("users.group_id", group.id)
            .eq("users.status", "accepted")
            .single();

          if (!error && timer) {
            const transformedTimer = {
              ...timer,
              users: Array.isArray(timer.users) ? timer.users[0] : timer.users,
            };

            set((state) => {
              if (payload.eventType === "INSERT") {
                return { timers: [...state.timers, transformedTimer] };
              }
              return {
                timers: state.timers.map((t) => (t.id === transformedTimer.id ? transformedTimer : t)),
              };
            });
          }
        } else if (payload.eventType === "DELETE") {
          set((state) => ({
            timers: state.timers.filter((timer) => timer.id !== payload.old.id),
          }));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const createOrUpdateTimer = async (timerData: BossTimer,toast: (options: ToastOptions) => void, editMode:boolean) => {
    set({ isLoading: true });

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("User not authenticated");

      timerData.user_id = user.id;
      let error;
      let newID = "";
      
      if (editMode) {
        ({ error } = await supabase
          .from('boss_timers')
          .update(timerData)
          .eq('id', timerData.id));
      } else {
        const { data, error: insertError } = await supabase
          .from('boss_timers')
          .insert([timerData])
          .select('id') // Ensure you get the newly inserted ID
          .single();
      
        if (insertError) {
          error = insertError;
        } else {
          newID = data?.id;
        }
      }
      
      if (error) throw error;
      
      toast({
        variant: "success",
        title: editMode ? "Timer updated" : "Timer created",
        description: editMode ? "The timer has been updated successfully" : "The timer has been created successfully",
      });
      
      set((state) => {
        if (editMode) {
          return {
            timers: state.timers.map((t) =>
              t.id === timerData.id ? { ...t, ...timerData } : t
            ),
          };
        }
        return {
          timers: [
            ...state.timers,
            {
              ...timerData,
              id: newID, 
              user_id: timerData.user_id || "",
            },
          ],
        };
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
      set({
        timers: get().timers.filter((t) => t.id !== timerId),
      });
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
    subscribeToTimers,
    createOrUpdateTimer,
    deleteTimer,
  };
});