import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { BossTimer } from "@/types/boss";
import { useToast } from "./use-toast";
import { useGroupStore } from "@/stores/groupStore";

export function useRealtimeBossTimers() {
  const [timers, setTimers] = useState<BossTimer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const { group } = useGroupStore();

  useEffect(() => {
    const fetchTimers = async () => {
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
          toast({
            title: "Error fetching timers",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        const transformedTimers = timerData.map((timer) => ({
          ...timer,
          users: Array.isArray(timer.users) ? timer.users[0] : timer.users,
        }));
        setTimers(transformedTimers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimers();

    const subscription = supabase
      .channel("boss_timers")
      .on("postgres_changes", { event: "*", schema: "public", table: "boss_timers" }, async (payload) => {
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

            setTimers((prev) => {
              if (payload.eventType === "INSERT") {
                return [...prev, transformedTimer];
              }
              return prev.map((t) => (t.id === transformedTimer.id ? transformedTimer : t));
            });
          }
        } else if (payload.eventType === "DELETE") {
          setTimers((prev) => prev.filter((timer) => timer.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, toast, group]);

  return { timers, setTimers, isLoading };
}
