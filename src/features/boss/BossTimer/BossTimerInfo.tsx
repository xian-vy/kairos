import { cn } from "@/lib/utils"
import type { BossTimer } from "@/types/database.types"
import { Timer } from "lucide-react"
import { FaSkullCrossbones } from "react-icons/fa"
import { formatTimeLeft, getPresetRespawnInterval } from "../helper"
import { BOSSDATA_TYPE } from "@/lib/data/presets"

interface TimerInfoProps {
  timer: BossTimer
  bossData : BOSSDATA_TYPE[]
}

export const TimerInfo = ({ timer ,bossData}: TimerInfoProps) => {
  const respawnTime = new Date(timer.time_of_death).getTime() + 
    (getPresetRespawnInterval(timer.boss_name,bossData) * 60 * 60 * 1000)
  const hasRespawned = new Date().getTime() > respawnTime

  return (
    <div className="text-right shrink-0">
      <div className={cn(
        "flex items-center gap-2",
        hasRespawned ? "text-green-500" : "text-[#B4B7E5]"
      )}>
        <Timer className="h-3 w-3" />
        <span>
          {formatTimeLeft(
            timer.time_of_death, 
            getPresetRespawnInterval(timer.boss_name,bossData),
            true
          )}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-[#B4B7E5] mt-1 min-w-[95px]">
        <FaSkullCrossbones className="h-3 w-3" />
        <span>
          {new Date(timer.time_of_death).toLocaleString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </span>
      </div>
    </div>
  )
} 