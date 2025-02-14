export interface BossTimer {
  id: string;
  user_id: string;
  group_id: string;
  boss_name: string;
  location: string;
  time_of_death: string;
  notes?: string;
  created_at: string;
  allLocations?: string[];
  users?: {
    id: string;
    username: string;
    email: string;
    group_id: string;
  };
}
