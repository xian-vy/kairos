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

interface DeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export const DeleteDialog = ({ isOpen, onOpenChange, onConfirm }: DeleteDialogProps) => (
  <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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
          onClick={onConfirm}
          className="bg-red-700 text-white hover:bg-red-600"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
) 