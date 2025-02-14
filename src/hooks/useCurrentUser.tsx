import { Database } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const useCurrentUser = () => {
    const supabase = createClientComponentClient<Database>();

    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
        };
        fetchUser();
    }, [supabase]);     

  return { currentUser };
}

export default useCurrentUser
