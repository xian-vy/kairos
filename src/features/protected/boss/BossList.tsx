'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BOSSDATA_NIGHTCROWS } from "@/lib/data/presets"
import { MapPin } from "lucide-react"
import { useState } from 'react'
import { FaSkull } from "react-icons/fa"
import { BossTimerDialog } from './BossTimerDialog'

export function BossList() {
  const [selectedBoss, setSelectedBoss] = useState<{ 
    name: string; 
    respawnInterval: number;
    locations: string[];
  } | null>(null)

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">World Bosses</h2>
        <p className="text-muted-foreground">
          Track and monitor Night Crows world boss spawns
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {BOSSDATA_NIGHTCROWS.map((boss) => (
          <Card 
            key={boss.name} 
            className="group hover:shadow-lg transition-all duration-300 border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedBoss({ 
              name: boss.name, 
              respawnInterval: boss.respawnInterval,
              locations: boss.locations
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-[#E2E4FF]">
                <span className="group-hover:text-[#4B79E4] transition-colors text-base flex items-center gap-2" >
                  <FaSkull className="h-4 w-4 fill-red-800" /> {boss.name}
                </span>
                <Badge 
                  variant="secondary" 
                  className="bg-[#1F2137] text-[#B4B7E5]"
                >
                  {boss.respawnInterval}h
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm text-[#B4B7E5]">
                Spawns {boss.respawnCount}x every {boss.respawnInterval} hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[120px] w-full rounded-md pr-4">
                <div className="space-y-2.5">
                  {boss.locations.map((location) => (
                    <div
                      key={location}
                      className="flex items-center gap-2 text-sm text-[#B4B7E5] group-hover:text-[#E2E4FF] transition-colors"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-xs">{location}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>

      <BossTimerDialog
        isOpen={!!selectedBoss}
        onClose={() => setSelectedBoss(null)}
        bossName={selectedBoss?.name ?? ''}
        locations={selectedBoss?.locations ?? []}
        onTimerCreated={() => {
          // This will trigger a refresh of the timer list
          const event = new Event('bossTimerCreated')
          window.dispatchEvent(event)
        }}
      />
    </div>
  )
} 