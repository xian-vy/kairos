import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";

interface CreateGroupDialogProps {
  onGroupCreated: () => void;
  variant?: "default" | "welcome";
}

export function CreateGroupDialog({ onGroupCreated, variant = "default" }: CreateGroupDialogProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();

  const createGroup = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("No user found");
        return;
      }

      const { data: existingGroup } = await supabase.from("groups").select("id").eq("name", newGroupName).single();

      if (existingGroup) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "A group with this name already exists",
        });
        return;
      }

      const { data: group, error: createError } = await supabase
        .from("groups")
        .insert([{ name: newGroupName, created_by: user.id }])
        .select()
        .single();

      if (createError) throw createError;

      if (group) {
        const { error: memberError } = await supabase
          .from("group_members")
          .insert([{ group_id: group.id, user_id: user.id, role: "admin" }]);

        if (memberError) throw memberError;

        onGroupCreated();
        setShowCreateForm(false);
        setNewGroupName("");
        toast({
          title: "Success",
          description: "Group created successfully",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
      <DialogTrigger asChild>
        <Button size={variant === "default" ? "sm" : "default"} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create {variant === "default" ? "Group" : "a Group"}
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
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowCreateForm(false)}
              className="text-[#B4B7E5] hover:text-[#E2E4FF] hover:bg-[#1F2137]/50"
            >
              Cancel
            </Button>
            <Button onClick={createGroup} className="bg-blue-600 hover:bg-blue-700 text-white">
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
