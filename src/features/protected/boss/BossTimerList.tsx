'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { BossTimer } from '@/types/boss'
import { Timer, Skull } from 'lucide-react'

function formatTimeLeft(nextSpawn: string): string {
  const now = new Date()
  const spawnTime = new Date(nextSpawn)
  const diff = spawnTime.getTime() - now.getTime()
  
  if (diff <= 0) return 'Ready to spawn!'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}

export function BossTimerList() {
  const [timers, setTimers] = useState<BossTimer[]>([])
  const supabase = createClientComponentClient()

  const fetchTimers = async () => {
    const { data, error } = await supabase
      .from('boss_timers')
      .select('*')
      .order('next_spawn', { ascending: true })

    if (!error && data) {
      setTimers(data)
    }
  }

  useEffect(() => {
    fetchTimers()
    
    // Refresh timers every minute
    const interval = setInterval(fetchTimers, 60000)
    return () => clearInterval(interval)
  }, [])

  if (timers.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {timers.map((timer) => (
        <Card 
          key={timer.id} 
          className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm"
        >
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#E2E4FF]">{timer.boss_name}</h3>
                <p className="text-sm text-[#B4B7E5]">{timer.location}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-[#4B79E4]">
                  <Timer className="h-4 w-4" />
                  <span>{formatTimeLeft(timer.next_spawn)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#B4B7E5] mt-1">
                  <Skull className="h-3 w-3" />
                  <span>{new Date(timer.time_of_death).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            {timer.notes && (
              <p className="text-sm text-[#B4B7E5] mt-2 italic">
                {timer.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 