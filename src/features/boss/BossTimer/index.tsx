"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeBossTimers } from "@/hooks/useRealtimeBossTimers";
import type { BossTimer } from "@/types/boss";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LayoutGrid, ListChecks } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { enrichTimerWithLocations, sortTimers } from "../helper";
import { TimerCard } from "./BossTimerCard";
import { DeleteDialog } from "./BossTimerDeleteDialog";
import { BossTimerDialog } from "./BossTimerDialog";
import { BossTimerListSkeleton } from "./BossTimerSkeleton";
import { useGroupBossData } from "@/hooks/useGroupBossData";

export function BossTimerList() {
  const { timers, isLoading } = useRealtimeBossTimers();
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [, forceUpdate] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [timerToDelete, setTimerToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [timerToEdit, setTimerToEdit] = useState<BossTimer | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [viewMode, setViewMode] = useState<"list" | "group">("list");
  const { bossData, isLoading :isLoading2 } = useGroupBossData();

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
    setTimerToEdit(enrichTimerWithLocations(timer,bossData));
    setEditDialogOpen(true);
  }, [bossData]);

  const handleCloseEdit = useCallback(() => {
    setEditDialogOpen(false);
    setTimerToEdit(null);
  }, []);

  const getGroupedTimers = useCallback((timers: BossTimer[]) => {
    return timers.reduce((groups, timer) => {
      const bossName = timer.boss_name;
      if (!groups[bossName]) {
        groups[bossName] = [];
      }
      groups[bossName].push(timer);
      return groups;
    }, {} as Record<string, BossTimer[]>);
  }, []);

  const activeTimers = sortTimers(timers,bossData);
  const groupedTimers = getGroupedTimers(activeTimers);

  if (isLoading || isLoading2) {
    return <BossTimerListSkeleton />;
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <div className="flex space-x-2 bg-[#0D0F23] rounded-lg p-1">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-7 "
          >
            <ListChecks className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "group" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("group")}
            className="h-7"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {activeTimers.length === 0 ? (
          <p className="text-center text-[#B4B7E5] py-4">No active timers</p>
        ) : viewMode === "list" ? (
          activeTimers.map((timer) => (
            <TimerCard
              key={timer.id}
              timer={timer}
              isExpanded={expandedCards[timer.id] || false}
              onToggle={() => toggleCard(timer.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              bossData={bossData}
            />
          ))
        ) : (
          Object.entries(groupedTimers).map(([bossName, bossTimers]) => (
            <div key={bossName} className="space-y-2">
              <h3 className="text-base font-semibold text-[#B4B7E5] px-2">{bossName}</h3>
              <div className="space-y-2 pl-4">
                {bossTimers.map((timer) => (
                  <TimerCard
                    key={timer.id}
                    timer={timer}
                    isExpanded={expandedCards[timer.id] || false}
                    onToggle={() => toggleCard(timer.id)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    bossData={bossData}
                  />
                ))}
              </div>
            </div>
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
