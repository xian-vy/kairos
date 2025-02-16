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
import useScreenSize from "@/hooks/useScreensize";
import { useBossDataStore } from "@/stores/bossDataStore";
import { useGroupMembersStore } from "@/stores/groupMembersStore";
import type { Database } from "@/types/database.types";
import { Eye, EyeOff, Loader2, Lock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LeaveGroupDialog({
  onLeaveGroup,
  group,
}: {
  onLeaveGroup: () => void;
  group: Database["public"]["Tables"]["groups"]["Row"];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { currentUser } = useCurrentUser();
  const isAdmin = group?.created_by === currentUser?.id;
  const [showPassword, setShowPassword] = useState(false);
  const { leaveGroup } = useGroupMembersStore();
  const {setBossData} = useBossDataStore();
 const screenSize = useScreenSize();
  const handleLeaveGroup = async () => {
    await leaveGroup(group, onLeaveGroup, password, setPassword, setIsLoading, isAdmin,(options) => toast({ ...options, variant: options.variant as "default" | "destructive" }));
    router.refresh();
    setBossData([]);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild className="px-0">
        <Button variant="ghost" className="text-xs text-[#B4B7E5] hover:bg-red-500 hover:text-white px-2">
          {screenSize === "desktop" && "Leave Group"} <LogOut strokeWidth={1.5} className="h-3 w-3" />
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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-black/20 border-gray-800 text-white pr-10"
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
