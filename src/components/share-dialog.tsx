'use client'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#090915] border-[#1F2137] w-11/12 sm:w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#E2E4FF]">Share Kairos</AlertDialogTitle>
         
            <div className="flex items-center gap-2 mt-2">
              <div className=" p-1 sm:p-2 rounded flex-1 text-[#E2E4FF] text-xs sm:text-sm">
                kairos-tracker.vercel.app
              </div>
              <Button
                onClick={handleCopyLink}
                variant="ghost"
                className="text-[#E2E4FF] hover:text-black !p-2"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#090915] text-[#B4B7E5] mt-0 hover:bg-[#2A2D4B] hover:text-[#E2E4FF] border-none max-w-[120px] self-end">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}