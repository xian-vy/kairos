"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useBossDataStore } from "@/stores/bossDataStore";
import { useBossTimersStore } from "@/stores/bossTimersStore";
import type { BossTimer } from "@/types/database.types";
import { LayoutGrid, ListChecks } from "lucide-react";
import { useCallback, useState } from "react";
import { sortTimers } from "../helper";
import { TimerCard } from "./BossTimerCard";
import { DeleteDialog } from "./BossTimerDeleteDialog";
import { BossTimerDialog } from "./BossTimerDialog";
import { BossTimerListSkeleton } from "./BossTimerSkeleton";
import useRealtimeTimers from "@/hooks/useRealtimeTimers";

export function BossTimerList() {
  const { timers, isLoading, deleteTimer } = useBossTimersStore();
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [timerToDelete, setTimerToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [timerToEdit, setTimerToEdit] = useState<BossTimer | null>(null);
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"list" | "group">("list");
  const { bossData, isLoading: isLoading2 } = useBossDataStore();
  const RealtimeTimerListener  = useRealtimeTimers();


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

    await deleteTimer(timerToDelete,(options) => toast({ ...options, variant: options.variant as "default" | "destructive" }));

    setDeleteDialogOpen(false);
    setTimerToDelete(null);
  }, [timerToDelete, deleteTimer,toast]);

  const handleEdit = useCallback((timer: BossTimer) => {
    //setTimerToEdit(enrichTimerWithLocations(timer, bossData));
    setTimerToEdit(timer);
    setEditDialogOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditDialogOpen(false);
    setTimerToEdit(null);
  }, []);

  const getGroupedTimers = useCallback((timers: BossTimer[]) => {
    const sortOrder = bossData.reduce((acc, boss) => {
      acc[boss.boss_name] = boss.sortOrder;
      return acc;
    }, {} as Record<string, number>);
  
    const groups = timers.reduce((acc, timer) => {
      const bossName = timer.boss_name;
      if (!acc[bossName]) {
        acc[bossName] = [];
      }
      acc[bossName].push(timer);
      return acc;
    }, {} as Record<string, BossTimer[]>);
  
    const sortedGroups = Object.keys(groups)
      .sort((a, b) => (sortOrder[a] ?? 0) - (sortOrder[b] ?? 0))
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {} as Record<string, BossTimer[]>);
  
    return sortedGroups;
  }, [bossData]);

  const activeTimers = sortTimers(timers, bossData);
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
          activeTimers.map((bossTimer) => (
            <TimerCard
              key={bossTimer.id}
              timer={bossTimer}
              isExpanded={expandedCards[bossTimer.id!] || false}
              onToggle={() => toggleCard(bossTimer.id!)}
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
                {bossTimers.map((bossTimer) => (
                  <TimerCard
                    key={bossTimer.id}
                    timer={bossTimer}
                    isExpanded={expandedCards[bossTimer.id!] || false}
                    onToggle={() => toggleCard(bossTimer.id!)}
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
          bossTimer={timerToEdit}
          onTimerCreated={handleCloseEdit}
        />
      )}    
      {RealtimeTimerListener}
    </>
  );
}
