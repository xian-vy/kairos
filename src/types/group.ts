export type Group = {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
};

export type GroupMember = {
  id: string;
  group_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
};
