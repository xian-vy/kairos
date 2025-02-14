export interface BossTimer {
  id: string;
  created_at: string;
  user_id: string;
  boss_name: string;
  location: string;
  time_of_death: string;
  next_spawn: string;
  notes: string | null;
  group_id: string;
}

export interface Group {
  id: string
  name: string
  created_by: string
  created_at: string
}

export interface User {
  id: string
  username: string
  email: string
  status: 'pending' | 'accepted'
}

export type Database = {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string;
          name: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_by?: string;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          status: "pending" | "accepted";
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          status: "pending" | "accepted";
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          status?: "pending" | "accepted";
        };
      };
    };
  };
};
