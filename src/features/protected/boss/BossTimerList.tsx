'use client'

import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils'
import type { BossTimer } from '@/types/boss'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChevronDown, Circle, MapPin, Star, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FaSkullCrossbones } from 'react-icons/fa'
import { formatTimeLeft, getPresetRespawnInterval, getTimerColor } from "./helper"


export function BossTimerList() {
  const [timers, setTimers] = useState<BossTimer[]>([])
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [, forceUpdate] = useState({})
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

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({})
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }


  // Filter out elapsed timers and sort remaining ones
  const activeTimers = timers
    .filter(timer => {
      const timeLeft = formatTimeLeft(
        timer.time_of_death, 
        getPresetRespawnInterval(timer.boss_name)
      )
      return timeLeft !== null
    })
    .sort((a, b) => new Date(a.time_of_death).getTime() - new Date(b.time_of_death).getTime())

  if (activeTimers.length === 0) return null

  return (
    <div className="space-y-2">
      {activeTimers.map((timer) => (
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
                    <Circle className={`h-3 w-3 text-[#E2E4FF] ${getTimerColor(timer.time_of_death, getPresetRespawnInterval(timer.boss_name))}`} />
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
                  <div className="flex items-center gap-2 text-[#B4B7E5]">
                    <Timer className="h-3 w-3" />
                    <span>
                      {formatTimeLeft(
                        timer.time_of_death, 
                        getPresetRespawnInterval(timer.boss_name),
                        true
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#B4B7E5] mt-1">
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