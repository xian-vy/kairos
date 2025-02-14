import type { BossTimer } from "@/types/boss"
import { Pencil, Trash2 } from "lucide-react"

interface ExpandedContentProps {
  timer: BossTimer
  onEdit: () => void
  onDelete: () => void
}

export const ExpandedContent = ({ 
  timer, 
  onEdit, 
  onDelete 
}: ExpandedContentProps) => (
  <div className="mt-2 space-y-2">
    {timer.notes && (
      <p className="text-sm text-[#B4B7E5] italic">{timer.notes}</p>
    )}
    <div className="flex justify-end gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
        className="p-1 hover:bg-[#1F2137] rounded-md transition-colors"
      >
        <Pencil strokeWidth={1.5} className="h-4 w-4 text-[#B4B7E5]" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="p-1 hover:bg-[#1F2137] rounded-md transition-colors"
      >
        <Trash2 strokeWidth={1.5} className="h-4 w-4 text-[#B4B7E5]" />
      </button>
    </div>
  </div>
) 