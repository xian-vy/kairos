"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useCurrentUser from "@/hooks/useCurrentUser";
import type { Database } from "@/types/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LogOut, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LeaveGroupDialog({
  onLeaveGroup,
  group,
}: {
  onLeaveGroup: () => void;
  group: Database["public"]["Tables"]["groups"]["Row"];
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { currentUser } = useCurrentUser();
  const isAdmin = group?.created_by === currentUser?.id;

  const verifyPassword = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: currentUser?.email || "",
        password: password,
      });

      if (error) {
        throw new Error("Invalid password");
      }
      setPassword("");
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleLeaveGroup = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        toast({
          title: "Error",
          description: "Failed to verify user",
          variant: "destructive",
        });
        return;
      }

      // If admin, verify password first
      if (isAdmin) {
        const isPasswordValid = await verifyPassword();
        if (!isPasswordValid) {
          setIsLoading(false);
          return;
        }

        // Get all users in the group
        const { data: groupUsers } = await supabase.from("users").select("id").eq("group_id", group.id);

        if (groupUsers) {
          // Delete boss timers for all users in the group
          const userIds = groupUsers.map((user) => user.id);
          const { error: deleteTimersError } = await supabase.from("boss_timers").delete().in("user_id", userIds);

          if (deleteTimersError) throw deleteTimersError;

          // Remove all users from the group first
          const { error: updateUsersError } = await supabase
            .from("users")
            .update({ group_id: null })
            .eq("group_id", group.id);

          if (updateUsersError) throw updateUsersError;
        }

        // Then delete the group itself
        const { error: deleteError } = await supabase.from("groups").delete().eq("id", group.id);

        if (deleteError) throw deleteError;
      } else {
        // If user is not admin, just update their group_id to null
        const { error: leaveError } = await supabase.from("users").update({ group_id: null }).eq("id", user.id);

        if (leaveError) throw leaveError;
      }

      // Call onLeaveGroup before other UI updates
      onLeaveGroup();

      // Then update UI state
      setOpen(false);
      setPassword(""); // Clear password
      router.refresh();

      toast({
        title: group ? "Group deleted" : "Group left",
        description: group ? "You have deleted the group and all its data" : "You have left the group",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-xs text-[#B4B7E5] hover:bg-red-500 hover:text-white">
          Leave Group <LogOut strokeWidth={1.5} className="h-3 w-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#0A0C1B] border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#E2E4FF]">{isAdmin ? "Delete Group" : "Leave Group"}</AlertDialogTitle>
          {isAdmin ? (
            <div className="space-y-4 text-sm">
              <div className="text-red-400">
                You are the admin of this group. Deleting the group will delete all related data including all boss
                timers and group members.
              </div>
              <div className="space-y-3">
                <label className="text-[#B4B7E5] text-xs lg:text-sm flex items-center gap-1">
                  <Lock strokeWidth={1.5} className="h-4 w-4" />
                  Confirm your password to delete
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-black/20 border-gray-800 text-white"
                />
              </div>
            </div>
          ) : (
            <AlertDialogDescription className="text-[#B4B7E5]">
              Are you sure you want to leave this group? You will need to rejoin.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setOpen(false);
              setPassword(""); // Clear password when canceling
            }}
            className="text-[#B4B7E5] hover:text-[#E2E4FF] hover:bg-[#1F2137]/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLeaveGroup}
            disabled={isAdmin && !password}
            className="bg-red-700 hover:bg-red-600 text-white border-none"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isAdmin ? "Delete Group" : "Leave Group"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
