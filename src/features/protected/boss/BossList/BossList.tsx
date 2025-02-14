'use client'

import { BOSSDATA_NIGHTCROWS } from "@/lib/data/presets"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Info } from "lucide-react"
import { useEffect, useState } from 'react'
import { BossTimerDialog } from '../BossTimer/BossTimerDialog'
import { getBossKillCount } from '../helper'
import { BossListCard } from './BossListCard'

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
  }, [refreshKillCounts])

  return (
    <div className="p-4 space-y-6">
        <p className="text-[#B4B7E5] text-xs flex items-center gap-1.5 ">
            <Info className="h-4 w-4" /> Click on a boss to create a timer for their next spawn      
        </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {BOSSDATA_NIGHTCROWS.map((boss) => (
          <BossListCard
            key={boss.name}
            boss={boss}
            killCount={killCounts[boss.name]}
            onBossSelect={(name, respawnInterval, locations) => 
              setSelectedBoss({ name, respawnInterval, locations })
            }
            onLocationSelect={(name, respawnInterval, locations, selectedLocation) =>
              setSelectedBoss({ name, respawnInterval, locations, selectedLocation })
            }
          />
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