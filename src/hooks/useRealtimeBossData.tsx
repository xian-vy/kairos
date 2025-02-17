import { useBossDataStore } from '@/stores/bossDataStore';
import { useGroupStore } from '@/stores/groupStore';
import { BossData } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';

const useRealtimeBossData = () => {
    const supabase = createClientComponentClient();
    const {group} = useGroupStore()
    const { addBossDataRealtime, updateBossDataRealtime, removeBossDataRealtime } = useBossDataStore()

    useEffect(() => {   
        const channel = supabase
        .channel("boss_data")
        .on("postgres_changes", { event: "*", schema: "public", table: "boss_data" }, async (payload) => {
            if (!group?.id) return;

            if (payload.eventType === "INSERT" ) {
                addBossDataRealtime(payload.new as BossData);
                console.log("Realtime BossData Added")
            } else if (payload.eventType === "UPDATE") {
                updateBossDataRealtime(payload.new as BossData);  
                console.log("Realtime BossData Updated")
            } else if (payload.eventType === "DELETE") {
                removeBossDataRealtime(payload.old.id);
                console.log("Realtime BossData Removed")
            }
        })
        .subscribe();

        return () => {
            channel.unsubscribe();
        };  
    }, [
        group?.id, 
        supabase, 
        addBossDataRealtime, 
        updateBossDataRealtime, 
        removeBossDataRealtime
    ]); 
}

export default useRealtimeBossData;