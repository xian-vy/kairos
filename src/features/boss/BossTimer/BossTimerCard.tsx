"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BOSSDATA_TYPE } from "@/lib/data/presets";
import { cn } from "@/lib/utils";
import { useGroupMembersStore } from "@/stores/groupMembersStore";
import type { BossTimer } from "@/types/database.types";
import { ChevronDown, Circle, MapPin, NotebookPen } from "lucide-react";
import { getPresetRespawnInterval, getTimerColor } from "../helper";
import { ExpandedContent } from "./BossTimerExpandedContent";
import { TimerInfo } from "./BossTimerInfo";

interface TimerCardProps {
  timer: BossTimer;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (timer: BossTimer) => void;
  onDelete: (id: string) => void;
  bossData : BOSSDATA_TYPE[]
}

export const TimerCard = ({ timer, isExpanded, onToggle, onEdit, onDelete,bossData }: TimerCardProps) => {

  const {members} = useGroupMembersStore();

  const user  = members.find((user) => user.id === timer.user_id);
  return(
  <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
    <CardContent className="py-3 px-5 sm:px-6">
      <div className="flex flex-col gap-1 items-start justify-start sm:flex-row sm:items-center sm:justify-between cursor-pointer w-full" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Circle
                className={`h-3 w-3 text-[#E2E4FF] ${getTimerColor(
                  timer.time_of_death,
                  getPresetRespawnInterval(timer.boss_name,bossData)
                )}`}
              />
              <h3 className="!text-sm font-semibold text-[#E2E4FF]">{timer.boss_name}</h3>
              {user && (
                <span className="text-xs text-[#B4B7E5] flex items-center gap-1">• by {user.username}</span>
              )}
              {timer.notes && <NotebookPen strokeWidth={1.5} className="h-3.5 w-3.5 text-[#E2E4FF]" />}
            </div>
            <p className="text-xs text-[#B4B7E5] flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> {timer.location}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-4">
          <TimerInfo timer={timer} bossData={bossData} />
          <ChevronDown
            className={cn("h-4 w-4 text-[#B4B7E5] transition-transform", isExpanded && "transform rotate-180")}
          />
        </div>
      </div>

      {isExpanded && <ExpandedContent timer={timer} onEdit={() => onEdit(timer)} onDelete={() => onDelete(timer.id!)} />}
    </CardContent>
  </Card>
)};
