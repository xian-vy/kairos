import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";

interface JoinGroupDialogProps {
  onGroupJoined: () => void;
  variant?: "default" | "welcome";
}

export function JoinGroupDialog({ onGroupJoined, variant = "default" }: JoinGroupDialogProps) {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinGroupName, setJoinGroupName] = useState("");
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const joinGroup = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("No user found");
        return;
      }

      const { data: group } = await supabase.from("groups").select("id").eq("name", joinGroupName).single();

      if (!group) {
        toast({
          variant: "destructive",
          title: "Failed to join group",
          description: "Group Name not found",
        });
        return;
      }

      // Check if user is already in a group
      const { data: existingUser } = await supabase
        .from("users")
        .select("group_id")
        .eq("id", user.id)
        .single();

      if (existingUser?.group_id) {
        toast({
          variant: "destructive",
          title: "Failed to join group",
          description: "You're already a member of a group",
        });
        return;
      }

      // Update user's group_id instead of creating group_member
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({ 
          group_id: group.id,
          status: "pending"  // New members start as pending
        })
        .eq('id', user.id);

      if (userUpdateError) throw userUpdateError;

      toast({
        title: "Success",
        description: "Joined group successfully",
      });
      onGroupJoined();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
      setShowJoinForm(false);
      setJoinGroupName("");
    }
  };

  return (
    <Dialog open={showJoinForm} onOpenChange={setShowJoinForm}>
      <DialogTrigger asChild>
        <Button
          variant={variant === "default" ? "outline" : "secondary"}
          size={variant === "default" ? "sm" : "default"}
          className={
            variant === "default"
              ? "border-gray-800 hover:bg-gray-800 text-white"
              : "bg-gray-800 hover:bg-gray-900 text-white"
          }
          disabled={isLoading}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            `Join ${variant === "default" ? "Group" : "a Group"}`
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0A0C1B] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Join a Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            value={joinGroupName}
            onChange={(e) => setJoinGroupName(e.target.value)}
            placeholder="Group Name"
            className="bg-black/20 border-gray-800 text-white"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowJoinForm(false)}
              className="text-[#B4B7E5] hover:text-[#E2E4FF] hover:bg-[#1F2137]/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={joinGroup}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : "Join"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
