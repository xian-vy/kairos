import { useGroupMembersStore } from '@/stores/groupMembersStore';
import { useGroupStore } from '@/stores/groupStore';
import { User } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';

const useRealtimeMembers = () => {
    const supabase = createClientComponentClient();
    const {group} = useGroupStore()
    const { addUserRealtime, removeUserRealtime,updateUserRealtime} = useGroupMembersStore()
    useEffect(() => {   
        const channel = supabase
        .channel("users")
        .on("postgres_changes", { event: "*", schema: "public", table: "users" }, async (payload) => {

        if (!group?.id) return;

        if (payload.eventType === "INSERT" ) {
            addUserRealtime(payload.new as User);
            console.log("Realtime User Added")
        }else if (payload.eventType === "UPDATE") {
            updateUserRealtime(payload.new as User);  
            console.log("Realtime User Updated")
        } else if (payload.eventType === "DELETE") {
            removeUserRealtime(payload.old.id);
            console.log("Realtime User Removed")
        }
      })
      .subscribe();

    return () => {
        channel.unsubscribe();
    };  

    }, [supabase])

}

export default useRealtimeMembers