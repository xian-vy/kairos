import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { BOSSDATA_NIGHTCROWS } from "@/lib/data/presets";
import { useBossDataStore } from "@/stores/bossDataStore";
import { useGroupStore } from "@/stores/groupStore";
import useCurrentUser from "@/hooks/useCurrentUser";

interface CreateGroupDialogProps {
  onGroupCreated: () => void;
  variant?: "default" | "welcome";
}

export function CreateGroupDialog({ onGroupCreated, variant = "default" }: CreateGroupDialogProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { setBossData } = useBossDataStore();
  const { fetchUserGroup } = useGroupStore();
  const { currentUser } = useCurrentUser();

  const createGroup = async () => {
    try {
      setIsLoading(true);
     
      if (!currentUser) {
        console.error("No user found");
        return;
      }

      const { data: existingGroup } = await supabase
        .from("groups")
        .select("id")
        .eq("name", newGroupName)
        .single();

      if (existingGroup) {
        toast({
          variant: "destructive",
          title: "Failed to create group",
          description: "A group with this name already exists",
        });
        return;
      }

      const { data: group, error: createError } = await supabase
        .from("groups")
        .insert([{ name: newGroupName, created_by: currentUser.id }])
        .select()
        .single();

      if (createError) {
        console.error("create group error:", createError);
        throw createError;
      }

      if (group) {
        const { error: userUpdateError } = await supabase
          .from("users")
          .update({ group_id: group.id, status: "accepted" })
          .eq("id", currentUser.id);

        if (userUpdateError) throw userUpdateError;

        const bossDataInserts = BOSSDATA_NIGHTCROWS.map((bossData) => ({
          boss_name: bossData.name,
          data: bossData,
          group_id: group.id,
          sortOrder: bossData.sortOrder,
        }));

        const { error: bossDataError } = await supabase
          .from("boss_data")
          .insert(bossDataInserts);

        if (bossDataError) throw bossDataError;

        toast({
          title: "Success",
          description: "Group created successfully",
        });
        
        setBossData(BOSSDATA_NIGHTCROWS);
        await fetchUserGroup(); // Fetch updated group data
        onGroupCreated();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
      setShowCreateForm(false);
      setNewGroupName("");
    }
  };

  return (
    <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
      <DialogTrigger asChild>
        <Button
          size={variant === "default" ? "sm" : "default"}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            `Create ${variant === "default" ? "Group" : "a Group"}`
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0A0C1B] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Create a New Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Group Name"
            className="bg-black/20 border-gray-800 text-white"
            maxLength={25}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowCreateForm(false)}
              className="text-[#B4B7E5] hover:text-[#E2E4FF] hover:bg-[#1F2137]/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={createGroup}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
