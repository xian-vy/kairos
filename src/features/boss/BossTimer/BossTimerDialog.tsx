'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useBossTimersStore } from "@/stores/bossTimersStore"
import { BossTimer } from '@/types/database.types'
import { useEffect, useState } from 'react'

interface BossTimerDialogProps {
  isOpen: boolean
  onClose: () => void
  bossTimer : BossTimer | null
  onTimerCreated: () => void
}

export function BossTimerDialog({ 
  isOpen, 
  onClose, 
  bossTimer,
  onTimerCreated 
}: BossTimerDialogProps) {

  const [newTimer, setNewTimer] = useState<BossTimer>({
    user_id: '',
    created_at: new Date().toISOString(),
    boss_name: '',
    location: '',
    time_of_death: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    notes: ''
  })
  const { toast } = useToast()
  const { isLoading, createOrUpdateTimer } = useBossTimersStore()

useEffect(() => {
  if (bossTimer) {
    setNewTimer(bossTimer)
  }
}, [isOpen,bossTimer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const [hours, minutes] = newTimer.time_of_death.split(':')
    const tod = new Date()
    tod.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    const newTimerFormattedTOD = {
      ...newTimer,
      time_of_death: tod.toISOString()
    }

    await createOrUpdateTimer(newTimerFormattedTOD,(options) => toast({ ...options, variant: options.variant as "default" | "destructive" }), !!newTimer.id)
    onTimerCreated()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className=" w-11/12 sm:max-w-[425px] border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-xl z-50"
        forceMount
      >
        <DialogHeader>
          <DialogTitle className="text-[#E2E4FF] text-start"> {newTimer.boss_name}</DialogTitle>
          <DialogDescription className="text-[#B4B7E5]">
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <p className="text-[#E2E4FF]">{newTimer.location}</p>
          <div className="space-y-2">
            <Label htmlFor="timeOfDeath" className="text-[#E2E4FF]">
              Time of Death <span className="text-red-500">*</span>
            </Label>
            <Input
              id="timeOfDeath"
              type="time"
              required
              value={newTimer.time_of_death}
              onChange={(e) => setNewTimer({ ...newTimer, time_of_death: e.target.value })}
              className="border-[#1F2137] text-[#E2E4FF]"
              name="timeOfDeath"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#E2E4FF]">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={newTimer.notes || ""}
              onChange={(e) => setNewTimer({ ...newTimer, notes: e.target.value })}
              className="border-[#1F2137]  text-[#E2E4FF]"
              placeholder="Add any additional notes..."
              maxLength={80}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-[#B4B7E5] hover:text-[#E2E4FF] hover:bg-[#1F2137]/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className={`hover:bg-[#3D63C9] text-white ${newTimer.id ? "bg-blue-800" : "bg-green-700"}`} 
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              {newTimer.id ? "Update Timer" : "Create Timer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}