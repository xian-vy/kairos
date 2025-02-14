'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/ui/icons"

interface BossTimerDialogProps {
  isOpen: boolean
  onClose: () => void
  bossName: string
  locations: string[]
  selectedLocation?: string
  initialNotes?: string
  initialTimeOfDeath?: string
  timerId?: string
  onTimerCreated: () => void
}

export function BossTimerDialog({ 
  isOpen, 
  onClose, 
  bossName, 
  locations,
  selectedLocation,
  initialNotes = '',
  initialTimeOfDeath,
  timerId,
  onTimerCreated 
}: BossTimerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [timeOfDeath, setTimeOfDeath] = useState(() => 
    initialTimeOfDeath || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  )
  const [location, setLocation] = useState(selectedLocation || '')
  const [notes, setNotes] = useState(initialNotes)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (selectedLocation) {
      setLocation(selectedLocation)
    } else {
      setLocation(locations[0])
    }
  }, [selectedLocation, locations])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const [hours, minutes] = timeOfDeath.split(':')
      const tod = new Date()
      tod.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      // Get the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error("User not authenticated")


      // Fetch the user's group_id with debug logging
      const { data: group_members, error: groupError } = await supabase
        .from('group_members')
        .select('group_id') 
        .eq('user_id', user.id)
        .single();


      if (groupError) throw new Error("Group Fetch Error: " + groupError.message);
      if (!group_members || !group_members) throw new Error("No group found for the user");

      const timerData = {
        boss_name: bossName,
        location,
        time_of_death: tod.toISOString(),
        notes: notes || null,
        user_id: user.id,
        group_id: group_members.group_id
      }
  
      let error
      if (timerId) {
        // Update existing timer
        ({ error } = await supabase
          .from('boss_timers')
          .update(timerData)
          .eq('id', timerId))
      } else {
        // Create new timer
        ({ error } = await supabase
          .from('boss_timers')
          .insert([timerData]))
      }
  
      if (error) throw error
  
      toast({
        title: timerId ? "Timer updated" : "Timer created",
        description: timerId ? "The timer has been updated successfully" : "The timer has been created successfully",
      })
      onTimerCreated()
    } catch (error: Error | unknown) {
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        fullError: error
      });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
              className={`hover:bg-[#3D63C9] text-white ${timerId ? "bg-blue-800" : "bg-green-700"}`} 
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              {timerId ? "Update Timer" : "Create Timer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 