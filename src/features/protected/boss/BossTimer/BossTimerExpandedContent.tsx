import type { BossTimer } from "@/types/boss";
import { NotebookPen, Pencil, Trash2 } from "lucide-react";

interface ExpandedContentProps {
  timer: BossTimer;
  onEdit: () => void;
  onDelete: () => void;
}

export const ExpandedContent = ({ timer, onEdit, onDelete }: ExpandedContentProps) => (
  <div className="mt-4 flex items-center justify-between w-full">
    {timer.notes && (
      <p className="text-sm text-[#B4B7E5] flex items-center gap-1.5">
        <NotebookPen className="w-4 h-4" /> {timer.notes}
      </p>
    )}
    <div className="flex justify-end gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="p-1 hover:bg-[#1F2137] rounded-md transition-colors"
      >
        <Pencil strokeWidth={1.5} className="h-4 w-4 text-[#B4B7E5]" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1 hover:bg-[#1F2137] rounded-md transition-colors"
      >
        <Trash2 strokeWidth={1.5} className="h-4 w-4 text-[#B4B7E5]" />
      </button>
    </div>
  </div>
);
