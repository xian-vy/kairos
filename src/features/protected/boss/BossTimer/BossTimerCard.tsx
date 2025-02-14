'use client'

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { BossTimer } from "@/types/boss"
import { ChevronDown, Circle, MapPin, Star } from "lucide-react"
import { TimerInfo } from "./BossTimerInfo"
import { ExpandedContent } from "./BossTimerExpandedContent"
import { getPresetRespawnInterval, getTimerColor } from "../helper"

interface TimerCardProps {
  timer: BossTimer
  isExpanded: boolean
  onToggle: () => void
  onEdit: (timer: BossTimer) => void
  onDelete: (id: string) => void
}

export const TimerCard = ({ 
  timer, 
  isExpanded, 
  onToggle, 
  onEdit, 
  onDelete 
}: TimerCardProps) => (
  <Card className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
    <CardContent className="py-3">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Circle className={`h-3 w-3 text-[#E2E4FF] ${getTimerColor(timer.time_of_death, getPresetRespawnInterval(timer.boss_name))}`} />
              <h3 className="!text-sm font-semibold text-[#E2E4FF]">{timer.boss_name}</h3>
              {timer.notes && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
            </div>
            <p className="text-xs text-[#B4B7E5] flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> {timer.location}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <TimerInfo timer={timer} />
          <ChevronDown 
            className={cn(
              "h-4 w-4 text-[#B4B7E5] transition-transform",
              isExpanded && "transform rotate-180"
            )}
          />
        </div>
      </div>

      {isExpanded && (
        <ExpandedContent 
          timer={timer}
          onEdit={() => onEdit(timer)}
          onDelete={() => onDelete(timer.id)}
        />
      )}
    </CardContent>
  </Card>
) 