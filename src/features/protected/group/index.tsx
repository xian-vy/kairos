"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/types/database.types";
import { Group } from "@/types/group";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateGroupDialog } from "./create-group-dialog";
import { JoinGroupDialog } from "./join-group-dialog";

export function GroupSelection() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const fetchUserGroups = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberGroups } = await supabase.from("group_members").select("groups(*)").eq("user_id", user.id);

      if (memberGroups) {
        setGroups(memberGroups.map((mg) => mg.groups) as unknown as Group[]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-black/20 border-none">
        <CardContent className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {groups.length === 0 ? (
        <Card className="bg-black/20 border-none">
          <CardHeader>
            <CardTitle className="text-xl text-center text-white">Welcome to Kairos!</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <CreateGroupDialog onGroupCreated={fetchUserGroups} variant="welcome" />
            <JoinGroupDialog onGroupJoined={fetchUserGroups} variant="welcome" />
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-black/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-white">Your Groups</CardTitle>
            <div className="flex gap-2">
              <JoinGroupDialog onGroupJoined={fetchUserGroups} />
              <CreateGroupDialog onGroupCreated={fetchUserGroups} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  className="bg-black/20 border-none hover:bg-black/30 transition-colors cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      <Users className="h-4 w-4 text-blue-500" />
                      {group.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
