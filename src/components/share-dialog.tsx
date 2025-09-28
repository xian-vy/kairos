'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ShareDialog = ({ open, onOpenChange }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText("https://kairos-tracker.vercel.app")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#090915] border-[#1F2137] w-11/12 sm:w-full p-8">
        <div className="flex items-center gap-2 mt-2">
          <div className="rounded  text-[#E2E4FF] text-xs sm:text-sm">
            kairos-tracker.vercel.app
          </div>
          <Button
            size="icon"
            onClick={handleCopyLink}
            variant="ghost"
            className="text-[#E2E4FF] hover:text-black"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}