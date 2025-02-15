import { BOSSDATA_TYPE } from "@/lib/data/presets";

export interface BossTimer {
  id: string;
  created_at: string;
  user_id: string;
  boss_name: string;
  location: string;
  time_of_death: string;
  next_spawn: string;
  notes: string | null;
}

export interface Group {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  status: "pending" | "accepted";
  group_id: string | null;
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
          group_id: string | null;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          status: "pending" | "accepted";
          group_id?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          status?: "pending" | "accepted";
          group_id?: string | null;
        };
      };
      boss_timers: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          boss_name: string;
          location: string;
          time_of_death: string;
          next_spawn: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          boss_name: string;
          location: string;
          time_of_death: string;
          next_spawn: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          boss_name?: string;
          location?: string;
          time_of_death?: string;
          next_spawn?: string;
          notes?: string | null;
        };
      };
      boss_data: {
        Row: {
          id: string;
          boss_name: string;
          data: BOSSDATA_TYPE;
          group_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          boss_name: string;
          data: BOSSDATA_TYPE;
          group_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          boss_name?: string;
          data?: BOSSDATA_TYPE;
          group_id?: string;
          created_at?: string;
        };
      };
    };
  };
};
