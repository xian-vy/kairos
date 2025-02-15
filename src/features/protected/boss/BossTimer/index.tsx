"use client";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeBossTimers } from "@/hooks/useRealtimeBossTimers";
import type { BossTimer } from "@/types/boss";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useCallback, useEffect, useState } from "react";
import { enrichTimerWithLocations, sortTimers } from "../helper";
import { TimerCard } from "./BossTimerCard";
import { DeleteDialog } from "./BossTimerDeleteDialog";
import { BossTimerDialog } from "./BossTimerDialog";

export function BossTimerList() {
  const { timers } = useRealtimeBossTimers();
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [, forceUpdate] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [timerToDelete, setTimerToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [timerToEdit, setTimerToEdit] = useState<BossTimer | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const interval = setInterval(() => forceUpdate({}), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleCard = useCallback((id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTimerToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!timerToDelete) return;

    const { error } = await supabase.from("boss_timers").delete().eq("id", timerToDelete);

    if (error) {
      toast({
        title: "Error deleting timer",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Timer deleted",
        description: "The timer has been deleted successfully",
      });
    }
    setDeleteDialogOpen(false);
    setTimerToDelete(null);
  }, [timerToDelete, supabase, toast]);

  const handleEdit = useCallback((timer: BossTimer) => {
    setTimerToEdit(enrichTimerWithLocations(timer));
    setEditDialogOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditDialogOpen(false);
    setTimerToEdit(null);
  }, []);

  const activeTimers = sortTimers(timers);

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

      <DeleteDialog isOpen={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={confirmDelete} />

      {timerToEdit && (
        <BossTimerDialog
          isOpen={editDialogOpen}
          onClose={handleCloseEdit}
          bossName={timerToEdit.boss_name}
          locations={timerToEdit.allLocations || [timerToEdit.location]}
          selectedLocation={timerToEdit.location}
          initialNotes={timerToEdit.notes || ""}
          initialTimeOfDeath={new Date(timerToEdit.time_of_death).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
          timerId={timerToEdit.id}
          onTimerCreated={handleCloseEdit}
        />
      )}
    </>
  );
}
