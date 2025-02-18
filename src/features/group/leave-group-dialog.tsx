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
import { useBossDataStore } from "@/stores/bossDataStore";
import { useGroupMembersStore } from "@/stores/groupMembersStore";
import type { Database } from "@/types/database.types";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

export function LeaveGroupDialog({
  group,
}: {
  group: Database["public"]["Tables"]["groups"]["Row"];
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { currentUser } = useCurrentUser();
  const isAdmin = group?.created_by === currentUser?.id;
  const [showPassword, setShowPassword] = useState(false);
  const { leaveGroup } = useGroupMembersStore();
  const {setBossData} = useBossDataStore();
  const handleLeaveGroup = async () => {
    await leaveGroup(group,  password, setPassword, setIsLoading, isAdmin,(options) => toast({ ...options, variant: options.variant as "default" | "destructive" }));
    window.location.reload();
    setBossData([]);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild className="px-0">
        <Button variant="ghost" className="text-[0.7rem] font-normal h-5 text-slate-500 hover:bg-red-500 hover:text-white px-2">
           Leave Group
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#0A0C1B] border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#E2E4FF]">{isAdmin ? "Delete Group" : "Leave Group"}</AlertDialogTitle>
          {isAdmin ? (
            <div className="space-y-4 text-sm">
              <div className="text-red-400 text-xs sm:text-[0.8rem] lg:text-sm">
                You are the admin of this group. Deleting the group will delete all related data including all boss
                timers and group members.
              </div>
              <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password to Delete Group"
                    className="bg-black/20 border-gray-800 text-white pr-10 placeholder:text-xs placeholder:text-[#B4B7E5] "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff strokeWidth={1.5} className="h-4 w-4" />
                    ) : (
                      <Eye strokeWidth={1.5} className="h-4 w-4" />
                    )}
                  </button>
              </div>
            </div>
          ) : (
            <AlertDialogDescription className="text-[#B4B7E5]">
              Are you sure you want to leave this group? You will need to rejoin.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
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
