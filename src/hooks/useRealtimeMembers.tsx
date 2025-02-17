import { useGroupMembersStore } from '@/stores/groupMembersStore';
import { useGroupStore } from '@/stores/groupStore';
import { User } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';

const useRealtimeMembers = () => {
    const supabase = createClientComponentClient();
    const {group,fetchUserGroup} = useGroupStore()
    const { addUserRealtime, removeUserRealtime,updateUserRealtime} = useGroupMembersStore()
    useEffect(() => {   
        if (!group?.id) return;

        const channel = supabase
        .channel("users" + group.id)
        .on("postgres_changes", { event: "*", schema: "public", table: "users" }, async (payload) => {


        if (payload.eventType === "INSERT" ) {
            addUserRealtime(payload.new as User);
            console.log("Realtime User Added")
        }else if (payload.eventType === "UPDATE") {
            //remove user if group id is different (user moved to another group / left group)
            if(payload.new.group_id !== group.id) {
                removeUserRealtime(payload.new.id);
            } else {
                updateUserRealtime(payload.new as User);  
            }
            console.log("Realtime User Updated")
            fetchUserGroup();
        } else if (payload.eventType === "DELETE") {
            removeUserRealtime(payload.old.id);
            console.log("Realtime User Removed")
        }
      })
      .subscribe();

    return () => {
        channel.unsubscribe();
    };  

    }, [supabase, addUserRealtime, removeUserRealtime, updateUserRealtime, group?.id,fetchUserGroup]);

}

export default useRealtimeMembers