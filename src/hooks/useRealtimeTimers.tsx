import { useBossTimersStore } from '@/stores/bossTimersStore';
import { useGroupStore } from '@/stores/groupStore';
import { BossTimer } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';

const useRealtimeTimers = () => {
    const supabase = createClientComponentClient();
    const {group} = useGroupStore()
    const { addTimerRealtime, updateTimerRealtime, removeTimerRealtime } = useBossTimersStore()

    useEffect(() => {   
        const channel = supabase
        .channel("boss_timers")
        .on("postgres_changes", { event: "*", schema: "public", table: "boss_timers" }, async (payload) => {
            if (!group?.id) return;

            if (payload.eventType === "INSERT" ) {
                addTimerRealtime(payload.new as BossTimer);
                console.log("Realtime Timer Added")
            } else if (payload.eventType === "UPDATE") {
                updateTimerRealtime(payload.new as BossTimer);  
                console.log("Realtime Timer Updated")
            } else if (payload.eventType === "DELETE") {
                removeTimerRealtime(payload.old.id);
                console.log("Realtime Timer Removed")
            }
        })
        .subscribe();

        return () => {
            channel.unsubscribe();
        };  
    }, [
        group?.id, 
        supabase, 
        addTimerRealtime, 
        updateTimerRealtime, 
        removeTimerRealtime
    ]);
}

export default useRealtimeTimers;