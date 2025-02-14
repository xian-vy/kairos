'use client'

import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils'
import type { BossTimer } from '@/types/boss'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChevronDown, Circle, MapPin, Star, Timer, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FaSkullCrossbones } from 'react-icons/fa'
import { formatTimeLeft, getPresetRespawnInterval, getTimerColor } from "./helper"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BossTimerDialog } from "./BossTimerDialog"
import { BOSSDATA_NIGHTCROWS } from "@/lib/data/presets"

export function BossTimerList() {
  const [timers, setTimers] = useState<BossTimer[]>([])
  const [userGroupId, setUserGroupId] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [, forceUpdate] = useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [timerToDelete, setTimerToDelete] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [timerToEdit, setTimerToEdit] = useState<BossTimer | null>(null)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUserGroupAndTimers = async () => {
      // Get current user's group
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user's group membership
      const { data: groupMember } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .single()

      if (groupMember) {
        setUserGroupId(groupMember.group_id)
        
        // Fetch timers for the user's group
        const { data: timerData, error } = await supabase
          .from('boss_timers')
          .select('*')
          .eq('group_id', groupMember.group_id)

        if (error) {
          toast({
            title: "Error fetching timers",
            description: error.message,
            variant: "destructive",
          })
        } else {
          setTimers(timerData)
        }
      }
    }

    fetchUserGroupAndTimers()

    // Update subscription to filter by group_id
    const subscription = supabase
      .channel('boss_timers')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'boss_timers',
          filter: userGroupId ? `group_id=eq.${userGroupId}` : undefined
        },
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

  // Sort timers - respawned ones first, then by time of death
  const activeTimers = timers
    .sort((a, b) => {
      const aSpawnTime = new Date(a.time_of_death).getTime() + (getPresetRespawnInterval(a.boss_name) * 60 * 60 * 1000)
      const bSpawnTime = new Date(b.time_of_death).getTime() + (getPresetRespawnInterval(b.boss_name) * 60 * 60 * 1000)
      const now = new Date().getTime()
      
      // If both have passed or both haven't passed, sort by time of death (most recent first)
      if ((aSpawnTime < now && bSpawnTime < now) || (aSpawnTime >= now && bSpawnTime >= now)) {
        return new Date(b.time_of_death).getTime() - new Date(a.time_of_death).getTime()
      }
      
      // Put respawned ones first
      return aSpawnTime < now ? -1 : 1
    })

  const handleDelete = async (id: string) => {
    setTimerToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!timerToDelete) return

    const { error } = await supabase
      .from('boss_timers')
      .delete()
      .eq('id', timerToDelete)

    if (error) {
      toast({
        title: "Error deleting timer",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Timer deleted",
        description: "The timer has been deleted successfully",
      })
    }
    setDeleteDialogOpen(false)
    setTimerToDelete(null)
  }

  const handleEdit = (timer: BossTimer) => {
    // Get all locations for this boss
    const bossData = BOSSDATA_NIGHTCROWS.find(boss => boss.name === timer.boss_name)
    const allLocations = bossData?.locations || [timer.location]
    
    setTimerToEdit({
      ...timer,
      // Add locations to the timer object
      allLocations
    })
    setEditDialogOpen(true)
  }

  return (
    <>
      <div className="space-y-2">
        {activeTimers.length === 0 ? (
          <p className="text-center text-[#B4B7E5] py-4">No active timers</p>
        ) : (
          activeTimers.map((timer) => (
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
                      <div className={cn(
                        "flex items-center gap-2",
                        new Date().getTime() > new Date(timer.time_of_death).getTime() + (getPresetRespawnInterval(timer.boss_name) * 60 * 60 * 1000)
                          ? "text-green-500"
                          : "text-[#B4B7E5]"
                      )}>
                        <Timer className="h-3 w-3" />
                        <span>
                          {formatTimeLeft(
                            timer.time_of_death, 
                            getPresetRespawnInterval(timer.boss_name),
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
                    
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 text-[#B4B7E5] transition-transform",
                        expandedCards[timer.id] && "transform rotate-180"
                      )}
                    />
                  </div>
                </div>
                {expandedCards[timer.id] && (
                  <div className="mt-2 space-y-2">
                    {timer.notes && (
                      <p className="text-sm text-[#B4B7E5] italic">
                        {timer.notes}
                      </p>
                    )}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(timer)
                        }}
                        className="p-1 hover:bg-[#1F2137] rounded-md transition-colors"
                      >
                        <Pencil strokeWidth={1.5} className="h-4 w-4 text-[#B4B7E5]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(timer.id)
                        }}
                        className="p-1 hover:bg-[#1F2137] rounded-md transition-colors"
                      >
                        <Trash2 strokeWidth={1.5} className="h-4 w-4 text-[#B4B7E5]" />
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#090915] border-[#1F2137]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#E2E4FF]">Delete Timer</AlertDialogTitle>
            <AlertDialogDescription className="text-[#B4B7E5]">
              Are you sure you want to delete this timer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#090915] text-[#B4B7E5] hover:bg-[#2A2D4B] hover:text-[#E2E4FF] border-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-700 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {timerToEdit && (
        <BossTimerDialog
          isOpen={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false)
            setTimerToEdit(null)
          }}
          bossName={timerToEdit.boss_name}
          locations={timerToEdit.allLocations || [timerToEdit.location]}
          selectedLocation={timerToEdit.location}
          initialNotes={timerToEdit.notes || ''}
          initialTimeOfDeath={new Date(timerToEdit.time_of_death).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          timerId={timerToEdit.id}
          onTimerCreated={() => {
            setEditDialogOpen(false)
            setTimerToEdit(null)
          }}
        />
      )}
    </>
  )
} 