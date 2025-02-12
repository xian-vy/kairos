'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BOSSDATA_NIGHTCROWS } from "@/lib/data/presets"
import { Info, MapPin } from "lucide-react"
import { useState, useEffect } from 'react'
import { FaSkull } from "react-icons/fa"
import { BossTimerDialog } from './BossTimerDialog'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getBossKillCount, getKillCountColor } from './helper'

export function BossList() {
  const [selectedBoss, setSelectedBoss] = useState<{ 
    name: string; 
    respawnInterval: number;
    locations: string[];
    selectedLocation?: string;
  } | null>(null)
  
  const [killCounts, setKillCounts] = useState<Record<string, { 
    current: number, 
    total: number 
  }>>({})
  
  const supabase = createClientComponentClient()

  const refreshKillCounts = async () => {
    const counts: Record<string, { current: number, total: number }> = {}
    
    for (const boss of BOSSDATA_NIGHTCROWS) {
      const count = await getBossKillCount(boss.name, supabase)
      counts[boss.name] = {
        current: count.currentKills,
        total: count.totalRequired
      }
    }
    
    setKillCounts(counts)
  }

  useEffect(() => {
    refreshKillCounts()
    
    // Refresh kill counts when a new timer is created
    window.addEventListener('bossTimerCreated', refreshKillCounts)
    return () => {
      window.removeEventListener('bossTimerCreated', refreshKillCounts)
    }
  }, [])

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">World Bosses</h2>
        <p className="text-[#B4B7E5] text-sm flex items-center gap-1.5">
            <Info className="h-4 w-4" /> Click on a boss to create a timer for their next spawn      
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
                  <FaSkull className="h-4 w-4 fill-red-800" /> 
                  <div className="flex items-center gap-2">
                    {boss.name}
                    <span 
                      className={`text-xs ${getKillCountColor(
                        killCounts[boss.name]?.current || 0, 
                        killCounts[boss.name]?.total || boss.respawnCount
                      )}`}
                    >
                      ({killCounts[boss.name]?.current || 0}/{killCounts[boss.name]?.total || boss.respawnCount})
                    </span>
                  </div>
                </span>
                <Badge 
                  variant="secondary" 
                  className="bg-[#1F2137] text-[#B4B7E5]"
                >
                  {boss.respawnInterval}h
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-[#B4B7E5]">
                Spawns <span className="font-extrabold">{boss.respawnCount}x</span> every <span className="font-extrabold">{boss.respawnInterval} {boss.respawnInterval === 1 ? 'hour' : 'hours'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[120px] w-full rounded-md pr-4">
                <div className="space-y-2.5">
                  {boss.locations.map((location) => (
                    <div
                      key={location}
                      className="flex hover:underline items-center gap-2 text-sm text-[#B4B7E5] group-hover:text-[#E2E4FF] transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBoss({ 
                          name: boss.name, 
                          respawnInterval: boss.respawnInterval,
                          locations: boss.locations,
                          selectedLocation: location
                        })
                      }}
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
        selectedLocation={selectedBoss?.selectedLocation}
        onTimerCreated={() => {
          const event = new Event('bossTimerCreated')
          window.dispatchEvent(event)
          refreshKillCounts()
          setSelectedBoss(null)
        }}
      />
    </div>
  )
} 