import { Database } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const useCurrentUser = () => {
    const supabase = createClientComponentClient<Database>();

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    useEffect(() => {
        const getUser = async () => {
          const { data: { session } } = await supabase.auth.getSession()
          setCurrentUser(session?.user ?? null)
        }
    
        getUser()
    
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setCurrentUser(session?.user ?? null)
        })
    
        return () => subscription.unsubscribe()
      }, [supabase.auth])

  return { currentUser };
}

export default useCurrentUser
