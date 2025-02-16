import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGroupMembersStore } from "@/stores/groupMembersStore";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface JoinGroupDialogProps {
  variant?: "default" | "welcome";
}

export function JoinGroupDialog({  variant = "default" }: JoinGroupDialogProps) {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinGroupName, setJoinGroupName] = useState("");
  const { addUserToGroup } = useGroupMembersStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const joinGroup = async () => {
    setIsLoading(true);
    await addUserToGroup(joinGroupName,  (options) => toast({ ...options, variant: options.variant as "default" | "destructive" }));
    setIsLoading(false);
    setShowJoinForm(false);
    setJoinGroupName("");
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
