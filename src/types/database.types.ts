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
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: "admin" | "member";
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          role: "admin" | "member";
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          role?: "admin" | "member";
          joined_at?: string;
        };
      };
    };
  };
};
