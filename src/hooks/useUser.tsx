import { Database } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import useCurrentUser from './useCurrentUser';

type UserRow = Database['public']['Tables']['users']['Row'];
type GroupRow = Database['public']['Tables']['groups']['Row'];

type UserWithPendingGroup = UserRow & {
  pending_group?: GroupRow;
};

export const useUser = () => {
  const supabase = createClientComponentClient<Database>();
  const { currentUser } = useCurrentUser();
  const [user, setUser] = useState<UserWithPendingGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser?.id) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          pending_group:pending_group_id (*)
        `)
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        setIsLoading(false);
        return;
      }

      setUser(data);
      setIsLoading(false);
    };

    fetchUser();
  }, [currentUser?.id, supabase]);

  return { user, isLoading };
}; 