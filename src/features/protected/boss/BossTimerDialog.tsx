'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/ui/icons"
import { createDateFromTimeString } from './helper'

interface BossTimerDialogProps {
  isOpen: boolean
  onClose: () => void
  bossName: string
  locations: string[]
  onTimerCreated: () => void
}

export function BossTimerDialog({ 
  isOpen, 
  onClose, 
  bossName, 
  locations,
  onTimerCreated 
}: BossTimerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [timeOfDeath, setTimeOfDeath] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  })
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const { toast } = useToast()
  const supabase = createClientComponentClient()

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!location || !timeOfDeath) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const deathDateTime = createDateFromTimeString(timeOfDeath)

      const { error } = await supabase
        .from('boss_timers')
        .insert({
          user_id: user.id,
          boss_name: bossName,
          location: location,
          time_of_death: deathDateTime.toISOString(),
          notes: notes,
        })

      if (error) throw error

      toast({
        title: "Timer Created",
        description: `Successfully registered timer for ${bossName}`,
      })
      
      onTimerCreated()
      onClose()
      setTimeOfDeath('')
      setLocation('')
      setNotes('')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to create timer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px] border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-xl z-50"
        forceMount
      >
        <DialogHeader>
          <DialogTitle className="text-[#E2E4FF]"> {bossName}</DialogTitle>
          <DialogDescription className="text-[#B4B7E5]">
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#E2E4FF]">
              Location <span className="text-red-500">*</span>
            </Label>
            <Select
              value={location}
              onValueChange={setLocation}
              name="location"
              required
            >
              <SelectTrigger className="text-[#E2E4FF]" id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent 
                ref={(ref) => {
                  if (ref) {
                    ref.style.zIndex = '9999'
                    ref.style.position = 'relative'
                  }
                }}
                position="popper"
                sideOffset={5}
                style={{ position: 'fixed' }}
              >
                <div className="max-h-[200px] overflow-y-auto">
                  {locations.map((loc) => (
                    <SelectItem 
                      key={loc} 
                      value={loc}
                      className="text-[#E2E4FF] focus:bg-[#1F2137] focus:text-[#E2E4FF]"
                    >
                      {loc}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeOfDeath" className="text-[#E2E4FF]">
              Time of Death <span className="text-red-500">*</span>
            </Label>
            <Input
              id="timeOfDeath"
              type="time"
              required
              value={timeOfDeath}
              onChange={(e) => setTimeOfDeath(e.target.value)}
              className="border-[#1F2137] text-[#E2E4FF]"
              name="timeOfDeath"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#E2E4FF]">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-[#1F2137]  text-[#E2E4FF]"
              placeholder="Add any additional notes..."
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
              className="bg-[#4B79E4] hover:bg-[#3D63C9] text-white"
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Create Timer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 