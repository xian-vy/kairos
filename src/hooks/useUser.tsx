import { Database } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import useCurrentUser from './useCurrentUser';

type UserRow = Database['public']['Tables']['users']['Row'];
type GroupRow = Database['public']['Tables']['groups']['Row'];

type UserWithGroup = UserRow & {
  group: GroupRow | null;
};

export const useUser = () => {
  const supabase = createClientComponentClient<Database>();
  const { currentUser } = useCurrentUser();
  const [user, setUser] = useState<UserWithGroup | null>(null);
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
          group:groups(*)
        `)
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        setIsLoading(false);
        return;
      }

      setUser(data as UserWithGroup);
      setIsLoading(false);
    };

    fetchUser();
  }, [currentUser?.id, supabase]);

  return { user, isLoading };
}; 