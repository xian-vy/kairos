"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LeaveGroupDialog({onLeaveGroup}: {onLeaveGroup: () => void}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLeaveGroup = async () => {
    setIsLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        toast({
          title: "Error",
          description: "Failed to verify user",
          variant: "destructive",
        });
        return;
      }

      // Check if user is admin of the group
      const { data: groupData } = await supabase
        .from('groups')
        .select('id')
        .eq('created_by', user.id)
        .single();

      if (groupData) {
        // If user is admin, first delete related boss_timers
        const { error: deleteTimersError } = await supabase
          .from('boss_timers')
          .delete()
          .eq('group_id', groupData.id);

        if (deleteTimersError) {
          console.error(deleteTimersError);
          toast({
            title: "Error",
            description: "Failed to delete group data",
            variant: "destructive",
          });
          return;
        }

        // Then delete the group itself
        const { error: deleteError } = await supabase
          .from('groups')
          .delete()
          .eq('created_by', user.id);

        if (deleteError) {
          console.error(deleteError);
          toast({
            title: "Error",
            description: "Failed to delete group",
            variant: "destructive",
          });
          return;
        }
      } else {
        // If user is not admin, just remove them from group_members
        const { error: leaveError } = await supabase
          .from('group_members')
          .delete()
          .eq('user_id', user.id);

        if (leaveError) {
          console.error(leaveError);
          toast({
            title: "Error",
            description: "Failed to leave group",
            variant: "destructive",
          });
          return;
        }
      }

      // Call onLeaveGroup before other UI updates
      onLeaveGroup();
      
      // Then update UI state
      setOpen(false);
      router.refresh();
      
      toast({
        title: groupData ? "Group deleted" : "Group left",
        description: groupData 
          ? "You have deleted the group and all its data" 
          : "You have left the group",
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
          <LogOut className="h-3 w-3 mr-1" /> Leave Group
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#0A0C1B] border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#E2E4FF]">Leave Group</AlertDialogTitle>
          <AlertDialogDescription className="text-[#B4B7E5]">
            Are you sure you want to leave this group? You will need to be invited back to rejoin.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-[#B4B7E5] hover:text-[#E2E4FF] hover:bg-[#1F2137]/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLeaveGroup}
            className="bg-red-500 hover:bg-red-600 text-white border-none"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Leave Group"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 