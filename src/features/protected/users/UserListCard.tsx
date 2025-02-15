import { User, Check, X, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GroupMember } from "@/hooks/useGroupMembers";

interface UserListCardProps {
  member: GroupMember;
  isAdmin: boolean;
  currentUserId: string | undefined;
  onUpdateStatus: (userId: string, status: "accepted" | "pending") => void;
}

export const UserListCard = ({ member, isAdmin, currentUserId, onUpdateStatus }: UserListCardProps) => (
  <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
    <CardContent className="py-3 px-3 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#E2E4FF]" />
              <h3 className="!text-sm font-semibold text-[#E2E4FF]">{member.users.display_name || "No name"}</h3>
            </div>
            <div className="flex items-center gap-1">
              {isAdmin && member.user_id === currentUserId && (
                <Crown className="h-3 w-3 fill-yellow-500 text-yellow-600" />
              )}
              <p className="text-xs text-[#B4B7E5]">
                {isAdmin && member.user_id === currentUserId ? "Admin" : "Member"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && member.user_id !== currentUserId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateStatus(member.user_id, member.users.status === "pending" ? "accepted" : "pending")}
              className="h-8 px-2 text-[#B4B7E5] hover:text-[#E2E4FF]"
            >
              {member.users.status === "pending" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          )}
          <Badge
            variant={member.users.status === "accepted" ? "default" : "secondary"}
            className={
              member.users.status === "accepted"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-[#1F2137] hover:bg-[#2A2D4B] text-[#B4B7E5]"
            }
          >
            {member.users.status}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);
