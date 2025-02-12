'use client'

import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils'
import type { BossTimer } from '@/types/boss'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChevronDown, MapPin, Star, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FaSkullCrossbones } from 'react-icons/fa'

function formatTimeLeft(timeOfDeath: string, respawnInterval: number): string {
  const now = new Date()
  const deathTime = new Date(timeOfDeath)
  
  if (isNaN(deathTime.getTime())) return 'Invalid time'
  
  // Calculate how many intervals have passed since death
  const timeSinceDeath = now.getTime() - deathTime.getTime()
  const intervalsPassed = Math.floor(timeSinceDeath / (respawnInterval * 60 * 1000))
  
  // Calculate next spawn time by adding intervals to death time
  const nextSpawn = new Date(deathTime.getTime() + (intervalsPassed + 1) * respawnInterval * 60 * 1000)
  const timeUntilSpawn = nextSpawn.getTime() - now.getTime()
  
  if (timeUntilSpawn <= 0) return 'Ready to spawn!'
  
  const hours = Math.floor(timeUntilSpawn / (1000 * 60 * 60))
  const minutes = Math.floor((timeUntilSpawn % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}

export function BossTimerList() {
  const [timers, setTimers] = useState<BossTimer[]>([])
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchTimers = async () => {
      const { data, error } = await supabase
        .from('boss_timers')
        .select('*')

      if (error) {
        toast({
          title: "Error fetching timers",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setTimers(data)
      }
    }

    fetchTimers()

    const subscription = supabase
      .channel('boss_timers')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'boss_timers' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setTimers((prev) => [...prev, payload.new as BossTimer])
              break
            case 'UPDATE':
              setTimers((prev) => prev.map(timer => timer.id === payload.new.id ? payload.new as BossTimer : timer))
              break
            case 'DELETE':
              setTimers((prev) => prev.filter(timer => timer.id !== payload.old.id))
              break
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, toast])

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  if (timers.length === 0) return null

  return (
    <div className="space-y-2">
      {timers.map((timer) => (
        <Card 
          key={timer.id} 
          className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm"
        >
          <CardContent className="py-3">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleCard(timer.id)}
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                     <h3 className="!text-sm font-semibold text-[#E2E4FF]">{timer.boss_name}</h3>
                     {timer.notes &&
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      }
                  </div>
                  <p className="text-xs text-[#B4B7E5] flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {timer.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2 text-[#4B79E4]">
                    <Timer className="h-4 w-4" />
                    <span>{formatTimeLeft(timer.time_of_death, 12)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#B4B7E5] mt-1">
                    <FaSkullCrossbones className="h-3 w-3 fill-red-800" />
                    <span>
                      {new Date(timer.time_of_death).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
            
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 text-[#B4B7E5] transition-transform",
                      expandedCards[timer.id] && "transform rotate-180"
                    )}
                  />
                
              </div>
            </div>
            {timer.notes && expandedCards[timer.id] && (
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