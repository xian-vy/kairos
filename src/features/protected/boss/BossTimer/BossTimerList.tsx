'use client'

import { useToast } from "@/hooks/use-toast"
import type { BossTimer } from '@/types/boss'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { BossTimerDialog } from "./BossTimerDialog"
import { DeleteDialog } from "./BossTimerDeleteDialog"
import { TimerCard } from "./BossTimerCard"
import { enrichTimerWithLocations, sortTimers } from "../helper"
import { useUserGroup } from "@/hooks/useUserGroup"

export function BossTimerList() {
  const [timers, setTimers] = useState<BossTimer[]>([])
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [, forceUpdate] = useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [timerToDelete, setTimerToDelete] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [timerToEdit, setTimerToEdit] = useState<BossTimer | null>(null)
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const { group } = useUserGroup()

  useEffect(() => {
    const fetchTimers = async () => {
      if (!group?.id) return;

      const { data: timerData, error } = await supabase
        .from('boss_timers')
        .select(`
          *,
          users:user_id (
            id,
            username,
            email,
            group_id
          )
        `)
        .eq('users.group_id', group.id)
        .eq('users.status', 'accepted')

      if (error) {
        toast({
          title: "Error fetching timers",
          description: error.message,
          variant: "destructive",
        })
      } else {
        // Transform the data to match our BossTimer type
        const transformedTimers = timerData.map(timer => ({
          ...timer,
          users: Array.isArray(timer.users) ? timer.users[0] : timer.users
        }))
        console.log(transformedTimers)
        setTimers(transformedTimers)
      }
    }

    fetchTimers()

    // Update subscription to filter by user's group
    const subscription = supabase
      .channel('boss_timers')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'boss_timers'
          // Remove group_id filter as it's now handled through the join
        },
        async (payload) => {
          if (!group?.id) return;
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const { data: timer, error } = await supabase
              .from('boss_timers')
              .select(`
                *,
                users:user_id (
                  id,
                  username,
                  email,
                  group_id
                )
              `)
              .eq('id', payload.new.id)
              .eq('users.group_id', group.id)
              .eq('users.status', 'accepted')
              .single()

            if (!error && timer) {
              const transformedTimer = {
                ...timer,
                users: Array.isArray(timer.users) ? timer.users[0] : timer.users
              }
              
              switch (payload.eventType) {
                case 'INSERT':
                  setTimers((prev) => [...prev, transformedTimer])
                  break
                case 'UPDATE':
                  setTimers((prev) => prev.map(t => t.id === transformedTimer.id ? transformedTimer : t))
                  break
              }
            }
          } else if (payload.eventType === 'DELETE') {
            setTimers((prev) => prev.filter(timer => timer.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, toast, group])

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

  const activeTimers = sortTimers(timers)

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
    setTimerToEdit(enrichTimerWithLocations(timer))
    setEditDialogOpen(true)
  }

  return (
    <>
      <div className="space-y-2">
        {activeTimers.length === 0 ? (
          <p className="text-center text-[#B4B7E5] py-4">No active timers</p>
        ) : (
          activeTimers.map((timer) => (
            <TimerCard 
              key={timer.id} 
              timer={timer}
              isExpanded={expandedCards[timer.id] || false}
              onToggle={() => toggleCard(timer.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <DeleteDialog 
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />

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