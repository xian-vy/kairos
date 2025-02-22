'use client'
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
import { Loader2 } from "lucide-react"

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

const SignOutDialog = ({ open, onOpenChange, onConfirm, isPending }: SignOutDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#090915] border-[#1F2137]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#E2E4FF]">Sign Out</AlertDialogTitle>
          <AlertDialogDescription className="text-[#B4B7E5]">
            Are you sure you want to sign out?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row w-full justify-between items-center">
          <AlertDialogCancel 
            className="bg-[#090915] text-[#B4B7E5] mt-0 hover:bg-[#2A2D4B] hover:text-[#E2E4FF] border-none"
            disabled={isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-700 h-8 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Sign Out'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SignOutDialog